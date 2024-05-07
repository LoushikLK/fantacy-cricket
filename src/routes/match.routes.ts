import express from "express";
import { MatchController } from "../controllers/match.controllers";
import { InputValidator } from "../middlewares/formValidator.middleware";
import { TeamValidation } from "../validations/match.validations";

const router = express.Router();

//create team
router.post(
  "/add-team",
  TeamValidation.addTeamValidation,
  InputValidator,
  MatchController.createYourTeam
);
//Process Result
router.post("/process-result", MatchController.publishResult);

//Fetch Team Result
router.get("/team-result", MatchController.fetchTeamResult);

export default router;
