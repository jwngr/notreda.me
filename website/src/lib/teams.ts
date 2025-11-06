import {Team, TeamId} from '../models/teams.models';
import teamsJson from '../resources/teams.json';

const ALL_TEAMS = teamsJson as Record<TeamId, Team>;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Teams {
  static getTeam(teamId: TeamId): Team {
    return ALL_TEAMS[teamId];
  }
}
