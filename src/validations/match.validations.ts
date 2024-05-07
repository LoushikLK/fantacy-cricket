import { body, ValidationChain } from "express-validator";
import { IPlayer } from "../types/player";

export const addTeamValidation: ValidationChain[] = [
  body("teamName").notEmpty().withMessage("Team name is required*"),
  body("captain").notEmpty().withMessage("Captain is required*"),
  body("viceCaptain").notEmpty().withMessage("Vice Captain is required*"),
  body("players")
    .isArray()
    .withMessage("Players must be an array*")
    .custom((value: any) => {
      let totalPlayer = value?.length;
      let totalWK = value?.filter(
        (player: IPlayer) => player?.Role === "WICKETKEEPER"
      )?.length;
      let totalBat = value?.filter(
        (player: IPlayer) => player?.Role === "BATTER"
      )?.length;
      let totalAll = value?.filter(
        (player: IPlayer) => player?.Role === "ALL-ROUNDER"
      )?.length;
      let totalBowl = value?.filter(
        (player: IPlayer) => player?.Role === "BOWLER"
      )?.length;
      let totalUniqueTeam = Array.from(
        new Set(value?.map((inner: IPlayer) => inner?.Team))
      );
      let teamAPlayerCount = value?.filter(
        (player: IPlayer) => player?.Team === totalUniqueTeam?.[0]
      )?.length;
      let teamBPlayerCount = value?.filter(
        (player: IPlayer) => player?.Team === totalUniqueTeam?.[1]
      )?.length;

      if (totalPlayer != 11) {
        throw new Error(
          "Every cricket team entry must have 11 players exactly*"
        );
      } else if (totalUniqueTeam?.length != 2) {
        throw new Error("Your team must have players from 2 different teams*");
      } else if (teamAPlayerCount < 1 || teamBPlayerCount < 1) {
        throw new Error(
          "A maximum of 10 players can be selected from any one of the teams*"
        );
      } else if (totalWK < 1 || totalWK > 8) {
        throw new Error("Every team must have 1-8 Wicket Keepers*");
      } else if (totalBat < 1 || totalBat > 8) {
        throw new Error("Every team must have 1-8 Batters*");
      } else if (totalAll < 1 || totalAll > 8) {
        throw new Error("Every team must have 1-8 All Rounders*");
      } else if (totalBowl < 1 || totalBowl > 8) {
        throw new Error("Every team must have 1-8 Bowlers*");
      }
      return true;
    }),
];

export const TeamValidation = { addTeamValidation };
