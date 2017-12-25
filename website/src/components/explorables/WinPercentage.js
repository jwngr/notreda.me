import _ from 'lodash';
import format from 'date-fns/format';
import React, {Component} from 'react';

import Note from './Note';
import Paragraph from './Paragraph';
import LineChart from '../charts/LineChart';

import schedule from '../../resources/schedule';
import alabamaSchedule from '../../resources/explorables/winPercentage/alabama.json';
import boiseStateSchedule from '../../resources/explorables/winPercentage/boiseState.json';
import michiganSchedule from '../../resources/explorables/winPercentage/michigan.json';
import nebraksaSchedule from '../../resources/explorables/winPercentage/nebraska.json';
import notreDameSchedule from '../../resources/explorables/winPercentage/notreDame.json';
import ohioStateSchedule from '../../resources/explorables/winPercentage/ohioState.json';
import oklahomaSchedule from '../../resources/explorables/winPercentage/oklahoma.json';
import oldDominionSchedule from '../../resources/explorables/winPercentage/oldDominion.json';
import texasSchedule from '../../resources/explorables/winPercentage/texas.json';
import uscSchedule from '../../resources/explorables/winPercentage/usc.json';

import './WinPercentage.css';

class WinPercentage extends Component {
  constructor(props) {
    super(props);

    let winCount = 0;
    let lossCount = 0;
    let tieCount = 0;

    let ndWinPercentageByGame = [];
    let stanfordWinPercentageByGame = [];
    let ndWinPercentageByYear = [];

    _.forEach(schedule, (yearData, year) => {
      let yearWinCount = 0;
      let yearLossCount = 0;
      let yearTieCount = 0;
      let lastGameOfYearWinPercentage;

      _.forEach(schedule[year], ({result, opponentId, date, timestamp}) => {
        // Exclude future games
        if (result) {
          let gameClassName;
          if (result === 'W') {
            winCount++;
            yearWinCount++;
            gameClassName = 'win';
          } else if (result === 'L') {
            lossCount++;
            yearLossCount++;
            gameClassName = 'loss';
          } else {
            tieCount++;
            yearTieCount++;
            gameClassName = 'tie';
          }

          const winPercentage = winCount / (winCount + lossCount) * 100;
          lastGameOfYearWinPercentage = winPercentage;

          const dateObj = new Date(timestamp || date);

          ndWinPercentageByGame.push({
            x: dateObj,
            y: winPercentage,
            radius: 2,
            className: gameClassName,
            tooltipChildren: (
              <div>
                <p>
                  {result} {opponentId}
                </p>
                <p>Date: {format(dateObj, 'MM/DD/YYYY')}</p>
                <p>Win %: {winPercentage.toFixed(2)}</p>
              </div>
            ),
          });

          const stanfordWinPercentage = Math.random() * 50;

          stanfordWinPercentageByGame.push({
            x: dateObj,
            y: stanfordWinPercentage,
            radius: 2,
            className: gameClassName,
            tooltipChildren: (
              <div>
                <p>
                  {result} {opponentId}
                </p>
                <p>Date: {format(dateObj, 'MM/DD/YYYY')}</p>
                <p>Win %: {stanfordWinPercentage.toFixed(2)}</p>
              </div>
            ),
          });
        }
      });

      if (yearWinCount + yearLossCount + yearTieCount !== 0) {
        let yearClassName = '';
        if (yearWinCount > yearLossCount) {
          yearClassName += 'winning-record';
        } else if (yearWinCount < yearLossCount) {
          yearClassName += 'losing-record';
        } else {
          yearClassName += 'even-record';
        }

        let record = `${yearWinCount}-${yearLossCount}`;
        if (yearTieCount !== 0) {
          record += `-${yearTieCount}`;
        }

        ndWinPercentageByYear.push({
          x: new Date(String(year)),
          y: lastGameOfYearWinPercentage,
          radius: 3,
          className: yearClassName,
          tooltipChildren: (
            <div>
              <p>{year}</p>
              <p>Record: {record}</p>
              <p>Win %: {lastGameOfYearWinPercentage.toFixed(2)}</p>
            </div>
          ),
        });
      }
    });

    //TODO figure out where the missing six wins are?
    console.log('W:', winCount);
    console.log('L:', lossCount);
    console.log('T:', tieCount);

    const teamSchedules = [
      michiganSchedule,
      notreDameSchedule,
      ohioStateSchedule,
      boiseStateSchedule,
      alabamaSchedule,
      oklahomaSchedule,
      texasSchedule,
      uscSchedule,
      nebraksaSchedule,
      oldDominionSchedule,
    ];

    const teamsData = _.map(teamSchedules, (schedule) => {
      const results = {W: 0, L: 0, T: 0};
      const data = _.map(schedule, ({date, result, oppponent}) => {
        results[result]++;

        const winPercentage = results.W / (results.W + results.L) * 100;

        return {
          x: new Date(date),
          y: winPercentage,
          radius: 2,
          tooltipChildren: (
            <div>
              <p>
                {result} {oppponent}
              </p>
              <p>Date: {format(date, 'MM/DD/YYYY')}</p>
              <p>Win %: {winPercentage.toFixed(2)}</p>
            </div>
          ),
        };
      });

      return {
        values: data,
      };
    });

    const ndVsMich = _.map([notreDameSchedule, michiganSchedule], (schedule) => {
      const results = {W: 0, L: 0, T: 0};
      const data = _.map(schedule, ({date, result, oppponent}) => {
        results[result]++;

        const winPercentage = results.W / (results.W + results.L) * 100;

        return {
          x: new Date(date),
          y: winPercentage,
          radius: 2,
          tooltipChildren: (
            <div>
              <p>
                {result} {oppponent}
              </p>
              <p>Date: {format(date, 'MM/DD/YYYY')}</p>
              <p>Win %: {winPercentage.toFixed(2)}</p>
            </div>
          ),
        };
      });

      return {
        values: data,
      };
    });

    this.state = {
      ndWinPercentageByGame: [{id: 'ND', values: ndWinPercentageByGame}],
      ndWinPercentageByYear: [{id: 'ND', values: ndWinPercentageByYear}],
      teams: teamsData,
      ndVsMich: ndVsMich,
    };
  }

  render() {
    return (
      <div>
        <h1>Historical Win Percentage</h1>
        <Paragraph>
          Over the course of my life (since 1990), Notre Dame has a win percentage of a paltry
          0.6XX. Despite the past three decades,
          <a href="https://en.wikipedia.org/wiki/NCAA_Division_I_FBS_football_win-loss_records">
            Notre Dame remains towards the top of historical win percentage
          </a>{' '}
          (0.730), behind none other than our rival Michigan Wolverines (0.736). Beyond hearing this
          statistic from commentators every few games, let's dive into some of the interesting
          trends and moments regarding the Irish's historical win percentage.
        </Paragraph>

        <Paragraph>
          The first place to start is to chart the historical win percentage after every game the
          Irish played. Wins are green, losses are red, and ties are yellow. Note that ties are
          ignored when it comes to calculating win percentage:
        </Paragraph>

        <LineChart seriesData={this.state.ndWinPercentageByGame} domainY={[0, 100]} />

        <LineChart seriesData={this.state.ndWinPercentageByYear} domainY={[0, 100]} />

        <Note>
          The chart above - and all charts in this post - are interactive! Roll your mouse over the
          data points for stats about that particular game.
        </Note>

        <Paragraph>
          Let's get this out the way first: Notre Dame has not looked great, historically speaking,
          the last couple decades. There are almost as many red and yellow dots in this millenia as
          there are the 1XX years before. And I'll have more to say about that slide at the end
          ofthe chart later.
        </Paragraph>

        <Paragraph>
          Now, on to less heartwrenching storylines, let's zoom in a little bit, ignoring the first
          few seasons where the small data set makes the data quite noisy:
        </Paragraph>

        <LineChart seriesData={this.state.ndWinPercentageByYear} domainY={[60, 90]} />

        <Paragraph>This chart alone shows some interesting things:</Paragraph>

        <Paragraph>
          First, even a season with a winning record (the green dots), can lower the historical win
          percentage. Notre Dame's historical greatness is actually a detriment in this case. Not
          only do you need to have a winning record, you need to eclipse the historical win
          percentage. Taking the current 0.730 win percentage, Notre Dame needs to win 10 games in a
          13 game season (12 regular season games plus one bowl game) in order to improve their
          record. If ND loses to LSU, mention how that "good" season still dropped our win
          percentage.
        </Paragraph>

        <Paragraph>
          Roughly speaking, there appear to be four uptrends and four downtrends:
        </Paragraph>

        <Paragraph>
          Ironically enough, the losses that began each downswing are USC (1929), USC (1951), USC
          (1981), and Boston College (1994). No one said life as a Notre Dame fan was easy.
        </Paragraph>

        <Paragraph>Losing records and even records always drop the win percentage.</Paragraph>

        <Paragraph>
          There appear to be three main dips of prolonged trending downward, the most recent of
          which has been ongoing for the past three decades.
        </Paragraph>

        <Paragraph>So how does this graph compare to Michigan's? Let's take a look:</Paragraph>

        <LineChart seriesData={this.state.teams} domainY={[0, 100]} showDataPoints={false} />

        <LineChart seriesData={this.state.ndVsMich} domainY={[0, 100]} showDataPoints={false} />
      </div>
    );
  }
}

export default WinPercentage;
