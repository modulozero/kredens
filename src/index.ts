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
import { db } from "@kredens/db";
import logger from "@kredens/logger";
import indexRouter from "@kredens/routes/";
import cookieParser from "cookie-parser";
import express from "express";
import pinoExpress from "express-pino-logger";
import helmet from "helmet";
import createHttpError from "http-errors";

async function main() {
  await db.tx(async t => {
    await t.migrations.create();
    await t.migrations.apply();
  });

  const server = graphqlServer();
  const app = express();
  const expressPino = pinoExpress({ logger });
  app.use(helmet());
  app.use(expressPino);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  if (app.settings.env === "development") {
    const webpack = require("webpack"); // tslint:disable-line:no-implicit-dependencies
    const webpackDevMiddleware = require("webpack-dev-middleware"); // tslint:disable-line:no-implicit-dependencies
    const config = require("../webpack.config").default;

    const compiler = webpack(config);
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: "/assets/"
      })
    );
  }

  app.set("view engine", "pug");

  app.use("/", indexRouter);
  server.applyMiddleware({ app, path: "/graphql" });

  app.use((req, res, next) => {
    next(createHttpError(404));
  });

  const port = 3000;
  app.listen(port, () =>
    logger.info("Example app listening", {
      uri: `http://localhost:${port}${server.graphqlPath}`
    })
  );
}

main();
