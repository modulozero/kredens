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

import { db } from "@kredens/db";
import { User } from "@kredens/db/models";
import express from "express";
import createHttpError from "http-errors";
import { None } from "monet";

export const getUser = async (req: express.Request) =>
  req.session.userID ? db.users.details(req.session.userID) : None<User>();

export const authMiddleware: () => express.Handler = () => async (
  req,
  res,
  next
) => {
  if (req.session.userID) {
    const user = await getUser(req);

    if (user.isSome()) {
      req.user = user.some();
    } else {
      delete req.session.userID;
    }
  }

  next();
};

export const requireAuthMiddleware: express.Handler = (req, res, next) => {
  if (!req.user) {
    next(createHttpError(401));
  }

  next();
};
