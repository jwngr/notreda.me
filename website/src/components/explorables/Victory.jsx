import _ from 'lodash';
import React, {Component} from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';

import schedule from '../../resources/schedule';

import './Victory.css';

export class Victory extends Component {
  constructor(props) {
    super(props);

    let yardsDifferentialData = [];

    _.forEach(schedule, (yearData, year) => {
      let currentData = schedule[year].map(({stats, score, opponentId, result, isHomeGame}) => {
        if (typeof stats !== 'undefined') {
          let rushYardsDifferential;
          let passYardsDifferential;

          let scoreText;

          if (isHomeGame) {
            rushYardsDifferential = stats.home.rushYards - stats.away.rushYards;
            passYardsDifferential = stats.home.passYards - stats.away.passYards;
            scoreText = `${result} ${score.home}-${score.away}`;
          } else {
            rushYardsDifferential = stats.away.rushYards - stats.home.rushYards;
            passYardsDifferential = stats.away.passYards - stats.home.passYards;
            scoreText = `${result} ${score.away}-${score.home}`;
          }

          let fill;
          if (result === 'W') {
            fill = 'green';
          } else if (result === 'L') {
            fill = 'red';
          } else if (result === 'T') {
            fill = 'yellow';
          }

          return {
            year: +year,
            result,
            scoreText,
            opponentId,
            x: rushYardsDifferential,
            y: passYardsDifferential,
            fill,
          };
        }
      });

      // Remove undefined values from array
      currentData = _.filter(currentData);

      if (!_.isEmpty(currentData)) {
        yardsDifferentialData = yardsDifferentialData.concat(currentData);
      }
    });

    this.state = {
      data: yardsDifferentialData,
    };
  }

  render() {
    // const tickStyle = {
    //   ticks: {
    //     size: 2,
    //     stroke: 'black',
    //     strokeOpacity: 0.1,
    //     padding: 0,
    //   },
    // };

    return (
      <div className="container">
        <VictoryChart
          className="scatter-chart"
          height={500}
          width={500}
          containerComponent={<VictoryVoronoiContainer />}
        >
          <VictoryAxis
            crossAxis
            width={500}
            height={500}
            label="Rushing"
            style={{axisLabel: {padding: 120}}}
            standalone={false}
          />
          <VictoryAxis
            dependentAxis
            crossAxis
            width={500}
            height={500}
            label="Passing"
            style={{axisLabel: {padding: 120}}}
            standalone={false}
          />
          <VictoryGroup
            labels={(d) => `${d.scoreText}, ${d.year} ${d.opponentId}`}
            labelComponent={<VictoryTooltip style={{fontSize: 12}} />}
            data={this.state.data}
          >
            <VictoryScatter
              size={(d, a) => {
                return a ? 8 : 3;
              }}
            />
          </VictoryGroup>
        </VictoryChart>
      </div>
    );
  }
}
