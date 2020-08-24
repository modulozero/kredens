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

import { Task } from "@kredens/server/db/models";
import { tasks as sql } from "@kredens/server/db/sql";
import { IDatabase, IMain } from "pg-promise";

function rowToTask(row: any): Task {
  return {
    id: +row.id,
    owner: +row.owner,
    name: row.name,
    notes: row.notes,
    schedule: row.schedule,
    createdAt: row.created_at,
  };
}

export class TaskRepository {
  private db: IDatabase<any>;

  constructor(db: IDatabase<any>, _pgp: IMain) {
    this.db = db;
  }

  public async list(
    owner: number,
    limit?: number,
    offset?: number
  ): Promise<Task[]> {
    return this.db.map(sql.list, [owner, limit || 10, offset || 0], (row) =>
      rowToTask(row)
    );
  }

  public async count(owner: number): Promise<number> {
    return this.db.one(sql.count, [owner], (row) => +row.c);
  }
}
