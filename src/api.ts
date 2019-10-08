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
import { User } from "@kredens/db/models";
import { ApolloServer, AuthenticationError, gql } from "apollo-server-express";
import { Kind } from "graphql/language";
import { GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql/type";
import { DateTime } from "luxon";

const typeDefs = gql`
  type Query {
    "A simple type for getting started"
    hello: String
    migrations: [Migration]!
    user(id: ID): User
  }

  type Migration {
    id: ID!
    name: String!
    applied_at: DateTime!
  }

  type User {
    id: ID!
    email: String!
    tasks: [Task]!
  }

  type Task {
    id: ID
    name: String!
    notes: String
    schedule: ScheduleType!
    min_frequency: Int
    max_frequency: Int
    created_at: DateTime!
  }

  scalar DateTime

  enum ScheduleType {
    ONCE
    DAILY
    WEEKLY
    MONTHLY
    YEARLY
  }
`;

const dateTimeConfig: GraphQLScalarTypeConfig<DateTime, string> = {
  description: "Date custom scalar type",
  name: "DateTime",
  parseValue(value) {
    return DateTime.fromISO(value as string);
  },
  serialize(value) {
    return (value as DateTime).toISO();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return DateTime.fromISO(ast.value);
    }

    return null;
  }
};

const resolvers = {
  DateTime: new GraphQLScalarType(dateTimeConfig),
  Query: {
    hello: () => `Hello, world!`,
    migrations: () => db.migrations.applied(),
    user: async (
      parent: any,
      { id }: { id: string },
      context: { user?: User }
    ) => {
      if (!context.user || context.user.id !== +id) {
        throw new AuthenticationError(
          "You cannot query users other than yourself"
        );
      }
      return db.users.details(+id).then(user => user.orNull());
    }
  },
  User: {
    tasks: (user: User) =>
      db.tasks.list(user.id).then(tasks =>
        tasks.map(t => ({
          ...t,
          schedule: t.schedule.toUpperCase()
        }))
      )
  }
};

export function server() {
  return new ApolloServer({
    context: async req => {
      const user = req.req.user;

      if (!user) {
        throw new AuthenticationError("you must be logged in");
      }

      return {
        user
      };
    },
    resolvers,
    typeDefs
  });
}
