import {Team, TeamId} from '../models/teams.models';
import teamsJson from '../resources/teams.json';

const ALL_TEAMS = teamsJson as Record<TeamId, Team>;

export class Teams {
  static getTeam(teamId: TeamId): Team {
    return ALL_TEAMS[teamId];
  }
}
