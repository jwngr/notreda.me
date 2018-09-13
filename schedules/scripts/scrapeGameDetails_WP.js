const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request-promise');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../data');

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

const fetchGameDetailsForYear = (year) => {
  console.log(`[INFO] Fetching year ${year}`);

  return getHtmlForUrl(
    `https://en.wikipedia.org/wiki/${year}_Notre_Dame_Fighting_Irish_football_team`
  )
    .then(($) => {
      let $scheduleTable = $('#Schedule')
        .parent()
        .next();

      if ($scheduleTable[0].name !== 'table') {
        $scheduleTable = $scheduleTable.next();
      }

      const $scheduleTableRows = $scheduleTable.find('tr');

      const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
      const gamesData = require(filename);

      const headerNames = [];
      $scheduleTableRows.each((i, row) => {
        if (i === 0) {
          $(row)
            .children('th')
            .each((j, elem) => {
              headerNames.push(
                $(elem)
                  .text()
                  .trim()
              );
            });
        } else if (i <= gamesData.length) {
          const rowCellValues = [];
          $(row)
            .children('td')
            .each((j, elem) => {
              let rowCellText = $(elem)
                .text()
                .trim();

              // Fix formatting issue in 1961 site data.
              if (j === headerNames.indexOf('Site') && !_.includes(rowCellText, ' • ')) {
                let lastCharWasLowercase = false;
                rowCellText.split('').forEach((char, k) => {
                  if (char >= 'A' && char <= 'Z' && lastCharWasLowercase) {
                    rowCellText = rowCellText.slice(0, k) + ' • ' + rowCellText.slice(k);
                  } else {
                    lastCharWasLowercase = char >= 'a' && char <= 'z';
                  }
                });
              }

              rowCellValues.push(rowCellText);
            });

          try {
            // TIME
            const timeIndex = headerNames.indexOf('Time');
            if (timeIndex !== -1) {
              gamesData[i - 1].time = rowCellValues[timeIndex]
                .replace('p.m.', 'PM')
                .replace('p.m', 'PM')
                .replace('a.m.', 'AM')
                .replace('a.m', 'AM');
            }

            // TV COVERAGE
            const coverageIndex = headerNames.indexOf('TV');
            if (coverageIndex !== -1) {
              gamesData[i - 1].coverage = rowCellValues[coverageIndex].toUpperCase() || undefined;
            }

            const siteIndex = headerNames.indexOf('Site');
            if (siteIndex !== -1) {
              // STADIUM
              const [stadium, location] = rowCellValues[siteIndex].split(' • ');
              let city;
              let state;
              let stateAndParens;
              if (_.includes(location, ',')) {
                [city, stateAndParens] = location.split(', ');
                state = stateAndParens.split(' (')[0];
              } else {
                city = location.split(' (')[0];
              }
              let correctedStadium = stadium.replace('–', '-');
              if (correctedStadium === 'FedExField') {
                correctedStadium = 'FedEx Field';
              }
              gamesData[i - 1].location.stadium = correctedStadium;

              // CITY / STATE
              if (
                gamesData[i - 1].location.city !== 'Notre Dame' &&
                !gamesData[i - 1].location.country
              ) {
                gamesData[i - 1].location.city = city;
                if (state) {
                  gamesData[i - 1].location.state = state[0] + state[1];
                }
              }
            }
          } catch (error) {
            console.log(`[ERROR] Failed to parse schedule for ${year}:`, error);
            console.log('CURRENT ROW CELL VALUES:', rowCellValues);
            throw error;
          }
        }
      });

      fs.writeFileSync(filename, JSON.stringify(gamesData, null, 2));

      console.log('Success!');
    })
    .catch((error) => {
      console.log('Error fetching team records:', error);
    });
};

_.range(1950, 2018).forEach((year) => {
  fetchGameDetailsForYear(year);
});
