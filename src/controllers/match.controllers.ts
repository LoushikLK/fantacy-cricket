import {
  checkFinalResult,
  createTeam,
  processFinalResult,
} from "../services/match.services";
import { RequestHandler } from "../types";

export const MatchController: {
  createYourTeam: RequestHandler;
  publishResult: RequestHandler;
  fetchTeamResult: RequestHandler;
} = {
  createYourTeam: async (req, res, next) => {
    try {
      const { teamName, players, captain, viceCaptain } = req?.body;

      const teamId = await createTeam({
        teamName,
        players,
        captain,
        viceCaptain,
      });

      res.status(201).json({
        msg: "Team Created Successfully",
        success: true,
        data: teamId,
      });
    } catch (error) {
      next(error);
    }
  },
  publishResult: async (req, res, next) => {
    try {
      await processFinalResult();

      res.status(200).json({
        msg: "Final Result Published Successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },
  fetchTeamResult: async (req, res, next) => {
    try {
      const result = await checkFinalResult();

      res.status(200).json({
        msg: "Final Result Fetched Successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
