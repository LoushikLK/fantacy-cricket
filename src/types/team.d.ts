import { Document } from "mongoose";
import { IPlayer } from "./player";

export interface ITeam extends Document {
  teamName: string;
  players: IPlayer[];
  captain: IPlayer;
  viceCaptain: IPlayer;
  totalPointEarned: number;
}
