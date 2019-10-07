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

import { box, unbox } from "@kredens/crypto";
import { db } from "@kredens/db";
import express from "express";
import createHttpError from "http-errors";
import { DateTime } from "luxon";

interface Token {
  expires: string;
}

const router = express.Router();

router.get("/", async (req, res, next) => {
  const token: Token = {
    expires: DateTime.local()
      .plus({ hours: 2 })
      .toISO()
  };
  req.log.info("Token issued", { token: box(token) });
});

router.post("/", async (req, res, next) => {
  const token: Token = unbox(req.body.token);
  const expired = DateTime.fromISO(token.expires).diffNow();
  if (expired.as("milliseconds") < 0) {
    next(createHttpError(401));
    return;
  }

  const email: string = req.body.email;
  const password: string = req.body.password;

  if (!email || !password || password.length < 8) {
    res.send("Please provide an email and a password longer than 8 characters");
    return;
  }
  await db.users.create(email, password);
});

export default router;
