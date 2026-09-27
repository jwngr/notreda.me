import type {CheerioAPI} from 'cheerio';
import range from 'lodash/range';

import {GameLinescore, GameScore} from '../../website/src/models/games.models';
import {
  IndividualTeamPollData,
  PollType,
  SeasonAllPollRankings,
  WeeklyIndividualPollRanking,
} from '../../website/src/models/polls.models';
import {TeamId, TeamRecords, TeamStats} from '../../website/src/models/teams.models';
import {Logger} from './logger';
import {Scraper} from './scraper';
import {Teams} from './teams';
import {assertNever, isNumber} from './utils';

const logger = new Logger({isSentryEnabled: false});

// TODO: Pull these dynamically instead of hard-coding them.
const AP_COACHES_POLL_DATES_2021 = [
  'Preseason',
  '2021-09-05',
  '2021-09-12',
  '2021-09-19',
  '2021-09-26',
  '2021-10-03',
  '2021-10-10',
  '2021-10-17',
  '2021-10-24',
  '2021-10-31',
  '2021-11-07',
  '2021-11-14',
  '2021-11-21',
  '2021-11-28',
  '2021-12-05',
  '2021-12-12',
  '2021-12-19',
  '2021-12-26',
];

const CFP_POLL_DATES_2021 = [
  '2021-11-23',
  '2021-11-30',
  '2021-12-07',
  '2021-12-14',
  '2021-12-21',
  '2021-12-28',
];

const _getEspnRankingsUrl = (season: number, weekIndex: number): string => {
  return `https://www.espn.com/college-football/rankings/_/week/${weekIndex}/year/${season}/seasontype/2`;
};

const _getEspnTeamScheduleUrl = (season: number, espnTeamId: number): string => {
  return `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${espnTeamId}/schedule?season=${season}&seasontype=2`;
};

const _getEspnGameSummaryUrl = (gameId: number): string => {
  return `https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${gameId}`;
};

interface EspnCompetitor {
  readonly id: string;
  readonly homeAway: 'home' | 'away';
  readonly score?: {readonly value?: number};
  readonly linescores?: readonly {readonly displayValue: string}[];
}

interface EspnCompetition {
  readonly neutralSite?: boolean;
  readonly date?: string;
  readonly status?: {readonly type?: {readonly completed?: boolean}};
  readonly competitors: readonly EspnCompetitor[];
}

interface EspnEvent {
  readonly id: string;
  readonly competitions?: readonly EspnCompetition[];
}

interface EspnScheduleResponse {
  readonly events: readonly EspnEvent[];
}

interface EspnSummaryResponse {
  readonly boxscore?: {
    readonly teams?: readonly {
      readonly team: {readonly id: string};
      readonly statistics: readonly {readonly label: string; readonly displayValue: string}[];
    }[];
    readonly players?: readonly {
      readonly team: {readonly id: string};
      readonly statistics: readonly {
        readonly name: string;
        readonly totals: readonly string[];
        readonly athletes: readonly {readonly stats: readonly string[]}[];
      }[];
    }[];
  };
  readonly header?: {readonly competitions?: readonly EspnCompetition[]};
}

const _getEspnApiJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {headers: {Accept: 'application/json'}});
  if (!response.ok) {
    throw new Error(`ESPN API request failed (${response.status}): ${url}`);
  }

  return (await response.json()) as T;
};

const _getCompetition = (event: EspnEvent): EspnCompetition | undefined => event.competitions?.[0];

const _getTeamEspnId = (teamId: TeamId): number => {
  const {espnId} = Teams.getById(teamId);
  if (!espnId) {
    throw new Error(`Team ${teamId} does not have an ESPN ID.`);
  }
  return espnId;
};

const _emptyTeamRecord = (): {
  wins: number;
  losses: number;
  homeWins: number;
  homeLosses: number;
  awayWins: number;
  awayLosses: number;
  neutralWins: number;
  neutralLosses: number;
} => ({
  wins: 0,
  losses: 0,
  homeWins: 0,
  homeLosses: 0,
  awayWins: 0,
  awayLosses: 0,
  neutralWins: 0,
  neutralLosses: 0,
});

const _addFinalGameToRecord = (
  record: ReturnType<typeof _emptyTeamRecord>,
  competition: EspnCompetition,
  teamEspnId: number
): void => {
  if (!competition.status?.type?.completed) return;

  const team = competition.competitors.find(({id}) => id === String(teamEspnId));
  const opponent = competition.competitors.find(({id}) => id !== String(teamEspnId));
  if (team?.score?.value === undefined || opponent?.score?.value === undefined) return;

  const isWin = team.score.value > opponent.score.value;
  const isLoss = team.score.value < opponent.score.value;
  if (!isWin && !isLoss) return;

  const location = competition.neutralSite ? 'neutral' : team.homeAway === 'home' ? 'home' : 'away';
  if (isWin) {
    record.wins += 1;
    if (location === 'home') record.homeWins += 1;
    else if (location === 'away') record.awayWins += 1;
    else record.neutralWins += 1;
  } else {
    record.losses += 1;
    if (location === 'home') record.homeLosses += 1;
    else if (location === 'away') record.awayLosses += 1;
    else record.neutralLosses += 1;
  }
};

const _toTeamRecords = (record: ReturnType<typeof _emptyTeamRecord>): TeamRecords => ({
  overall: `${record.wins}-${record.losses}`,
  home: `${record.homeWins}-${record.homeLosses}`,
  away: `${record.awayWins}-${record.awayLosses}`,
  neutral: `${record.neutralWins}-${record.neutralLosses}`,
});

const _getPollRankingsForWeek = (
  $: CheerioAPI,
  weekIndex: number
): Record<PollType, WeeklyIndividualPollRanking | null> | null => {
  const pollRankings: Record<PollType, WeeklyIndividualPollRanking | null> = {
    [PollType.AP]: null,
    [PollType.Coaches]: null,
    [PollType.CFBPlayoff]: null,
  };

  const $pollSections = $('.InnerLayout__child.mb2');

  if ($pollSections.length === 0) {
    return null;
  }

  $pollSections.each((_, poll) => {
    const pollTitle = $(poll).find('.Table__Title').text().trim();

    let pollType: PollType;
    if (pollTitle.includes('AP')) {
      pollType = PollType.AP;
    } else if (pollTitle.includes('Coaches')) {
      pollType = PollType.Coaches;
    } else if (pollTitle.includes('College Football Playoff ')) {
      pollType = PollType.CFBPlayoff;
    } else {
      throw new Error(`Unexpected poll title: "${pollTitle}"`);
    }

    const teamsData: Record<string, IndividualTeamPollData> = {};
    const $pollRows = $(poll).find('tr');
    let previousTeamCurrentWeekRanking: number | null = null;
    $pollRows.each((_, pollRow) => {
      const $rowCells = $(pollRow).find('td');
      if ($rowCells.length !== 0) {
        const rowCellValues: string[] = $rowCells.map((_, cell) => $(cell).text().trim()).get();

        const currentWeekRanking = Number(rowCellValues[0]) || previousTeamCurrentWeekRanking;
        if (!currentWeekRanking) {
          throw new Error(`No current week ranking`);
        }
        previousTeamCurrentWeekRanking = currentWeekRanking;
        const teamName = Teams.normalizeName($($rowCells[1]).find('.pl3').text().trim());
        const record = rowCellValues[2];

        let trend: string;
        let points: number | null = null;
        switch (pollType) {
          case PollType.AP:
          case PollType.Coaches:
            points = Number(rowCellValues[3]);
            trend = rowCellValues[4];
            break;
          case PollType.CFBPlayoff:
            points = null;
            trend = rowCellValues[3];
            break;
          default:
            assertNever(pollType);
        }

        let previousWeekRanking: number | 'NR';
        if (trend === 'NR') {
          previousWeekRanking = 'NR';
        } else if (trend === '-') {
          previousWeekRanking = currentWeekRanking;
        } else {
          const trendElementClasses = $($rowCells[4]).find('.trend').attr('class');
          previousWeekRanking = trendElementClasses?.includes('positive')
            ? currentWeekRanking + Number(trend)
            : currentWeekRanking - Number(trend);
        }
        if (!record) {
          logger.error('No record found', {rowCellValues});
          return;
        }

        const teamData: IndividualTeamPollData = {
          record,
          ranking: currentWeekRanking,
          previousRanking: previousWeekRanking,
          ...(isNumber(points) ? {points} : {}),
        };

        teamsData[teamName] = teamData;
      }
    });

    pollRankings[pollType] = {
      date:
        pollType === PollType.CFBPlayoff
          ? CFP_POLL_DATES_2021[weekIndex - 10]
          : AP_COACHES_POLL_DATES_2021[weekIndex],
      teams: teamsData,
    };
  });

  return pollRankings;
};

/**
 * Returns a list of ESPN game IDs for the provided season.
 */
export const fetchGameIdsForSeason = async (season: number): Promise<number[]> => {
  const {events} = await _getEspnApiJson<EspnScheduleResponse>(
    _getEspnTeamScheduleUrl(season, _getTeamEspnId(TeamId.ND))
  );

  return events.map(({id}) => {
    const gameId = Number(id);
    if (!Number.isInteger(gameId)) {
      throw new Error(`ESPN returned an invalid game ID: ${id}`);
    }
    return gameId;
  });
};

/**
 * Returns a list of game stats and line scores from ESPN for the provided game.
 */
export const fetchStatsForGame = async (
  gameId: number
): Promise<{
  readonly stats: {readonly away: TeamStats; readonly home: TeamStats};
  readonly score: GameScore;
  readonly linescore: GameLinescore;
} | null> => {
  const summary = await _getEspnApiJson<EspnSummaryResponse>(_getEspnGameSummaryUrl(gameId));
  const competition = summary.header?.competitions?.[0];
  const teams = summary.boxscore?.teams;
  if (!competition?.status?.type?.completed || !teams?.length) {
    logger.info('Skipped fetching stats for game that is not final or has no box score.', {gameId});
    return null;
  }

  const homeCompetitor = competition.competitors.find(({homeAway}) => homeAway === 'home');
  const awayCompetitor = competition.competitors.find(({homeAway}) => homeAway === 'away');
  const toLinescore = (competitor: EspnCompetitor | undefined): number[] => {
    const scores = competitor?.linescores?.map(({displayValue}) => Number(displayValue));
    if (!scores?.length || scores.some((score) => !Number.isFinite(score))) {
      throw new Error(`ESPN returned an incomplete linescore for game ${gameId}.`);
    }
    return scores;
  };
  if (!homeCompetitor || !awayCompetitor) {
    throw new Error(`ESPN returned incomplete competitors for game ${gameId}.`);
  }

  const linescore: GameLinescore = {
    home: toLinescore(homeCompetitor),
    away: toLinescore(awayCompetitor),
  };
  const statsByTeam = new Map(teams.map(({team, statistics}) => [team.id, statistics]));
  const fumblesByTeam = new Map(
    summary.boxscore?.players
      ?.map(({team, statistics}) => {
        const fumbleStats = statistics.find(({name}) => name === 'fumbles');
        const teamFumbles = fumbleStats?.totals[0];
        const playerFumbles = fumbleStats?.athletes.map(({stats}) => Number(stats[0]));
        const fumbles =
          typeof teamFumbles !== 'undefined'
            ? Number(teamFumbles)
            : playerFumbles?.length === 0
              ? 0
              : playerFumbles?.every(Number.isFinite)
                ? playerFumbles.reduce((sum, value) => sum + value, 0)
                : undefined;
        return [team.id, fumbles] as const;
      })
      .filter((entry): entry is readonly [string, number] => Number.isFinite(entry[1])) ?? []
  );

  const readTeamStats = (teamId: string): TeamStats => {
    const statistics = statsByTeam.get(teamId);
    if (!statistics)
      throw new Error(`ESPN returned no team stats for ${teamId} in game ${gameId}.`);

    const statValues = new Map(statistics.map(({label, displayValue}) => [label, displayValue]));
    const readNumber = (label: string): number => {
      const value = Number(statValues.get(label));
      if (!Number.isFinite(value)) {
        throw new Error(`ESPN returned invalid ${label} for team ${teamId} in game ${gameId}.`);
      }
      return value;
    };
    const readPair = (label: string, separator: string): [number, number] => {
      const values = statValues.get(label)?.split(separator).map(Number);
      if (!values || values.length !== 2 || values.some((value) => !Number.isFinite(value))) {
        throw new Error(`ESPN returned invalid ${label} for team ${teamId} in game ${gameId}.`);
      }
      return [values[0], values[1]];
    };
    const [thirdDownConversions, thirdDownAttempts] = readPair('3rd down efficiency', '-');
    const [fourthDownConversions, fourthDownAttempts] = readPair('4th down efficiency', '-');
    const [passCompletions, passAttempts] = readPair('Comp/Att', '/');
    const [penalties, penaltyYards] = readPair('Penalties', '-');
    const fumbles = fumblesByTeam.get(teamId);

    return {
      firstDowns: readNumber('1st Downs'),
      thirdDownAttempts,
      thirdDownConversions,
      fourthDownAttempts,
      fourthDownConversions,
      totalYards: readNumber('Total Yards'),
      passYards: readNumber('Passing'),
      passCompletions,
      passAttempts,
      yardsPerPass: readNumber('Yards per pass'),
      interceptionsThrown: readNumber('Interceptions thrown'),
      rushYards: readNumber('Rushing'),
      rushAttempts: readNumber('Rushing Attempts'),
      yardsPerRush: readNumber('Yards per rush'),
      penalties,
      penaltyYards,
      possession: statValues.get('Possession') ?? '',
      fumblesLost: readNumber('Fumbles lost'),
      ...(typeof fumbles === 'undefined' ? {} : {fumbles}),
    };
  };

  const score: GameScore = {
    home: linescore.home.reduce((sum, points) => sum + points, 0),
    away: linescore.away.reduce((sum, points) => sum + points, 0),
  };

  return {
    stats: {away: readTeamStats(awayCompetitor.id), home: readTeamStats(homeCompetitor.id)},
    score,
    linescore,
  };
};

/**
 * Returns the records for the provided team during the provided season, up through and including
 * their matchup against Notre Dame.
 */
export const fetchTeamRecordUpThroughNotreDameGameForSeason = async (
  season: number,
  teamId: TeamId
): Promise<TeamRecords> => {
  const teamEspnId = _getTeamEspnId(teamId);
  const {events} = await _getEspnApiJson<EspnScheduleResponse>(
    _getEspnTeamScheduleUrl(season, teamEspnId)
  );
  const record = _emptyTeamRecord();
  const notreDameEspnId = _getTeamEspnId(TeamId.ND);

  for (const event of events) {
    const competition = _getCompetition(event);
    if (!competition) continue;

    _addFinalGameToRecord(record, competition, teamEspnId);
    if (competition.competitors.some(({id}) => id === String(notreDameEspnId))) {
      break;
    }
  }

  return _toTeamRecords(record);
};

/**
 * Returns Notre Dame's records at each week of the provided season.
 */
export const fetchNotreDameWeeklyRecordsForSeason = async (
  season: number
): Promise<readonly TeamRecords[]> => {
  const teamEspnId = _getTeamEspnId(TeamId.ND);
  const {events} = await _getEspnApiJson<EspnScheduleResponse>(
    _getEspnTeamScheduleUrl(season, teamEspnId)
  );
  const record = _emptyTeamRecord();

  return events.map((event) => {
    const competition = _getCompetition(event);
    if (competition) _addFinalGameToRecord(record, competition, teamEspnId);
    return _toTeamRecords(record);
  });
};

/**
 * Returns the weekly poll rankings for the provided season.
 * @deprecated Use `Polls.getForSeason() instead. Remove this once that API supports votes info.
 */
export const fetchPollsForSeason = async ({
  season,
}: {
  readonly season: number;
  readonly weeklyReleaseDates: readonly Date[];
}): Promise<SeasonAllPollRankings> => {
  // Fetch the HTML of the ESPN rankings page for each week of the season. Fetch up to a max number
  // of weeks, which should be enough for any season. We cannot rely on using ND's game count
  // because ND bye weeks would not be considered. Some of these fetches return an empty page and
  // will be filtered out later.
  const MAX_POLL_WEEKS_TO_FETCH = 18;
  const $weeklyRankings = await Promise.all(
    range(0, MAX_POLL_WEEKS_TO_FETCH).map((i) => {
      return Scraper.get(_getEspnRankingsUrl(season, i));
    })
  );

  // Scrape the actual rankings for each week using the HTML.
  const weeklyRankings = $weeklyRankings
    .map(($weeklyRanking, i) => _getPollRankingsForWeek($weeklyRanking, i))
    // Filter out weeks with no rankings that we over-eagerly fetched.
    .filter((weeklyRanking) => weeklyRanking !== null);

  // Loop through the weekly rankings and combine them into a standard format.
  const pollRankings: SeasonAllPollRankings = {
    [PollType.AP]: [],
    [PollType.Coaches]: [],
    [PollType.CFBPlayoff]: [],
  };
  weeklyRankings.forEach((rankings) => {
    [PollType.AP, PollType.Coaches, PollType.CFBPlayoff].forEach((pollType) => {
      const ranking = rankings[pollType];
      if (!ranking) return;
      pollRankings[pollType].push(ranking);
    });
  });

  return pollRankings;
};

/**
 * Returns the kickoff time for the provided game. If the game has not yet been assigned a kickoff
 * time, returns 'TBD'.
 */
export const fetchKickoffTimeForGame = async (espnGameId: number): Promise<Date | 'TBD'> => {
  const summary = await _getEspnApiJson<EspnSummaryResponse>(_getEspnGameSummaryUrl(espnGameId));
  const kickoffTime = summary.header?.competitions?.[0]?.date;
  if (!kickoffTime) return 'TBD';

  const date = new Date(kickoffTime);
  return Number.isNaN(date.getTime()) ? 'TBD' : date;
};
