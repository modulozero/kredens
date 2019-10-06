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

import { existsSync, readdirSync } from "fs";
import { Maybe, None, Some } from "monet";
import path from "path";
import { QueryFile } from "pg-promise";

const sqlDir = path.join(process.cwd(), "sql");

const migrations = {
  applied: sql("migrations/applied.sql"),
  apply: sql("migrations/apply.sql"),
  create: sql("migrations/create.sql"),
  patches: subdirs(path.join("migrations", "patches")).map(patchName => ({
    down: ifExists(
      path.join("migrations", "patches", patchName, "down.sql")
    ).map(sql),
    name: patchName,
    up: ifExists(path.join("migrations", "patches", patchName, "up.sql")).map(
      sql
    )
  }))
};

const users = {
  create: sql("users/create.sql"),
  login: sql("users/login.sql")
};

export { migrations, users };

/** Helper for linking to external query files */
function sql(file: string): QueryFile {
  const fullPath = path.join(sqlDir, file);

  return new QueryFile(fullPath, { minify: true });
}

function ifExists(file: string): Maybe<string> {
  const fullPath = path.join(sqlDir, file);
  if (existsSync(fullPath)) {
    return Some(file);
  } else {
    return None();
  }
}

function subdirs(dir: string): string[] {
  const fullPath = path.join(sqlDir, dir);
  return readdirSync(fullPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory)
    .map(dirent => dirent.name)
    .sort();
}
