export interface IMatch {
  ID: number;
  innings: 1 | 2;
  overs: number;
  ballnumber: number;
  batter: string;
  bowler: string;
  "non-striker": string;
  extra_type: string;
  batsman_run: number;
  extras_run: number;
  total_run: number;
  non_boundary: number;
  isWicketDelivery: number;
  player_out: string;
  kind: string;
  fielders_involved: string;
  BattingTeam: string;
}
