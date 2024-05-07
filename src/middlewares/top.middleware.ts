import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { httpLogger } from "../utils/logger.utils";

const topLevelMiddleware = (app: Application) => {
  //middleware for cors
  app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );

  //middleware for parsing incoming data
  app.use(
    express.urlencoded({
      extended: true,
      limit: "50mb",
    })
  );

  //handle json
  app.use(express.json());

  //middleware for security
  app.use(helmet());

  // printing the request
  app.use(httpLogger);
};

export default topLevelMiddleware;
