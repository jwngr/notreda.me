import {Team, TeamId, TeamWithId} from '../../website/src/models/teams.models';
import teamsJson from '../../website/src/resources/teams.json';

const ALL_TEAMS = teamsJson as Record<TeamId, Team>;

const NORMALIZED_TEAM_NAMES: Record<string, string> = {
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Miami',
  'Texas Christian': 'TCU',
  SMU: 'Southern Methodist',
  'North Carolina State': 'NC State',
};

export class Teams {
  static getById(teamId: TeamId): Team {
    return ALL_TEAMS[teamId];
  }

  static getByName(teamName: string): TeamWithId {
    const team = Object.entries(ALL_TEAMS)
      .map(([teamId, teamData]) => ({id: teamId, ...teamData}) as TeamWithId)
      .find(
        ({name, shortName}) =>
          name === teamName ||
          shortName === teamName ||
          name === this.normalizeName(teamName) ||
          shortName === this.normalizeName(teamName)
      );

    if (!team) {
      throw new Error(`No team exists with the name "${teamName}" `);
    }

    return team;
  }

  static normalizeName(teamName: string): string {
    return NORMALIZED_TEAM_NAMES[teamName] ?? teamName;
  }

  static existsById(teamId: TeamId): boolean {
    return Object.keys(ALL_TEAMS).includes(teamId);
  }
}
