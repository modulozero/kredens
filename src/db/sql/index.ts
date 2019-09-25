import { existsSync, readdirSync } from "fs";
import { Maybe, None, Some } from "monet";
import path from "path";
import { QueryFile } from "pg-promise";

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

export { migrations };

/** Helper for linking to external query files */
function sql(file: string): QueryFile {
  const fullPath = path.join(__dirname, file);

  return new QueryFile(fullPath, { minify: true });
}

function ifExists(file: string): Maybe<string> {
  const fullPath = path.join(__dirname, file);
  if (existsSync(fullPath)) {
    return Some(file);
  } else {
    return None();
  }
}

function subdirs(dir: string): string[] {
  const fullPath = path.join(__dirname, dir);
  return readdirSync(fullPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory)
    .map(dirent => dirent.name)
    .sort();
}
