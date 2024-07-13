import {format} from 'date-fns/format';
import React, {Component} from 'react';

import alabamaSchedule from '../../resources/explorables/winPercentage/alabama.json';
import boiseStateSchedule from '../../resources/explorables/winPercentage/boiseState.json';
import michiganSchedule from '../../resources/explorables/winPercentage/michigan.json';
// import nebraskaSchedule from '../../resources/explorables/winPercentage/nebraska.json';
import notreDameSchedule from '../../resources/explorables/winPercentage/notreDame.json';
import ohioStateSchedule from '../../resources/explorables/winPercentage/ohioState.json';
// import oklahomaSchedule from '../../resources/explorables/winPercentage/oklahoma.json';
// import oldDominionSchedule from '../../resources/explorables/winPercentage/oldDominion.json';
// import texasSchedule from '../../resources/explorables/winPercentage/texas.json';
// import uscSchedule from '../../resources/explorables/winPercentage/usc.json';
import {LineChart} from '../charts/LineChart';
import {Note} from './Note';
import {Paragraph} from './Paragraph';

import './WinPercentage.css';

import {Schedules} from '../../lib/schedules';
import {StyledExternalLink} from './index.styles';

export class WinPercentage extends Component {
  constructor(props) {
    super(props);

    let winCount = 0;
    let lossCount = 0;
    let tieCount = 0;

    let ndWinPercentageByGame = [];
    let stanfordWinPercentageByGame = [];
    let ndWinPercentageByYear = [];

    Schedules.getSeasons().forEach(async (year) => {
      const yearData = await Schedules.getForSeason(year);

      let yearWinCount = 0;
      let yearLossCount = 0;
      let yearTieCount = 0;
      let lastGameOfYearWinPercentage;

      yearData.forEach(({result, opponentId, date}) => {
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

          const winPercentage =
            ((winCount + tieCount / 2) / (winCount + lossCount + tieCount)) * 100;
          lastGameOfYearWinPercentage = winPercentage;

          const dateObj = new Date(date);

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
                <p>Date: {format(dateObj, 'MM/dd/yyyy')}</p>
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
                <p>Date: {format(dateObj, 'MM/dd/yyyy')}</p>
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
    // console.log('W:', winCount);
    // console.log('L:', lossCount);
    // console.log('T:', tieCount);

    const teamSchedules = {
      MICH: michiganSchedule,
      ND: notreDameSchedule,
      OSU: ohioStateSchedule,
      BSU: boiseStateSchedule,
      ALA: alabamaSchedule,
      // OK: oklahomaSchedule,
      // TEXT: texasSchedule,
      // USC: uscSchedule,
      // NEB: nebraskaSchedule,
      // OLD: oldDominionSchedule,
    };

    const teamsData = Object.entries(teamSchedules).map(([teamName, schedule]) => {
      // const results = {W: 0, L: 0, T: 0};

      // const gameData = _.map(_.flatten(schedule), ({date, result, oppponent}) => {
      //   results[result]++;

      //   const winPercentage = (results.W / (results.W + results.L)) * 100;

      //   return {
      //     x: new Date(date),
      //     y: winPercentage,
      //     tooltipChildren: (
      //       <div>
      //         <p>
      //           {result} {oppponent}
      //         </p>
      //         <p>Date: {format(date, 'MM/dd/yyyy')}</p>
      //         <p>Win %: {winPercentage.toFixed(2)}</p>
      //       </div>
      //     ),
      //   };
      // });

      const yearData = [];
      const yearResults = {W: 0, L: 0, T: 0};
      Object.entries(schedule).forEach((season) => {
        let currentYear;
        season.forEach(({date, result}) => {
          currentYear = currentYear || date.split('/')[2];

          yearResults[result]++;
        });

        const seasonEndWinPercentage = (yearResults.W / (yearResults.W + yearResults.L)) * 100;

        let record = `${yearResults.W}-${yearResults.L}`;
        if (yearResults.T !== 0) {
          record += `-${yearResults.T}`;
        }

        yearData.push({
          x: new Date(currentYear),
          y: seasonEndWinPercentage,
          tooltipChildren: (
            <div>
              <p>
                {teamName} {currentYear}
              </p>
              <p>Record: {record}</p>
              <p>Win %: {seasonEndWinPercentage.toFixed(2)}</p>
            </div>
          ),
        });
      });

      return {
        id: teamName,
        values: yearData,
      };
    });

    const ndVsMich = [notreDameSchedule, michiganSchedule].map((schedule) => {
      const results = {W: 0, L: 0, T: 0};
      const data = schedule.flatMap(({date, result, oppponent}) => {
        results[result]++;

        const winPercentage = (results.W / (results.W + results.L)) * 100;

        return {
          x: new Date(date),
          y: winPercentage,
          radius: 2,
          tooltipChildren: (
            <div>
              <p>
                {result} {oppponent}
              </p>
              <p>Date: {format(date, 'MM/dd/yyyy')}</p>
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
          Despite many mediocre &mdash; and some downright awful &mdash; seasons over the past three
          decades, Notre Dame remains a historically great program based on{' '}
          <StyledExternalLink href="https://en.wikipedia.org/wiki/NCAA_Division_I_FBS_football_win-loss_records">
            overall win percentage
          </StyledExternalLink>{' '}
          . Their 0.7290 historical win percentage is behind only one team, none other than their
          rival Michigan Wolverines, whose win percentage of 0.7291 is better only at the fourth
          decimal place. A win over the Wolverines in this weekend's season opener would allow the
          Irish to once again regain the top spot. In honor of this big upcoming game, let's dive
          into some of the interesting trends and moments with the Irish's win percentage over the
          years.
        </Paragraph>

        <Paragraph>
          The place to start is by charting the historical win percentage after every single game
          the Irish have played. Wins are green, losses are red, and ties are yellow. Note that ties
          do factor into the win percentage, counting as half a win and half a loss.
        </Paragraph>

        <LineChart
          seriesData={this.state.ndWinPercentageByGame}
          domainY={[0, 100]}
          showLine={false}
        />

        <Note>
          The chart above - and all charts in this post - are interactive! Roll your mouse over the
          data points for stats about that particular game.
        </Note>

        <Paragraph>
          To more easily digest all this information, let's just chart Notre Dame's win percentage
          at the culmination of each season. Green indicates a season finishing above 0.500, red a
          season below 0.500, and yellow a season at exactly 0.500.
        </Paragraph>

        <LineChart
          seriesData={this.state.ndWinPercentageByYear}
          domainY={[0, 100]}
          showLine={false}
        />

        <Paragraph>
          Let's get the obvious out of the way: this graph is not trending in a great direction for
          Notre Dame. There are almost as many red and yellow dots in this millenia as there are in
          all years prior. I'll have more to say about this decades-long slide later. For now, let's
          focus on some less heartwrenching storylines. If we zoom in a little bit by ignoring the
          first few seasons which are quite noisy, some interesting trends emerge:
        </Paragraph>

        <LineChart
          seriesData={this.state.ndWinPercentageByYear}
          domainY={[60, 90]}
          showLine={false}
        />

        <Paragraph>
          Given Notre Dame historical greatness, even seasons ending with a winning record can lower
          their overall win percentage. Not only do they need to have a winning record, they need to
          eclipse their historical win percentage. Taking the current 0.7290 win percentage, Notre
          Dame needs to win 10 games in a 13 game season or 11 in a 14 game season in order to
          improve their record. The latter is likely given a 14 game season means they will be
          playing in the National Championship, but the former is by no means easy. Taking last
          season as an example, a comeback win against LSU in the Citrus Bowl thanks to Miles Boykin
          one-handed wondergrab is the only reason Notre Dame's historical win percentage increased.
        </Paragraph>

        <Paragraph>
          Roughly speaking, the graph can be broken down into four uptrends and four downtrends:
        </Paragraph>

        <Paragraph>TODO: visualize these four regions in a chart</Paragraph>

        <Paragraph>
          Ironically enough, the losses that began each downswing are USC (1929), USC (1951), USC
          (1981), and... Boston College (1994). No one said life as a Notre Dame fan was easy.
        </Paragraph>

        <Paragraph>*** Miscellaneous ramblings from here on out... ***</Paragraph>

        <Paragraph>Losing records and even records always drop the win percentage.</Paragraph>

        <Paragraph>
          So how does this graph compare to other top teams, including Michigan? Let's take a look:
        </Paragraph>

        <LineChart seriesData={this.state.teams} domainY={[0, 100]} showDataPoints={false} />

        <Paragraph>
          Let's zoom in only back to 1975 (even though these graphs are incomplete and don't even
          make sense yet...):
        </Paragraph>

        <LineChart
          seriesData={this.state.teams}
          domainX={[new Date('1970'), new Date('2017')]}
          domainY={[68, 82]}
          showDataPoints={true}
        />

        <Paragraph>
          Dive into how many times Notre Dame and Michigan have traded the top spot over their
          histories (again, these graphs are incomplete and don't make sense yet...)
        </Paragraph>

        <LineChart seriesData={this.state.ndVsMich} domainY={[0, 100]} showDataPoints={false} />
      </div>
    );
  }
}
