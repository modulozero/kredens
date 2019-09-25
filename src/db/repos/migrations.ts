import { DateTime } from "luxon";
import { IDatabase, IMain } from "pg-promise";
import logger from "../../logger";
import { Migration } from "../models";
import { migrations as sql } from "../sql";

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
    return this.db.map<Migration>(sql.applied, [], row => {
      return {
        applied_at: DateTime.fromSQL(row.applied_at),
        id: +row.id,
        name: row.name
      };
    });
  }
}
