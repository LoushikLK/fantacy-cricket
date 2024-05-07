import { Application } from "express";
import { readdirSync } from "fs";
import path from "path";

const routerHandler = (app: Application) => {
  //find all the folder in the app directory and import all the routes
  const allFolders = readdirSync(path.join(__dirname, "..", "routes"));

  allFolders.forEach((folder) => {
    //if route file present then import it
    if (folder?.includes(".routes.")) {
      const router = require(path.join(__dirname, "..", "routes", folder));
      app.use("/api/v1/", router.default);
    }
  });
};

export default routerHandler;
