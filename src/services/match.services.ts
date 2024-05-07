import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { NotFound, ServiceUnavailable } from "http-errors";
import path from "path";
import { TeamModel } from "../models/team.model";
import { IMatch } from "../types/match";
import { IPlayer } from "../types/player";

export async function createTeam({
  teamName,
  players,
  captain,
  viceCaptain,
}: {
  teamName: string;
  players: IPlayer[];
  captain: IPlayer;
  viceCaptain: IPlayer;
}) {
  try {
    const team = await TeamModel.create({
      teamName,
      players,
      captain,
      viceCaptain,
    });

    if (!team) throw new ServiceUnavailable("Failed to create team");

    return team?.id;
  } catch (error) {
    throw error;
  }
}
export async function processFinalResult() {
  try {
    //find match data and player data
    const [matchResult, matchPlayers] = await Promise.all<
      [Promise<IMatch[]>, Promise<IPlayer[]>]
    >([
      new Promise(async (resolve, reject) => {
        try {
          let matchDataPath = path.join(__dirname, "..", "data", "match.json");

          if (!existsSync(matchDataPath))
            throw new ServiceUnavailable("Match data not found");

          const data = await readFile(matchDataPath, "utf8");

          if (!data) throw new ServiceUnavailable("Match data not found");

          const matchResult: IMatch[] = JSON.parse(data);

          resolve(matchResult);
        } catch (error) {
          reject(error);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          let playerDataPath = path.join(
            __dirname,
            "..",
            "data",
            "players.json"
          );

          if (!existsSync(playerDataPath))
            throw new ServiceUnavailable("Player data not found");

          const data = await readFile(playerDataPath, "utf8");

          if (!data) throw new ServiceUnavailable("Player data not found");

          const playerResult: IPlayer[] = JSON.parse(data);

          resolve(playerResult);
        } catch (error) {
          reject(error);
        }
      }),
    ]);

    if (!matchResult || !matchPlayers)
      throw new ServiceUnavailable("Match data not found");

    //find playerwise score in that match

    let playWiseScore = new Map<
      string,
      {
        totalRun?: number;
        totalSix?: number;
        totalBoundary?: number;
        totalWicket?: number;
        totalLbw?: number;
        totalBowled?: number;
        overWiseRun?: {
          [key: number]: number;
        };
      }
    >();

    for (let i = 0; i < matchResult.length; i++) {
      let batterPlayer = matchResult[i]?.batter;
      let bowlerPlayer = matchResult[i]?.bowler;
      let batterPrevValue = playWiseScore.get(batterPlayer);
      let bowlerPrevValue = playWiseScore.get(bowlerPlayer);

      let totalRun = matchResult[i]?.batsman_run;
      let totalSix =
        matchResult[i]?.batsman_run === 6 && matchResult[i]?.extras_run === 0
          ? 1
          : 0;
      let totalBoundary =
        matchResult[i]?.batsman_run >= 4 && matchResult[i]?.extras_run === 0
          ? 1
          : 0;

      let totalWicket =
        matchResult[i]?.isWicketDelivery && matchResult[i]?.kind !== "run out"
          ? 1
          : 0;
      let totalLbw =
        matchResult[i]?.isWicketDelivery && matchResult[i]?.kind === "lbw"
          ? 1
          : 0;
      let totalBowled =
        matchResult[i]?.isWicketDelivery && matchResult[i]?.kind === "bowled"
          ? 1
          : 0;

      playWiseScore.set(batterPlayer, {
        totalRun: (batterPrevValue?.totalRun || 0) + totalRun,
        totalSix: (batterPrevValue?.totalSix || 0) + totalSix,
        totalBoundary: (batterPrevValue?.totalBoundary || 0) + totalBoundary,
        totalWicket: batterPrevValue?.totalWicket,
        totalLbw: batterPrevValue?.totalLbw,
        totalBowled: batterPrevValue?.totalBowled,
        overWiseRun: batterPrevValue?.overWiseRun || {},
      });
      playWiseScore.set(bowlerPlayer, {
        totalRun: bowlerPrevValue?.totalRun,
        totalSix: bowlerPrevValue?.totalSix,
        totalBoundary: bowlerPrevValue?.totalBoundary,
        totalWicket: (bowlerPrevValue?.totalWicket || 0) + totalWicket,
        totalLbw: (bowlerPrevValue?.totalLbw || 0) + totalLbw,
        totalBowled: (bowlerPrevValue?.totalBowled || 0) + totalBowled,
        overWiseRun: {
          ...(bowlerPrevValue?.overWiseRun || {}),
          [matchResult[i]?.overs]:
            (bowlerPrevValue?.overWiseRun?.[matchResult[i]?.overs] || 0) +
            matchResult[i]?.total_run,
        },
      });
    }

    //loop through team and find player wise score

    let team = await TeamModel.find({});

    for (let i = 0; i < team.length; i++) {
      let teamPlayer = team[i]?.players?.map((player) => {
        let playerData = playWiseScore.get(player.Player);

        let runWisePoint = (playerData?.totalRun || 0) * 1;
        let boundaryBonusPoint = (playerData?.totalBoundary || 0) * 1;
        let sixBonusPoint = (playerData?.totalSix || 0) * 2;
        let thirtyRunBonusPoint = (playerData?.totalRun || 0) > 30 ? 4 : 0; /////////////////////////////
        let halfCenturyBonusPoint = (playerData?.totalRun || 0) > 50 ? 8 : 0; ///// One of the three ////
        let centuryBonusPoint = (playerData?.totalRun || 0) > 100 ? 16 : 0; /////////////////////////////
        let duckDismissalPoint =
          player?.Role !== "BOWLER" && playerData?.totalRun === 0 ? -2 : 0;
        let wicketPoint = (playerData?.totalWicket || 0) * 25;
        let lbwBonusPoint = (playerData?.totalLbw || 0) * 8;
        let bowledBonusPoint = (playerData?.totalBowled || 0) * 8;
        let threeWicketBonusPoint = (playerData?.totalWicket || 0) > 3 ? 4 : 0; //////////////////////////
        let fourWicketBonusPoint = (playerData?.totalWicket || 0) > 4 ? 8 : 0; /// One of the three //////
        let fiveWicketBonusPoint = (playerData?.totalWicket || 0) > 5 ? 16 : 0; //////////////////////////
        let totalMaidenOver = playerData?.overWiseRun
          ? Object?.values(playerData?.overWiseRun)?.filter((run) => run === 0)
              ?.length * 12
          : 0;

        let accumulatePoints =
          runWisePoint +
          boundaryBonusPoint +
          sixBonusPoint +
          (centuryBonusPoint || halfCenturyBonusPoint || thirtyRunBonusPoint) +
          duckDismissalPoint +
          wicketPoint +
          lbwBonusPoint +
          bowledBonusPoint +
          (fiveWicketBonusPoint ||
            fourWicketBonusPoint ||
            threeWicketBonusPoint) +
          totalMaidenOver;

        return {
          ...player,
          PointEarned:
            team[i]?.captain?.Player === player.Player
              ? accumulatePoints * 2
              : team[i]?.viceCaptain?.Player === player.Player
              ? accumulatePoints * 1.5
              : accumulatePoints,
        };
      });

      team[i].players = teamPlayer;
      team[i].totalPointEarned = teamPlayer?.reduce(
        (total, inner) => total + inner.PointEarned,
        0
      );

      await team[i].save();
    }
  } catch (error) {
    throw error;
  }
}
export async function checkFinalResult() {
  try {
    //find team result from db

    const result = await TeamModel.find({}).lean().select("-__v -updatedAt");

    if (!result) throw new NotFound("No result found");

    return result;
  } catch (error) {
    throw error;
  }
}
