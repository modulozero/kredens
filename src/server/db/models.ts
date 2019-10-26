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

import { DateTime } from "luxon";

export interface Migration {
  id: number;
  name: string;
  appliedAt: DateTime;
}

export interface User {
  id: number;
  email: string;
}

export enum ScheduleType {
  Once = "once",
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly"
}

export interface Task {
  id: number;
  owner: number;
  name: string;
  notes?: string;
  schedule: ScheduleType;
  minFrequency?: number;
  maxFrequency?: number;
  createdAt: DateTime;
}

export interface Session {
  sid: string;
  session: SessionData;
}
