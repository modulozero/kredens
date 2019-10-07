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

import { server as graphqlServer } from "@kredens/api";
import { authMiddleware } from "@kredens/auth";
import { db } from "@kredens/db";
import logger from "@kredens/logger";
import indexRouter from "@kredens/routes/";
import bootstrapRouter from "@kredens/routes/bootstrap";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import express from "express";
import pinoExpress from "express-pino-logger";
import session, { SessionOptions } from "express-session";
import helmet from "helmet";
import createHttpError from "http-errors";
async function main() {
  await db.tx(async t => {
    await t.migrations.create();
    await t.migrations.apply();
  });

  const app = express();
  const expressPino = pinoExpress({ logger });
  app.use(helmet());
  app.use(expressPino);

  if (app.settings.env === "development") {
    const webpack = await import("webpack").then(p => p.default); // tslint:disable-line:no-implicit-dependencies
    // tslint:disable-next-line:no-implicit-dependencies
    const webpackDevMiddleware = await import("webpack-dev-middleware").then(
      p => p.default
    );
    const config = await import("../webpack.config").then(p => p.default);

    const compiler = webpack(config);
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: "/assets/"
      })
    );
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  const sessionOptions: SessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionOptions.cookie.secure = true;
  }
  app.use(session(sessionOptions));
  app.use("/bootstrap", bootstrapRouter);

  app.use(authMiddleware());
  const apiServer = graphqlServer();
  apiServer.applyMiddleware({
    app,
    path: "/graphql"
  });

  app.use(csrf());

  app.set("view engine", "pug");

  app.use(async (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.user = req.user;

    next();
  });

  app.use("/", indexRouter);

  app.use((req, res, next) => {
    next(createHttpError(404));
  });

  const port = 3000;
  app.listen(port, () =>
    logger.info("Example app listening", {
      uri: `http://localhost:${port}${apiServer.graphqlPath}`
    })
  );
}

main();
