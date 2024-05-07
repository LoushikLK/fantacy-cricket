import { Application } from "express";
import errorHandler from "../helpers/error.helper";

const bottomLevelMiddleware = (app: Application) => {
  //handle not created route
  app.use(async (req, res, next) => {
    res.status(404);
    res.json({
      msg: "Not Found",
      success: false,
    });
  });

  app.use(errorHandler); //handle error
};

export default bottomLevelMiddleware;
