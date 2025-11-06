import {Team, TeamId} from '../models/teams.models';
import teamsJson from '../resources/teams.json';

const ALL_TEAMS = teamsJson as Record<TeamId, Team>;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Teams {
  static getTeam(teamId: TeamId): Team {
    console.log('teamId:', teamId);
    console.log('ALL_TEAMS:', ALL_TEAMS);
    return ALL_TEAMS[teamId];
  }
}
