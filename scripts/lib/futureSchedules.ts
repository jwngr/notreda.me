import {FutureGameInfo} from '../models';
import {CURRENT_SEASON} from './constants';
import {Logger} from './logger';
import {Scraper} from './scraper';

const logger = new Logger({isSentryEnabled: false});

const OPPONENT_NAME_MAPPINGS: Record<string, string> = {
  'Bowling Green': 'Bowling Green State',
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Miami',
  USF: 'South Florida',
};

const _getNormalizedOpponentName = (rawOpponentNameString: string) => {
  const val = rawOpponentNameString
    .replace(/^at /g, '')
    .replace(/^vs /g, '')
    .replace(/\(in .*$/g, '')
    .trim();

  return OPPONENT_NAME_MAPPINGS[val] || val;
};

/**
 * Returns all scheduled future ND games, keyed by year.
 */
export const fetchFutureNdSchedules = async (): Promise<
  Record<string, readonly FutureGameInfo[]>
> => {
  try {
    const $ = await Scraper.get(`https://fbschedules.com/ncaa/notre-dame/`);

    const schedules: Record<string, FutureGameInfo[]> = {};

    $('.col-sm-6.schedu-list').each((seasonIndex, futureSeasonScheduleCol) => {
      const season = $(futureSeasonScheduleCol).find('.team-hd').text().trim();

      // Ignore columns under the "FUTURE NOTRE DAME FOOTBALL SCHEDULES" section which do not
      // have a "team-hd" class.
      if (season !== '' && Number(season) > CURRENT_SEASON) {
        schedules[season] = [];

        $(futureSeasonScheduleCol)
          .find('li')
          .each((_, gameli) => {
            const gameInfoTokens = $(gameli)
              .text()
              .trim()
              .split(' - ')
              .map((val) => val.trim());

            const gameData: FutureGameInfo = {
              date:
                gameInfoTokens[0] === 'TBA' ? 'TBD' : new Date(`${gameInfoTokens[0]}/${season}`),
              isHomeGame: !gameInfoTokens[1].startsWith('at'),
              opponentName: _getNormalizedOpponentName(gameInfoTokens[1]),
              ...(gameInfoTokens[1].includes('(in ')
                ? {location: gameInfoTokens[1].split('(in ')[1].replace(')', '')}
                : {}),
            };

            schedules[season].push(gameData);
          });
      }
    });

    return schedules;
  } catch (error) {
    logger.error(`Error fetching future ND schedules.`, {error});
    throw error;
  }
};
