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

import { ScheduleType, Task } from "@kredens/db/models";
import { tasks as sql } from "@kredens/db/sql";
import { IDatabase, IMain } from "pg-promise";

function rowToTask(row: any): Task {
  return {
    createdAt: row.created_at,
    id: +row.id,
    maxFrequency: +row.maxFrequency,
    minFrequency: +row.minFrequency,
    name: row.name,
    notes: row.notes,
    owner: +row.owner,
    schedule: row.schedule as ScheduleType
  };
}

export class TaskRepository {
  private db: IDatabase<any>;

  constructor(db: IDatabase<any>, pgp: IMain) {
    this.db = db;
  }

  public async list(
    owner: number,
    limit?: number,
    after?: number,
    before?: number
  ): Promise<Task[]> {
    return this.db.map(sql.list, [owner, after, before, limit || 10], row =>
      rowToTask(row)
    );
  }

  public async listReverse(
    owner: number,
    limit?: number,
    after?: number,
    before?: number
  ): Promise<Task[]> {
    return this.db.map(sql.list, [owner, after, before, limit || 10], row =>
      rowToTask(row)
    );
  }

  public async hasNext(owner: number, after: number): Promise<boolean> {
    return this.db.one(sql.hasNext, [owner, after]).then(row => row.r);
  }

  public async hasPrev(owner: number, before: number): Promise<boolean> {
    return this.db.one(sql.hasPrev, [owner, before]).then(row => row.r);
  }
}
