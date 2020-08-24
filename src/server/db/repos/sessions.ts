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

import { Session } from "@kredens/server/db/models";
import { sessions as sql } from "@kredens/server/db/sql";
import { DateTime } from "luxon";
import { Maybe } from "monet";
import { IDatabase, IMain } from "pg-promise";

export class SessionRepository {
  private db: IDatabase<any>;

  constructor(db: IDatabase<any>, _pgp: IMain) {
    this.db = db;
  }

  public async all(): Promise<Session[]> {
    return this.db.map(sql.all, [], (row) => ({
      session: row.session,
      sid: row.sid,
    }));
  }

  public async clear() {
    return this.db.none(sql.clear);
  }

  public async destroy(sid: string) {
    return this.db.none(sql.destroy, [sid]);
  }

  public async get(sid: string): Promise<Maybe<Session>> {
    return this.db.oneOrNone(sql.get, [sid]).then((row) =>
      row
        ? Maybe.Some({
            session: row.session,
            sid: row.sid,
          })
        : Maybe.None()
    );
  }

  public async length(): Promise<number> {
    return this.db.one(sql.length).then((row) => +row.length);
  }

  public async set(sid: string, session: SessionData, expiresAt: DateTime) {
    return this.db.none(sql.set, [
      sid,
      JSON.stringify(session),
      expiresAt.toSQL(),
    ]);
  }

  public async touch(sid: string, expiresAt: DateTime) {
    return this.db.none(sql.touch, [sid, expiresAt.toSQL()]);
  }
}
