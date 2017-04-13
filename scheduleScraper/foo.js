var fs = require('fs');
const _ = require('lodash');

var teamsArray = fs.readFileSync('./teams.txt').toString().split('\n');

const obj = {};
_.forEach(teamsArray, (line) => {
  if (_.trim(line) !== '') {
    const tokens = line.split(', ');
    obj[tokens[0]] = tokens[2];
  }
});

fs.writeFileSync('teamMappings.json', JSON.stringify(obj, null, 2));
