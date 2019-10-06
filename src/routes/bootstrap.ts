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
