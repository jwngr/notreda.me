import {Team, TeamId} from '../models';
import teamsJson from '../resources/teams.json';

const ALL_TEAMS = teamsJson as Record<TeamId, Team>;

export class Teams {
  static getTeam(teamId: TeamId) {
    return ALL_TEAMS[teamId];
  }
}
