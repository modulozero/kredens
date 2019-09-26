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

import { users as sql } from "@kredens/db/sql";
import argon2 from "argon2";
import { Maybe, None, Some } from "monet";
import { IDatabase, IMain } from "pg-promise";

export class UserRepository {
  private db: IDatabase<any>;

  constructor(db: IDatabase<any>, pgp: IMain) {
    this.db = db;
  }

  public async login(email: string, password: string): Promise<Maybe<number>> {
    const { id, encryptedPassword } = await this.db
      .oneOrNone(sql.login, [email])
      .then(user => ({
        encryptedPassword: user.encrypted_password,
        id: +user.id
      }));
    if (id === null) {
      return None();
    }

    return (await argon2.verify(encryptedPassword, password))
      ? Some(id)
      : None();
  }

  public async create(email: string, password: string): Promise<number> {
    const encryptedPassword = await argon2.hash(password);
    return this.db
      .one(sql.create, [email, encryptedPassword])
      .then((user: { id: number }) => +user.id);
  }
}
