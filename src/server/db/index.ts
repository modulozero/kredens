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

import {
  Extensions,
  MigrationRepository,
  SessionRepository,
  TaskRepository,
  UserRepository
} from "@kredens/server/db/repos";
import { DateTime } from "luxon";
import pg from "pg";
import pgPromise, { IDatabase, IInitOptions } from "pg-promise";

const types = pg.types;
types.setTypeParser(types.builtins.TIMESTAMPTZ, DateTime.fromSQL);
types.setTypeParser(types.builtins.TIMESTAMP, DateTime.fromSQL);

type ExtendedProtocol = IDatabase<Extensions> & Extensions;

const initOptions: IInitOptions<Extensions> = {
  extend(obj: ExtendedProtocol, dc: any) {
    obj.migrations = new MigrationRepository(obj, pgp);
    obj.tasks = new TaskRepository(obj, pgp);
    obj.users = new UserRepository(obj, pgp);
    obj.sessions = new SessionRepository(obj, pgp);
  }
};

const pgp: pgPromise.IMain = pgPromise(initOptions);

if (process.env.NODE_ENV !== "production") {
  // tslint:disable-next-line:no-implicit-dependencies
  import("pg-monitor").then(monitor => monitor.attach(initOptions));
}

const db: ExtendedProtocol = pgp(process.env.DATABASE_URL);
export { db, pgp };
