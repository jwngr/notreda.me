const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// 2018 salary data: http://sports.usatoday.com/ncaa/salaries/football/coach
// 2017 salary data: https://web.archive.org/web/20180104001957/http://sports.usatoday.com/ncaa/salaries
// 2016 salary data: https://web.archive.org/web/20171018235605/http://sports.usatoday.com/ncaa/salaries
// 2015 salary data: https://web.archive.org/web/20161006063710/http://sports.usatoday.com/ncaa/salaries
// 2014 salary data: https://web.archive.org/web/20141122062319/http://sports.usatoday.com/ncaa/salaries

const TSV_INPUT_FILE = path.resolve(__dirname, './data/coachSalaries2018.tsv');
const JSON_OUTPUT_FILE = path.resolve(__dirname, './data/coachSalaries2018.json');

const lines = fs.readFileSync(TSV_INPUT_FILE, 'utf-8').split('\n');

const result = [];

const headers = lines[0].split('\t');

lines.forEach((line, i) => {
  if (i > 0 && _.size(line) > 0) {
    const obj = {};
    const currentLineTokens = line.split('\t');

    headers.forEach((header, j) => {
      const val = currentLineTokens[j];

      if (_.includes(['teamName', 'headCoach'], header)) {
        obj[header] = val;
      } else if (header === 'totalPay') {
        if (val === '--') {
          obj.salary = 'Unknown';
        } else {
          obj.salary = Number(val.slice(1).replace(/,/g, ''));
        }
      }
    });

    if (_.size(obj) !== 0) {
      result.push(obj);
    }
  }
});

fs.writeFileSync(JSON_OUTPUT_FILE, JSON.stringify(result, null, 2));
