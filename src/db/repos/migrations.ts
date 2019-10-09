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

import { Migration } from "@kredens/db/models";
import { migrations as sql } from "@kredens/db/sql";
import logger from "@kredens/logger";
import { DateTime } from "luxon";
import { IDatabase, IMain } from "pg-promise";

export class MigrationRepository {
  private db: IDatabase<any>;

  constructor(db: IDatabase<any>, pgp: IMain) {
    this.db = db;
  }

  public async create() {
    await this.db.none(sql.create);
  }

  public async apply() {
    const applied = (await this.applied()).map(m => m.name);
    const toApply = sql.patches.filter(
      p => p.up.isSome() && !applied.find(o => o === p.name)
    );

    for (const patch of toApply) {
      logger.info("Applying migration", { name: patch.name });
      await patch.up
        .map(async qf => {
          await this.db.none(qf);
          await this.db.none(sql.apply, [patch.name]);
        })
        .orLazy(() => Promise.resolve());
    }
  }

  public async applied(): Promise<Migration[]> {
    return this.db.map(sql.applied, [], row => ({
      appliedAt: row.applied_at as DateTime,
      id: +row.id,
      name: row.name
    }));
  }
}
