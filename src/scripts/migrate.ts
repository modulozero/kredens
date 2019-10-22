import fs from "fs";
import { DateTime } from "luxon";
import path from "path";
import yargs from "yargs";

const _ = yargs
  .scriptName("migrate")
  .command(
    "new [name]",
    "create a new migration",
    args => {
      args.positional("name", {
        type: "string",
        describe: "name of the migration"
      });
    },
    argv => {
      const now = DateTime.utc().toFormat("yyyyMMddHHmmss");
      const dirName = path.join(
        "sql",
        "migrations",
        "patches",
        `${now}-${argv.name}`
      );
      fs.mkdirSync(dirName);
      fs.closeSync(fs.openSync(path.join(dirName, "up.sql"), "w"));
      fs.closeSync(fs.openSync(path.join(dirName, "down.sql"), "w"));
      console.log(`Created ${dirName}`); // tslint:disable-line:no-console
    }
  )
  .help().argv;
