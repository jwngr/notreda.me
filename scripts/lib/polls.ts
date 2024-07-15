import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import _ from 'lodash';

import {
  GameInfo,
  SeasonAllPollRankings,
  WeeklyIndividualPollRanking,
} from '../../website/src/models';
import {CURRENT_SEASON} from './constants';
import {Teams} from './teams';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POLLS_DATA_DIRECTORY = path.resolve(__dirname, '../../data/polls');

export class Polls {
  static getForSeason(season: number): SeasonAllPollRankings | null {
    try {
      return require(`${POLLS_DATA_DIRECTORY}/${season}.json`);
    } catch (error) {
      return null;
    }
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
    seasonScheduleData.forEach((game) => {
      let gameDate: Date;
      if (game.date) {
        gameDate = new Date(game.date);
      } else if (game.fullDate) {
        gameDate = new Date(game.fullDate);
      } else {
        throw new Error(`Game date is missing for ${season} ${game.opponentId}`);
      }

      for (const [pollId, pollData] of Object.entries(seasonPollsData)) {
        let currentWeekPollData: WeeklyIndividualPollRanking | undefined;
        for (const weekPollData of pollData) {
          if (weekPollData.date === 'Preseason') {
            currentWeekPollData = weekPollData;
          } else {
            const pollDate = new Date(weekPollData.date);
            pollDate.setHours(23);
            if (pollDate < gameDate) {
              currentWeekPollData = weekPollData;
            }
          }
        }

        if (!currentWeekPollData) return;

        if ('Notre Dame' in currentWeekPollData.teams) {
          const homeOrAway = game.isHomeGame ? 'home' : 'away';
          _.set(
            game,
            ['rankings', homeOrAway, pollId],
            currentWeekPollData.teams['Notre Dame'].ranking
          );
        }

        const opponentTeamName = Teams.getById(game.opponentId).name;
        if (opponentTeamName in currentWeekPollData.teams) {
          const homeOrAway = game.isHomeGame ? 'away' : 'home';
          _.set(
            game,
            ['rankings', homeOrAway, pollId],
            currentWeekPollData.teams[opponentTeamName].ranking
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
