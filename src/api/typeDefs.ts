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

import { gql } from "apollo-server-express";

export default gql`
  type Query {
    "A simple type for getting started"
    node(id: ID!): Node
    hello: String
    migrations: [Migration]!
    user(id: ID): User
  }

  interface Node {
    id: ID!
  }

  type Migration implements Node {
    id: ID!
    name: String!
    appliedAt: DateTime!
  }

  type User implements Node {
    id: ID!
    email: String!
    tasks(after: String, first: Int, before: String, last: Int): TaskConnection
  }

  type Task implements Node {
    id: ID!
    name: String!
    notes: String
    schedule: ScheduleType!
    minFrequency: Int
    maxFrequency: Int
    createdAt: DateTime!
  }

  type TaskConnection {
    edges: [TaskEdge]
    pageInfo: PageInfo!
  }

  type TaskEdge {
    cursor: String!
    node: Task
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPrevPage: Boolean!
    startCursor: String
    endCursor: String
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
