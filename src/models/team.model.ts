import { model, Model, Schema } from "mongoose";
import { ITeam } from "../types/team";

const teamSchema = new Schema<ITeam, Model<ITeam>>(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
    },
    players: [
      {
        Player: {
          type: String,
          required: [true, "Player name is required"],
        },
        Team: {
          type: String,
          required: [true, "Team name is required"],
        },
        Role: {
          type: String,
          required: [true, "Role is required"],
          enum: ["BATTER", "ALL-ROUNDER", "BOWLER", "WICKETKEEPER"],
        },
        PointEarned: {
          type: Number,
          default: 0,
        },
      },
    ],
    captain: {
      Player: {
        type: String,
        required: [true, "Player name is required"],
      },
      Team: {
        type: String,
        required: [true, "Team name is required"],
      },
      Role: {
        type: String,
        required: [true, "Role is required"],
        enum: ["BATTER", "ALL-ROUNDER", "BOWLER", "WICKETKEEPER"],
      },
      PointEarned: {
        type: Number,
        default: 0,
      },
    },
    viceCaptain: {
      Player: {
        type: String,
        required: [true, "Player name is required"],
      },
      Team: {
        type: String,
        required: [true, "Team name is required"],
      },
      Role: {
        type: String,
        required: [true, "Role is required"],
        enum: ["BATTER", "ALL-ROUNDER", "BOWLER", "WICKETKEEPER"],
      },
      PointEarned: {
        type: Number,
        default: 0,
      },
    },
    totalPointEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const TeamModel = model<ITeam, Model<ITeam>>("Team", teamSchema);
