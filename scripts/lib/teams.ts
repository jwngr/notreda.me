import {Team, TeamId} from '../../website/src/models';
import teamsJson from '../../website/src/resources/teams.json';

const ALL_TEAMS = teamsJson as Record<TeamId, Team>;

export class Teams {
  static getById(teamId: TeamId): Team {
    return ALL_TEAMS[teamId];
  }

  static getByName(teamName: string): Team {
    const team = Object.entries(ALL_TEAMS)
      .map(([teamId, teamData]) => ({id: teamId, ...teamData}))
      .find(({name}) => name === teamName);

    if (!team) {
      throw new Error(`No team exists with the name "${teamName}"`);
    }

    return team;
  }

  static existsById(teamId: TeamId): boolean {
    return Object.keys(ALL_TEAMS).includes(teamId);
  }
}