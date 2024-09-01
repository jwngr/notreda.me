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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POLLS_DATA_DIRECTORY = path.resolve(__dirname, '../../data/polls');

const logger = new Logger({isSentryEnabled: false});

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

        const teamName = cellText.split('(')[0].trim();
        const record = weekIndex === 0 ? '0-0' : cellText.split('(')[1].split(')')[0].trim();

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
  static getForSeason(season: number): SeasonAllPollRankings | null {
    try {
      return require(`${POLLS_DATA_DIRECTORY}/${season}.json`);
    } catch (error) {
      return null;
    }
  }

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
      let maybeTable = maybeTableContainer.find('table');
      while (maybeTableContainer && maybeTable.length === 0) {
        maybeTableContainer = maybeTableContainer.next();
        maybeTable = maybeTableContainer.find('table');
      }

      if (maybeTable.length === 0) {
        logger.error('No table found for heading', {headingText});
        return;
      }

      pollRankings[pollType] = parseWikipediaWeeklyPolls($scrapedResult, maybeTable, season);
    });

    // weeklyRankings.forEach((rankings) => {
    //   [PollType.AP, PollType.Coaches, PollType.CFBPlayoff].forEach((pollType) => {
    //     const ranking = rankings[pollType];
    //     if (!ranking) return;
    //     pollRankings[pollType].push(ranking);
    //   });
    // });

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

    seasonScheduleData.forEach((game, currentNdGameIndex) => {
      let gameDate: Date;
      if (game.date) {
        gameDate = new Date(game.date);
      } else if (game.fullDate) {
        gameDate = new Date(game.fullDate);
      } else {
        throw new Error(`Game date is missing for ${season} ${game.opponentId}`);
      }

      for (const [pollId, pollData] of Object.entries(seasonPollsData)) {
        let rankingBeforeGame: WeeklyIndividualPollRanking | undefined;
        if (currentNdGameIndex === 0) {
          rankingBeforeGame = pollData[0];
        } else if (currentNdGameIndex === seasonScheduleData.length - 1) {
          // TODO: I'm not sure this is right...
          rankingBeforeGame = pollData[pollData.length - 1];
        } else {
          // TODO: Can I simplify this?
          rankingBeforeGame = pollData.find((_, i) => {
            if (i === pollData.length - 1) return true;

            const nextPollDate = pollData[i + 1].date;
            console.log('----------');
            console.log('nextPollDate:', nextPollDate);
            console.log('gameDate:', gameDate);

            const isGameBeforeNextPollDate = gameDate.getTime() < new Date(nextPollDate).getTime();
            const isGameWithin12DaysOfPollDate =
              Math.abs(gameDate.getTime() - new Date(nextPollDate).getTime()) <=
              12 * 24 * 60 * 60 * 1000;
            console.log('isGameBeforeNextPollDate:', isGameBeforeNextPollDate);
            console.log('isGameWithin12DaysOfPollDate:', isGameWithin12DaysOfPollDate);
            return isGameBeforeNextPollDate && isGameWithin12DaysOfPollDate;
          });
        }

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
}
