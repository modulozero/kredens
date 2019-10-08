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

import { Store } from "@holdyourwaffle/express-session";
import { db } from "@kredens/db";
import { DateTime, Duration } from "luxon";

export class PgStore extends Store {
  private ttl: Duration;
  constructor(options: { ttl?: Duration } = {}) {
    super();
    this.ttl = options.ttl || Duration.fromObject({ days: 1 }); // One day in seconds.
  }

  public get(
    sid: string,
    cb: (err: any, session?: SessionData | null) => void
  ) {
    db.sessions
      .get(sid)
      .then(s => cb(null, s.map(ss => ss.session).orNull()))
      .catch(r => cb(r, null));
  }

  public set(sid: string, session: SessionData, cb?: (err?: any) => void) {
    const expiresAt = this.getExpiresAt(session);
    const p = db.sessions.set(sid, session, expiresAt);

    if (cb) {
      p.then(s => cb(null)).catch(r => cb(r));
    }
  }

  public destroy(sid: string, cb?: (err?: any) => void) {
    const p = db.sessions.destroy(sid);

    if (cb) {
      p.then(s => cb()).catch(r => cb(r));
    }
  }

  public all(
    cb: (err: any, obj?: { [sid: string]: SessionData } | null) => void
  ) {
    db.sessions
      .all()
      .then(ss => {
        const sessions: { [sid: string]: SessionData } = {};

        for (const s of ss) {
          sessions[s.sid] = s.session;
        }

        cb(null, sessions);
      })
      .catch(r => cb(r, null));
  }

  public length(cb: (err: any, length: number) => void) {
    db.sessions
      .length()
      .then(l => cb(null, l))
      .catch(r => cb(r, 0));
  }

  public clear(cb?: (err?: any) => void) {
    const p = db.sessions.clear();
    if (cb) {
      p.then(() => cb()).catch(r => cb(r));
    }
  }

  public touch(sid: string, session: SessionData, cb?: (err?: any) => void) {
    const p = db.sessions.touch(sid, this.getExpiresAt(session));
    if (cb) {
      p.then(() => cb()).catch(r => cb(r));
    }
  }

  private getExpiresAt(session: SessionData) {
    if (session && session.cookie && session.cookie.expires) {
      return DateTime.fromJSDate(session.cookie.expires);
    } else {
      return DateTime.local().plus(this.ttl);
    }
  }
}
