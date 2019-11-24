const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const format = require('date-fns/format');

const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

const OUTPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/decadeCsvs');

const DECADES = [
  _.range(1887, 1890),
  _.range(1892, 1900),
  _.range(1900, 1910),
  _.range(1910, 1920),
  _.range(1920, 1930),
  _.range(1930, 1940),
  _.range(1940, 1950),
  _.range(1950, 1960),
  _.range(1960, 1970),
  _.range(1970, 1980),
  _.range(1980, 1990),
  _.range(1990, 2000),
  _.range(2000, 2010),
  _.range(2010, 2020),
];

const stats = [
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

logger.info('Generating CSVs...');

DECADES.forEach((seasons) => {
  const firstYear = seasons[0];

  const statNames = stats.map((stat) => stat.text).join(',');

  const lines = [`Season,Date,Team,Linescore,${statNames},Stats Source URL`];

  seasons.forEach((season) => {
    const seasonScheduleData = ndSchedules.getForSeason(season);

    seasonScheduleData.forEach((game) => {
      let homeTeamAbbreviation = game.isHomeGame ? 'ND' : game.opponentId;
      let awayTeamAbbreviation = game.isHomeGame ? game.opponentId : 'ND';

      let gameDateString = format(new Date(game.date || game.fullDate), 'MM/dd/yyyy');

      let homeLinescore = _.get(game, ['linescore', 'home'], []).join('|');
      let awayLinescore = _.get(game, ['linescore', 'away'], []).join('|');

      let homeStatValues = '';
      if (_.get(game, 'stats.home.totalYards', -1) !== -1) {
        homeStatValues = stats.map((stat) => game.stats.home[stat.name]).join(',');
      }

      let awayStatValues = '';
      if (_.get(game, 'stats.away.totalYards', -1) !== -1) {
        awayStatValues = stats.map((stat) => game.stats.away[stat.name]).join(',');
      }

      lines.push(
        `${season},${gameDateString},${awayTeamAbbreviation},${awayLinescore},${awayStatValues}`
      );
      lines.push(`,,${homeTeamAbbreviation},${homeLinescore},${homeStatValues}`);
    });
  });

  let outputFilename = `${OUTPUT_DATA_DIRECTORY}/${firstYear}.csv`;
  fs.writeFileSync(outputFilename, lines.join('\n'));
});

logger.success('CSVs generated!');
