const path = require('path');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../data');

const year = 1990;
const scheduleData = require(`${INPUT_DATA_DIRECTORY}/${year}`);

const columns = [
  'Total Score',
  'Quarter Scores',
  '1st Downs',
  '3rd Down Eff',
  '4th Down Eff',
  'Total Yards',
  'Pass Yards',
  'Comp-Att',
  'Yards / Pass',
  'Rush Yards',
  'Rush Att',
  'Yards / Rush',
  'Turnovers',
  'Fumbles - Lost',
  'Int Thrown',
  'Penalties - Yards',
  'Possession',
];

const statNameRow = `,,${columns.join(',')}`;

const rows = [];

scheduleData.forEach((gameData) => {
  rows.push(statNameRow);
  if (gameData.isHomeGame) {
    rows.push(`${gameData.date},${gameData.opponentId},${gameData.score.away}`);
    rows.push(`,ND,${gameData.score.home}`);
    rows.push('');
  } else {
    rows.push(`${gameData.date},ND,${gameData.score.away}`);
    rows.push(`,${gameData.opponentId},${gameData.score.home}`);
    rows.push('');
  }
});

console.log(rows.join('\n'));
