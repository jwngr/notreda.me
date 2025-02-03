import {FutureGameInfo} from '../../website/src/models/games.models';
import {Scraper} from './scraper';

const OPPONENT_NAME_MAPPINGS: Record<string, string> = {
  'Bowling Green': 'Bowling Green State',
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Miami',
  USF: 'South Florida',
};

const _getNormalizedOpponentName = (rawOpponentNameString: string): string => {
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
  Record<number, readonly FutureGameInfo[]>
> => {
  const $ = await Scraper.get(`https://fbschedules.com/ncaa/notre-dame/`);

  const schedules: Record<string, FutureGameInfo[]> = {};

  $('.col-sm-6.schedu-list').each((_, futureSeasonScheduleCol) => {
    const season = Number($(futureSeasonScheduleCol).find('.team-hd').text().trim());

    // Ignore lists which are not for a single season.
    if (!season || isNaN(season)) return;

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
          date: gameInfoTokens[0] === 'TBA' ? 'TBD' : new Date(`${gameInfoTokens[0]}/${season}`),
          isHomeGame: !gameInfoTokens[1].startsWith('at'),
          opponentName: _getNormalizedOpponentName(gameInfoTokens[1]),
          ...(gameInfoTokens[1].includes('(in ')
            ? {location: gameInfoTokens[1].split('(in ')[1].replace(')', '')}
            : {}),
        };

        schedules[season].push(gameData);
      });
  });

  return schedules;
};
