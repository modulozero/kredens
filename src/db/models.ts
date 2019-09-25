import { DateTime } from "luxon";

export interface Migration {
  id: number;
  name: string;
  applied_at: DateTime;
}
