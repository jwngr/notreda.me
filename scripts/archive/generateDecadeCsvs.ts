import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {format} from 'date-fns/format';
import range from 'lodash/range';

import {getDateFromGame} from '../../website/src/lib/datetime';
import {CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';
import {TeamStats} from '../models/teams.models';

const logger = new Logger({isSentryEnabled: false});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/decadeCsvs');

const DECADES = [
  range(1887, 1890),
  range(1892, 1900),
  range(1900, 1910),
  range(1910, 1920),
  range(1920, 1930),
  range(1930, 1940),
  range(1940, 1950),
  range(1950, 1960),
  range(1960, 1970),
  range(1970, 1980),
  range(1980, 1990),
  range(1990, 2000),
  range(2000, 2010),
  range(2010, 2020),
  range(2020, CURRENT_SEASON),
];

const STATS: {readonly name: keyof TeamStats; readonly text: string}[] = [
  {name: 'firstDowns', text: '1st Downs'},
  {name: 'thirdDownAttempts', text: '3rd Down Attempts'},
  {name: 'thirdDownConversions', text: '3rd Down Conversions'},
  {name: 'fourthDownAttempts', text: '4th Down Attempts'},
  {name: 'fourthDownConversions', text: '4th Down Conversions'},
  {name: 'totalYards', text: 'Total Yards'},
  {name: 'passYards', text: 'Pass Yards'},
  {name: 'passCompletions', text: 'Pass Completions'},
  {name: 'passAttempts', text: 'Pass Attempts'},
  {name: 'rushYards', text: 'Rush Yards'},
  {name: 'rushAttempts', text: 'Rush Attempts'},
  {name: 'fumbles', text: 'Fumbles'},
  {name: 'fumblesLost', text: 'Fumbles Lost'},
  {name: 'interceptionsThrown', text: 'Interceptions Thrown'},
  {name: 'penalties', text: 'Penalties'},
  {name: 'penaltyYards', text: 'Penalty Yards'},
  {name: 'possession', text: 'Possession'},
];

async function main() {
  logger.info('Generating CSVs...');

  for (const seasons of DECADES) {
    const firstYear = seasons[0];

    const statNames = STATS.map((stat) => stat.text).join(',');

    const lines = [`Season,Date,Team,Linescore,${statNames},Stats Source URL`];

    for (const season of seasons) {
      const seasonScheduleData = await NDSchedules.getForSeason(season);

      seasonScheduleData.forEach((gameInfo) => {
        const homeTeamAbbreviation = gameInfo.isHomeGame ? 'ND' : gameInfo.opponentId;
        const awayTeamAbbreviation = gameInfo.isHomeGame ? gameInfo.opponentId : 'ND';

        const gameDate = getDateFromGame(gameInfo.date);
        if (gameDate === 'TBD') return;

        const gameDateString = format(gameDate, 'MM/dd/yyyy');

        const homeLinescore = gameInfo.linescore?.home.join('|');
        const awayLinescore = gameInfo.linescore?.away.join('|');

        let homeStatValues = '';
        if (gameInfo.stats?.home.totalYards !== -1) {
          homeStatValues = STATS.map(
            (stat) => gameInfo.stats?.home[stat.name as keyof TeamStats] ?? ''
          ).join(',');
        }

        let awayStatValues = '';
        if (gameInfo.stats?.away.totalYards !== -1) {
          awayStatValues = STATS.map((stat) => gameInfo.stats?.away[stat.name] ?? '').join(',');
        }

        lines.push(
          `${season},${gameDateString},${awayTeamAbbreviation},${awayLinescore},${awayStatValues}`
        );
        lines.push(`,,${homeTeamAbbreviation},${homeLinescore},${homeStatValues}`);
      });
    }

    const outputFilename = `${OUTPUT_DATA_DIRECTORY}/${firstYear}.csv`;
    fs.writeFileSync(outputFilename, lines.join('\n'));
  }

  logger.success('CSVs generated!');
}

main();
