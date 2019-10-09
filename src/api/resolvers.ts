// Copyright (C) 2019 ModZero <modzero@modzero.xyz>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { db } from "@kredens/db";
import * as models from "@kredens/db/models";
import { IResolvers } from "graphql-tools";
import { Kind } from "graphql/language";
import { GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql/type";
import { DateTime } from "luxon";
import { Maybe } from "monet";

const dateTimeConfig: GraphQLScalarTypeConfig<DateTime, string> = {
  name: "DateTime",
  description: "Date custom scalar type",
  serialize(value) {
    return (value as DateTime).toISO();
  },
  parseValue(value) {
    return DateTime.fromISO(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return DateTime.fromISO(ast.value);
    }

    return null;
  }
};

interface Context {
  user?: models.User;
}

interface Node {
  ID: string;
}

interface User extends Node {
  email?: string;
  tasks?: Connection<Task>;
}

type ScheduleType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

interface Task extends Node {
  name: string;
  notes?: string;
  schedule: ScheduleType;
  minFrequency?: number;
  maxFrequency?: number;
  createdAt: DateTime;
}

interface PaginationArguments {
  after?: string;
  first?: number;
  before?: string;
  last?: number;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

interface Edge<T extends Node> {
  cursor: string;
  node?: T;
}

interface Connection<T extends Node> {
  edges?: Array<Edge<T>>;
  pageInfo: PageInfo;
}

enum NodeKind {
  User = "USER",
  Task = "TASK"
}

const nodeKindFrom = (kind: string) => {
  const keys = Object.keys(NodeKind).filter(x => NodeKind[x] === kind);
  return keys.length > 0
    ? Maybe.some<NodeKind>(NodeKind[keys[0]])
    : Maybe.none<NodeKind>();
};

interface ID {
  kind: NodeKind;
  id: number;
}

const getId = (id: string) => {
  const [kindStr, idStr] = Buffer.from(id, "base64")
    .toString()
    .split(":");
  const kind = nodeKindFrom(kindStr);

  return kind.flatMap<ID>(k => {
    const actualId = parseInt(idStr, 10);

    return isNaN(actualId)
      ? Maybe.none()
      : Maybe.some({ id: actualId, kind: k });
  });
};

const getIdOfKind = (id: string, kind: NodeKind) =>
  getId(id).filter(i => i.kind === kind);

const buildId = (kind: NodeKind, id: number) =>
  Buffer.from(`${kind}:${id}`).toString("base64");

const scheduleTypeMap: { [id: string]: ScheduleType } = {
  [models.ScheduleType.Once]: "ONCE",
  [models.ScheduleType.Daily]: "DAILY",
  [models.ScheduleType.Weekly]: "WEEKLY",
  [models.ScheduleType.Monthly]: "MONTHLY",
  [models.ScheduleType.Yearly]: "YEARLY"
};

async function userTasks(
  user: { id: string },
  args: PaginationArguments
): Promise<Connection<Task>> {
  return db.task<Connection<Task>>(async t => {
    const after =
      args.after &&
      Maybe.some(args.before)
        .flatMap(id => getIdOfKind(id, NodeKind.Task))
        .some().id;
    const before =
      args.before &&
      Maybe.fromFalsy(args.before)
        .flatMap(id => getIdOfKind(id, NodeKind.Task))
        .some().id;
    const userId = getId(user.id).some().id;

    let rows =
      args.first || !(args.first || args.last)
        ? await t.tasks.list(userId, args.first, after, before)
        : (await t.tasks.listReverse(
            userId,
            args.last,
            after,
            before
          )).reverse();

    if (args.first && args.last) {
      rows = rows.slice(-1 * args.last);
    }

    return {
      edges: rows.map(row => ({
        cursor: buildId(NodeKind.Task, row.id),
        node: {
          ID: buildId(NodeKind.Task, row.id),
          createdAt: row.createdAt,
          maxFrequency: row.maxFrequency,
          minFrequency: row.minFrequency,
          name: row.name,
          notes: row.notes,
          schedule: scheduleTypeMap[row.schedule]
        }
      })),
      pageInfo: {
        hasNextPage:
          rows.length > 0 ? await t.tasks.hasNext(userId, rows[0].id) : false,
        hasPrevPage:
          rows.length > 0
            ? await t.tasks.hasPrev(userId, rows[rows.length - 1].id)
            : false,
        startCursor:
          rows.length > 0 ? buildId(NodeKind.Task, rows[0].id) : null,
        endCursor:
          rows.length > 0
            ? buildId(NodeKind.Task, rows[rows.length - 1].id)
            : null
      }
    };
  });
}

const resolvers: IResolvers<any, Context> = {
  DateTime: new GraphQLScalarType(dateTimeConfig),
  Query: {
    hello: () => `Hello, world!`,
    migrations: () => db.migrations.applied(),
    user: async (parent: any, { id }: { id?: string }, context) =>
      Maybe.fromFalsy(id)
        .orElse(Maybe.some(buildId(NodeKind.User, context.user.id)))
        .flatMap(i => getId(i))
        .filter(i => i.kind === NodeKind.User)
        .filter(i => i.id === context.user.id)
        .map(i =>
          db.users.details(i.id).then(user =>
            user
              .map(u => ({
                email: u.email,
                id: buildId(NodeKind.User, u.id)
              }))
              .orNull()
          )
        )
        .orNull()
  },
  User: {
    tasks: userTasks
  }
};

export default resolvers;
