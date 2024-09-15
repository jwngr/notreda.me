import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import _ from 'lodash';

import {GameInfo} from '../../website/src/models/games.models';
import {
  IndividualTeamPollData,
  PollType,
  SeasonAllPollRankings,
  WeeklyIndividualPollRanking,
} from '../../website/src/models/polls.models';
import {Writable} from '../models/utils.models';
import {CURRENT_SEASON} from './constants';
import {Logger} from './logger';
import {Scraper} from './scraper';
import {Teams} from './teams';
import {assertNever} from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POLLS_DATA_DIRECTORY = path.resolve(__dirname, '../../data/polls');

const logger = new Logger({isSentryEnabled: false});

function extractTeamName(val: string): string {
  const rawTeamName = val
    .replace(/\s\(\d+.*$/, '')
    .replace(/\*/g, '')
    .trim();

  return Teams.normalizeName(rawTeamName);
}

function extractRecord(input: string): string | null {
  const match = input.match(/\(\d+–\d+\)/);
  return match ? match[0].replace('–', '-').replace(/\(|\)/g, '') : null;
}

function parseWikipediaWeeklyPolls(
  $: cheerio.Root,
  table: cheerio.Cheerio,
  season: number
): WeeklyIndividualPollRanking[] {
  const tableRows = table.find('tr');
  const weeklyRankings: WeeklyIndividualPollRanking[] = [];

  // Parse the header row. Ignore the first and last columns, which are just week numbers.
  const weeklyHeaderCells = tableRows.eq(0).find('th').slice(1, -1);
  weeklyHeaderCells.each((_, cell) => {
    const cellText = $(cell).text().trim();
    if (cellText.startsWith('Preseason')) {
      weeklyRankings.push({
        date: 'Preseason',
        teams: {},
      });
    } else {
      const dateText = cellText
        .replace(/Week \d+/, '')
        .replace(/\[.*\]/, '')
        .replace('(Final)', '')
        .trim();
      const isInFollowingYear = dateText.startsWith('Jan') || dateText.startsWith('Feb');
      const date = new Date(`${dateText}, ${isInFollowingYear ? season + 1 : season}`);
      // Ignore cells which don't have dates, such as the first and last columns.
      if (isNaN(date.getTime())) return;
      // Ignore future polls.
      const isInFuture = date.getTime() > Date.now();
      if (isInFuture) return;
      weeklyRankings.push({
        date: date.toISOString().split('T')[0],
        teams: {},
      });
    }
  });

  // Ignore the first header row and the last two rows, which are a repeated header and the dropped
  // team info.
  const weeklyRankingsTableRows = tableRows.slice(1, -2);
  weeklyRankingsTableRows.each((i, row) => {
    $(row)
      .find('td')
      .each((weekIndex, cell) => {
        const cellText = $(cell).text().trim();
        if (!cellText) return;

        const teamName = extractTeamName(cellText);
        const record = extractRecord(cellText) ?? '0-0';

        weeklyRankings[weekIndex].teams[teamName] = {
          record,
          ranking: i + 1,
          // This gets set in a loop later since the previous week's rankings are incomplete.
          previousRanking: -1,
          // TODO: Add back support for points. It is not in the Wikipedia data.
        };
      });
  });

  // Update `previousRanking` for each team for each week now that we have full data.
  weeklyRankings.forEach((ranking, i) => {
    Object.entries(ranking.teams).forEach(([teamName, team]) => {
      (team as Writable<IndividualTeamPollData>).previousRanking =
        i === 0 ? 'NR' : (weeklyRankings[i - 1].teams[teamName]?.ranking ?? 'NR');
    });
  });

  return weeklyRankings;
}

export class Polls {
  /**
   * Returns the poll rankings for a season from the source of truth local file.
   */
  static getForSeason(season: number): SeasonAllPollRankings | null {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`${POLLS_DATA_DIRECTORY}/${season}.json`);
  }

  /**
   * Returns the poll rankings for a season by scraping the web.
   */
  static async scrapeForSeason(season: number): Promise<SeasonAllPollRankings> {
    // Fetch the HTML of the ESPN rankings page for each week of the season. Fetch up to a max number
    // of weeks, which should be enough for any season. We cannot rely on using ND's game count
    // because ND bye weeks would not be considered. Some of these fetches return an empty page and
    // will be filtered out later.
    const $scrapedResult = await Scraper.get(
      `https://en.wikipedia.org/wiki/${season}_NCAA_Division_I_FBS_football_rankings`
    );

    const pollRankings: SeasonAllPollRankings = {
      [PollType.AP]: [],
      [PollType.Coaches]: [],
      [PollType.CFBPlayoff]: [],
      [PollType.BCS]: [],
    };

    const $headings = $scrapedResult('.mw-heading');
    $headings.each((_, heading) => {
      const headingText = $scrapedResult(heading).find('h2').text().trim();

      let pollType: PollType | undefined;
      switch (headingText) {
        case 'AP Poll':
          pollType = PollType.AP;
          break;
        case 'Coaches Poll':
          pollType = PollType.Coaches;
          break;
        case 'CFP rankings':
          pollType = PollType.CFBPlayoff;
          break;
        default:
          break;
      }

      if (!pollType) return;

      // Find the table following the heading.
      let maybeTableContainer = $scrapedResult(heading).next();
      let maybeTable = maybeTableContainer.find('table.wikitable');
      let chances = 0;
      while (chances < 2 && maybeTableContainer && maybeTable.length === 0) {
        chances++;
        maybeTableContainer = maybeTableContainer.next();
        maybeTable = maybeTableContainer.find('table');
      }

      if (maybeTable.length === 0) {
        switch (pollType) {
          case PollType.AP:
          case PollType.Coaches:
            logger.error('No rankings table found', {pollType, headingText});
            break;
          case PollType.BCS:
            // TODO: Add support for this.
            break;
          case PollType.CFBPlayoff:
            // This is expected for seasons before the CFP was created.
            logger.info('No CFB Playoff rankings table found', {pollType, headingText});
            break;
          default:
            assertNever(pollType);
        }
        return;
      }

      pollRankings[pollType] = parseWikipediaWeeklyPolls($scrapedResult, maybeTable, season);
    });

    return pollRankings;
  }

  static updateForSeason = ({
    season,
    seasonPollsData,
    seasonScheduleData,
  }: {
    readonly season: number;
    readonly seasonPollsData: SeasonAllPollRankings;
    readonly seasonScheduleData: readonly GameInfo[];
  }): void => {
    fs.writeFileSync(
      `${POLLS_DATA_DIRECTORY}/${season}.json`,
      JSON.stringify(seasonPollsData, null, 2)
    );

    // Copy the updated poll rankings into the ND season schedule data.
    seasonScheduleData.forEach((game) => {
      let gameDate: Date;
      if (game.date) {
        gameDate = new Date(game.date);
      } else if (game.fullDate) {
        gameDate = new Date(game.fullDate);
      } else {
        throw new Error(`Game date is missing for ${season} ${game.opponentId}`);
      }

      // Clear any existing rankings.
      delete (game as Writable<GameInfo>).rankings;

      for (const [pollId, pollData] of Object.entries(seasonPollsData)) {
        // Loop through the weekly polls in reverse to find the ranking just before the game.
        const rankingBeforeGame = [...pollData].reverse().find((poll) => {
          // Every game is after the preseason rankings.
          if (poll.date === 'Preseason') return true;

          // Otherwise, keep going until we find a poll from before the game..
          return gameDate.getTime() > new Date(poll.date).getTime();
        });

        // Not every poll has a ranking every week.
        if (!rankingBeforeGame) return;

        if ('Notre Dame' in rankingBeforeGame.teams) {
          const homeOrAway = game.isHomeGame ? 'home' : 'away';
          _.set(
            game,
            ['rankings', homeOrAway, pollId],
            rankingBeforeGame.teams['Notre Dame'].ranking
          );
        }

        const opponentTeamName = Teams.getById(game.opponentId).name;
        if (opponentTeamName in rankingBeforeGame.teams) {
          const homeOrAway = game.isHomeGame ? 'away' : 'home';
          _.set(
            game,
            ['rankings', homeOrAway, pollId],
            rankingBeforeGame.teams[opponentTeamName].ranking
          );
        }
      }
    });
  };

  static updateForCurrentSeason(
    seasonPollsData: SeasonAllPollRankings,
    seasonScheduleData: readonly GameInfo[]
  ): void {
    return this.updateForSeason({
      season: CURRENT_SEASON,
      seasonPollsData,
      seasonScheduleData,
    });
  }

  static getPollName(pollType: PollType): string {
    switch (pollType) {
      case PollType.AP:
        return 'AP';
      case PollType.Coaches:
        return 'Coaches';
      case PollType.CFBPlayoff:
        return 'College Football Playoff';
      case PollType.BCS:
        return 'BCS';
      default:
        assertNever(pollType);
    }
  }
}
