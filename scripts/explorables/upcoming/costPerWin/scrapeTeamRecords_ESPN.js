import fs from 'fs';

import _ from 'lodash';

import {Logger} from '../../../lib/logger';
import scraper from '../../../lib/scraper';
import coachSalaries from './data/coachSalaries2018.json';

Logger.info('Scraping records for current season...');

const TEAM_NAMES_MAP = {
  'Miss State': 'Mississippi State',
  'Mich. State': 'Michigan State',
  'S Carolina': 'South Carolina',
  VT: 'Virginia Tech',
  FSU: 'Florida State',
  UVA: 'Virginia',
  USF: 'South Florida',
  Pitt: 'Pittsburgh',
  'LA Tech': 'Louisiana Tech',
  'W Michigan': 'Western Michigan',
  'N Illinois': 'Northern Illinois',
  'E Michigan': 'Eastern Michigan',
  'Ga Southern': 'Georgia Southern',
  FAU: 'Florida Atlantic',
  FIU: 'Florida International',
  'Mid Tennessee': 'Middle Tennessee',
  'Southern Miss': 'Southern Mississippi',
  'Cent Michigan': 'Central Michigan',
  UMass: 'Massachusetts',
  "Hawai'i": 'Hawaii',
  'C. Carolina': 'Coastal Carolina',
  'W Kentucky': 'Western Kentucky',
  ECU: 'East Carolina',
  UConn: 'Connecticut',
};

const scrapTeamRecords = async () => {
  const $ = await scraper.get('http://www.espn.com/college-football/statistics/teamratings');

  const $teamRows = $('.oddrow, .evenrow');

  let teamRecords = {};

  $teamRows.each((i, row) => {
    const $rowCells = $(row).find('td');

    let teamName = $rowCells
      .eq(1)
      .find('a')
      .text()
      .trim()
      .replace(/ St\.*$/, ' State');

    if (teamName in TEAM_NAMES_MAP) {
      teamName = TEAM_NAMES_MAP[teamName];
    }

    const record = $rowCells.eq(2).text().trim();

    const teamCoachSalaryData = _.find(coachSalaries, ['teamName', teamName]);

    if (_.size(teamCoachSalaryData) === 0) {
      Logger.error('Team not found in coach salaries list.', {teamName});
    }

    teamRecords[teamName] = {
      wins: Number(record.split('-')[0]),
      losses: Number(record.split('-')[1]),
      ..._.pick(teamCoachSalaryData, ['headCoach', 'salary']),
    };
  });

  return teamRecords;
};

scrapTeamRecords()
  .then((teamRecords) => {
    fs.writeFileSync('./data/teamRecordsAndSalaries.json', JSON.stringify(teamRecords, null, 2));

    Logger.success('Team records for current season fetched!');
  })
  .catch((error) => {
    Logger.success('Failed to fetch team records for current season!', {error});
  });
