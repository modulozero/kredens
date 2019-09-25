import { ApolloServer, gql } from "apollo-server-express";
import { Kind } from "graphql/language";
import { GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql/type";
import { DateTime } from "luxon";

import { db } from "./db";

const typeDefs = gql`
  type Query {
    "A simple type for getting started"
    hello: String
    migrations: [Migration]!
  }

  type Migration {
    id: ID
    name: String!
    applied_at: DateTime!
  }

  scalar DateTime
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
    hello: async () => {
      return `Hello, world!`;
    },
    migrations: async () => {
      return db.migrations.applied();
    }
  }
};

export function server() {
  return new ApolloServer({
    resolvers,
    typeDefs
  });
}
