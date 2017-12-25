import _ from 'lodash';
import * as d3 from 'd3';
import React, {Component} from 'react';

import Tooltip from '../charts/Tooltip';

import schedule from '../../resources/schedule';

import './YardPoints.css';

class YardPoints extends Component {
  constructor(props) {
    super(props);

    let yardsDifferentialData = [];

    _.forEach(schedule, (yearData, year) => {
      let currentData = schedule[year].map(({stats, score, opponentId, result, isHomeGame}) => {
        if (stats && _.get(stats, 'home.rushYards', -1) !== -1) {
          let rushYardsDifferential;
          let passYardsDifferential;

          let scoreText;
          let turnoverDifferential;
          const awayTurnoverCount = stats.away.interceptionsThrown + stats.away.fumblesLost;
          const homeTurnoverCount = stats.home.interceptionsThrown + stats.home.fumblesLost;

          if (isHomeGame) {
            rushYardsDifferential = stats.home.rushYards - stats.away.rushYards;
            passYardsDifferential = stats.home.passYards - stats.away.passYards;
            scoreText = `${result} ${score.home}-${score.away}`;
            turnoverDifferential = awayTurnoverCount - homeTurnoverCount;
          } else {
            rushYardsDifferential = stats.away.rushYards - stats.home.rushYards;
            passYardsDifferential = stats.away.passYards - stats.home.passYards;
            scoreText = `${result} ${score.away}-${score.home}`;
            turnoverDifferential = homeTurnoverCount - awayTurnoverCount;
          }

          return {
            year,
            result,
            scoreText,
            opponentId,
            turnoverDifferential,
            x: rushYardsDifferential,
            y: passYardsDifferential,
          };
        }
      });

      // Remove undefined values from array
      currentData = _.filter(currentData);

      if (!_.isEmpty(currentData)) {
        yardsDifferentialData = yardsDifferentialData.concat(currentData);
      }
    });

    console.log(yardsDifferentialData);

    this.state = {
      tooltip: null,
      data: yardsDifferentialData,
      scatterPlotData: [
        {
          question: 'Activity One',
          answer: 'Some answer',
          value: 2,
          consequence: -2,
        },
        {
          question: 'Activity Two',
          answer: 'Some answer',
          value: 1,
          consequence: -2,
        },
        {
          question: 'Activity Three',
          answer: 'Another answer',
          value: 1,
          consequence: -1,
        },
        {
          question: 'Activity Four',
          answer: 'Another answer',
          value: 2,
          consequence: 1,
        },
        {
          question: 'Activity Five',
          answer: 'Another answer',
          value: 1,
          consequence: 2,
        },
        {
          question: 'Activity Six',
          answer: 'Another answer',
          value: -2,
          consequence: -2,
        },
        {
          question: 'Activity Seven',
          answer: 'Another answer',
          value: -2,
          consequence: 2,
        },
      ],
    };
  }

  setTooltip(tooltip) {
    console.log('setTooltip:', tooltip);
    this.setState({
      tooltip,
    });
  }

  getMinValueForKey(data, key) {
    return data.reduce((min, p) => (p[key] < min ? p[key] : min), data[0][key]);
  }

  getMaxValueForKey(data, key) {
    return data.reduce((max, p) => (p[key] > max ? p[key] : max), data[0][key]);
  }

  componentDidMount() {
    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    };

    const scatterPlotWidth = 500;
    const scatterPlotHeight = 500;
    var domainWidth = scatterPlotWidth - margin.left - margin.right;
    var domainHeight = scatterPlotHeight - margin.top - margin.bottom;

    const scatterPlot = d3
      .select(this.scatterPlotRef)
      .attr('width', scatterPlotWidth)
      .attr('height', scatterPlotHeight);

    const minX = this.getMinValueForKey(this.state.data, 'x');
    const maxX = this.getMaxValueForKey(this.state.data, 'x');

    const minY = this.getMinValueForKey(this.state.data, 'y');
    const maxY = this.getMaxValueForKey(this.state.data, 'y');

    const min = Math.min(minX, minY);
    const max = Math.max(maxX, maxY);

    const range = Math.max(-min, max);

    var scatterPlotX = d3
      .scaleLinear()
      .domain([-range - 50, range + 50])
      .range([0, domainWidth]);

    var scatterPlotY = d3
      .scaleLinear()
      .domain([-range - 50, range + 50])
      .range([domainHeight, 0]);

    var g = scatterPlot
      .append('g')
      .attr('transform', 'translate(' + margin.top + ',' + margin.top + ')');

    // var tooltip = scatterPlot.append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 0);

    g
      .append('rect')
      .attr('width', scatterPlotWidth - margin.left - margin.right)
      .attr('height', scatterPlotHeight - margin.top - margin.bottom)
      .attr('fill', '#F6F6F6');

    g
      .selectAll('circle')
      .data(this.state.data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', (d) => {
        console.log(d);
        return Math.abs(d.turnoverDifferential) + 1;
      })
      .attr('cx', (d) => {
        return scatterPlotX(d.x);
      })
      .attr('cy', (d) => {
        return scatterPlotY(d.y);
      })
      .style('stroke', (d) => {
        if (d.result === 'W') {
          return 'green';
        } else if (d.result === 'L') {
          return 'red';
        } else if (d.result === 'T') {
          return 'yellow';
        }
      })
      .style('fill', (d) => {
        if (d.turnoverDifferential >= 0) {
          if (d.result === 'W') {
            return 'green';
          } else if (d.result === 'L') {
            return 'red';
          } else if (d.result === 'T') {
            return 'yellow';
          }
        } else {
          return 'transparent';
        }
      })
      .on('mouseover', (d) => {
        const tooltipHtml = `<p>${d.scoreText}, ${d.year} ${d.opponentId}</p>`;
        console.log(tooltipHtml);

        clearTimeout(this.unsetTooltipTimeout);

        d.realX = scatterPlotX(d.x);
        d.realY = scatterPlotX(d.y);

        this.setTooltip(d);

        // tooltip
        //   .transition()
        //   .duration(200)
        //   .style('opacity', .9);
        // tooltip
        //   .html(tooltipHtml)
        //   .style('left', (d3.event.pageX) + 'px')
        //   .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
        console.log('OUT');
        // tooltip
        //   .transition()
        //   .duration(500)
        //   .style('opacity', 0);
        this.unsetTooltipTimeout = setTimeout(() => this.setTooltip(null), 200);
      });

    g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + scatterPlotY.range()[0] / 2 + ')')
      .call(d3.axisBottom(scatterPlotX).ticks(7));

    g
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + scatterPlotX.range()[1] / 2 + ', 0)')
      .call(d3.axisLeft(scatterPlotY).ticks(7));
  }

  render() {
    const {tooltip} = this.state;

    let tooltipContent;
    if (tooltip) {
      console.log('TOOLTIP:', tooltip.realX, tooltip.realY);
      const tooltipText = `${tooltip.scoreText}, ${tooltip.year} ${tooltip.opponentId}`;
      tooltipContent = (
        <Tooltip x={tooltip.realX - 50} y={450 - tooltip.realY} text={tooltipText} />
      );
    }

    return (
      <div>
        <svg className="quadrant-chart" ref={(r) => (this.scatterPlotRef = r)} />
        {tooltipContent}
      </div>
    );
  }
}

export default YardPoints;
