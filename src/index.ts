import express from "express";
import { createServer, Server } from "http";
import connectDB from "./config/db.config";
import routerHandler from "./helpers/router.helper";
import bottomLevelMiddleware from "./middlewares/bottom.middleware";
import topLevelMiddleware from "./middlewares/top.middleware";
import { logger } from "./utils/logger.utils";
require("dotenv").config();

const app: express.Application = express();
const PORT = process.env.APP_PORT || 8000;
const server: Server = createServer(app);

connectDB(); //connect to db
topLevelMiddleware(app); //setup middleware
routerHandler(app); //this automatically creates routes in the routes folder
bottomLevelMiddleware(app); //setup bottom middleware handles (e.g. error ,not found route)

server.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
