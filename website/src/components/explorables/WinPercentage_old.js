import * as d3 from 'd3';
import React, {Component} from 'react';

import schedule from '../../resources/schedule.json';
import {LineChart} from '../charts/LineChart';
// import {Tooltip} from '../charts/Tooltip';

import './WinPercentage.css';

export class WinPercentage extends Component {
  constructor(props) {
    super(props);

    let winCount = 0;
    // let tieCount = 0;
    let lossCount = 0;

    let winPercentageData = [];
    let yearWinPercentageData = [];

    schedule.forEach((yearData, year) => {
      let yearWinCount = 0;
      let yearLossCount = 0;
      let yearTieCount = 0;
      let lastGameOfYearWinPercentage;

      let currentYearData = schedule[year].map(({score, opponentId, result, isHomeGame}) => {
        let scoreText;

        // Exclude future games
        if (result) {
          if (result === 'W') {
            winCount++;
            yearWinCount++;
          } else if (result === 'L') {
            lossCount++;
            yearLossCount++;
          } else {
            // tieCount++;
            yearTieCount++;
          }

          if (isHomeGame) {
            scoreText = `${result} ${score.home}-${score.away}`;
          } else {
            scoreText = `${result} ${score.away}-${score.home}`;
          }

          const winPercentage = (winCount / (winCount + lossCount)) * 100;
          lastGameOfYearWinPercentage = winPercentage;

          return {
            year: Number(year),
            result,
            scoreText,
            opponentId,
            isHomeGame,
            y: winPercentage,
          };
        }
      });

      // Remove undefined values from array
      currentYearData = currentYearData.filter((d) => !!d);

      let yearClassName = '';
      if (yearWinCount > yearLossCount) {
        yearClassName += 'winning-record';
      } else if (yearWinCount < yearLossCount) {
        yearClassName += 'losing-record';
      } else {
        yearClassName += 'even-record';
      }

      if (currentYearData.length !== 0) {
        winPercentageData = winPercentageData.concat(currentYearData);

        let record = `${yearWinCount}-${yearLossCount}`;
        if (yearTieCount !== 0) {
          record += `-${yearTieCount}`;
        }

        yearWinPercentageData.push({
          year: Number(year),
          yearWinCount,
          yearTieCount,
          yearLossCount,
          record,
          className: yearClassName,
          radius: 3,
          y: lastGameOfYearWinPercentage,
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

    this.state = {
      data: winPercentageData,
      yearData: yearWinPercentageData,
    };
  }

  setTooltip(tooltip) {
    this.setState({
      tooltip,
    });
  }

  setYearTooltip(yearTooltip) {
    this.setState({
      yearTooltip,
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

    const chartWidth = 1000;
    const chartHeight = 400;
    var domainWidth = chartWidth - margin.left - margin.right;
    var domainHeight = chartHeight - margin.top - margin.bottom;

    const chart = d3.select(this.chartRef).attr('width', chartWidth).attr('height', chartHeight);

    var chartX = d3.scaleLinear().domain([0, this.state.data.length]).range([0, domainWidth]);

    var chartY = d3.scaleLinear().domain([0, 100]).range([domainHeight, 0]);

    var g = chart.append('g').attr('transform', 'translate(' + margin.top + ',' + margin.top + ')');

    g.append('rect')
      .attr('width', chartWidth - margin.left - margin.right)
      .attr('height', chartHeight - margin.top - margin.bottom)
      .attr('fill', '#F6F6F6');

    g.selectAll('circle')
      .data(this.state.data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 2)
      .attr('cx', (d, i) => {
        return chartX(i);
      })
      .attr('cy', (d) => {
        return chartY(d.y);
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
        if (d.result === 'W') {
          return 'green';
        } else if (d.result === 'L') {
          return 'red';
        } else if (d.result === 'T') {
          return 'yellow';
        }
      })
      .on('mouseover', (d, i) => {
        // const tooltipHtml = `<p>${d.year} ${d.opponentId} <br /> ${d.scoreText} <br /> ${d.y}</p>`;

        clearTimeout(this.unsetTooltipTimeout);

        d.realX = chartX(i) + margin.left;
        d.realY = chartY(d.y) + margin.top;

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
      .on('mouseout', () => {
        // tooltip
        //   .transition()
        //   .duration(500)
        //   .style('opacity', 0);
        this.unsetTooltipTimeout = setTimeout(() => this.setTooltip(null), 200);
      });

    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + chartY.range()[0] + ')')
      .call(d3.axisBottom(chartX).ticks(25));

    g.append('g')
      .attr('class', 'y axis')
      // .attr('transform', 'translate(' + chartX.range()[1] / 2 + ', 0)')
      .call(d3.axisLeft(chartY).ticks(11));

    /**************/
    /* YEAR CHART */
    /**************/
    const yearChart = d3
      .select(this.yearChartRef)
      .attr('width', chartWidth)
      .attr('height', chartHeight);

    const startingYear = this.state.yearData[0].year;

    var yearChartX = d3
      .scaleLinear()
      .domain([startingYear, startingYear + this.state.yearData.length])
      .range([0, domainWidth]);

    var yearChartY = d3.scaleLinear().domain([0, 100]).range([domainHeight, 0]);

    var yearG = yearChart
      .append('g')
      .attr('transform', 'translate(' + margin.top + ',' + margin.top + ')');

    yearG
      .append('rect')
      .attr('width', chartWidth - margin.left - margin.right)
      .attr('height', chartHeight - margin.top - margin.bottom)
      .attr('fill', '#F6F6F6');

    yearG
      .selectAll('circle')
      .data(this.state.yearData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 3)
      .attr('cx', (d) => {
        return yearChartX(d.year);
      })
      .attr('cy', (d) => {
        return yearChartY(d.y);
      })
      .style('stroke', (d) => {
        if (d.yearWinCount > d.yearLossCount) {
          return 'green';
        } else if (d.yearWinCount < d.yearLossCount) {
          return 'red';
        } else {
          return 'yellow';
        }
      })
      .style('fill', (d) => {
        if (d.yearWinCount > d.yearLossCount) {
          return 'green';
        } else if (d.yearWinCount < d.yearLossCount) {
          return 'red';
        } else {
          return 'yellow';
        }
      })
      .on('mouseover', (d) => {
        clearTimeout(this.unsetYearTooltipTimeout);

        d.realX = yearChartX(d.year) + margin.left;
        d.realY = yearChartY(d.y) + margin.top;

        this.setYearTooltip(d);

        // tooltip
        //   .transition()
        //   .duration(200)
        //   .style('opacity', .9);
        // tooltip
        //   .html(tooltipHtml)
        //   .style('left', (d3.event.pageX) + 'px')
        //   .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        // tooltip
        //   .transition()
        //   .duration(500)
        //   .style('opacity', 0);
        this.unsetYearTooltipTimeout = setTimeout(() => this.setYearTooltip(null), 200);
      });

    yearG
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + yearChartY.range()[0] + ')')
      .call(d3.axisBottom(yearChartX).ticks(this.state.yearData.length / 10));

    yearG
      .append('g')
      .attr('class', 'y axis')
      // .attr('transform', 'translate(' + yearChartX.range()[1] / 2 + ', 0)')
      .call(d3.axisLeft(yearChartY).ticks(11));
  }

  render() {
    // const {tooltip, yearTooltip} = this.state;

    // let tooltipContent;
    // if (tooltip) {
    //   const tooltipText = `${tooltip.year} ${tooltip.opponentId}, ${tooltip.scoreText}, ${tooltip.winPercentage}`;
    //   // tooltipContent = <Tooltip x={tooltip.realX} y={tooltip.realY} text={tooltipText} />;
    // }

    // let yearTooltipContent;
    // if (yearTooltip) {
    //   const yearTooltipText = `${yearTooltip.year}, ${yearTooltip.record}, ${yearTooltip.winPercentage}`;
    //   yearTooltipContent = (
    //     <Tooltip x={yearTooltip.realX} y={yearTooltip.realY} text={yearTooltipText} />
    //   );
    // }

    return (
      <div>
        <LineChart data={this.state.yearData} />
        <LineChart data={this.state.yearData} domainY={[60, 90]} />

        {/*
        <div>
          <svg ref={(r) => this.chartRef = r}></svg>
          {tooltipContent}
        </div>

        <div>
          <svg ref={(r) => this.yearChartRef = r}></svg>
          {yearTooltipContent}
        </div>
      */}
      </div>
    );
  }
}
