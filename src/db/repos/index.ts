import { MigrationRepository } from "./migrations";

export interface Extensions {
  migrations: MigrationRepository;
}

export { MigrationRepository };
