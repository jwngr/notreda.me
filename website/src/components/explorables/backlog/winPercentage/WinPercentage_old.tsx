import * as d3 from 'd3';
import React, {Component} from 'react';

import {LineChart, LineChartSeries} from '../../../charts/LineChart';
// import {Tooltip} from '../charts/Tooltip';

import './WinPercentage.css';

import {Schedules} from '../../../../lib/schedules';
import {GameInfo} from '../../../../models/games.models';

interface WinPercentageOldDatum {
  year: number;
  result: string;
  scoreText: string;
  opponentId: string;
  isHomeGame: boolean;
  y: number;
}

interface WinPercentageOldYearDatum {
  year: number;
  yearWinCount: number;
  yearTieCount: number;
  yearLossCount: number;
  record: string;
  className: string;
  radius: number;
  y: number;
  tooltipChildren: React.ReactNode;
}

interface WinPercentageOldState {
  readonly data: WinPercentageOldDatum[];
  readonly yearData: WinPercentageOldYearDatum[];
  readonly tooltip?: WinPercentageOldDatum | null;
  readonly yearTooltip?: WinPercentageOldYearDatum | null;
}

export class WinPercentage extends Component<Record<string, never>, WinPercentageOldState> {
  private chartRef: SVGSVGElement | null = null;
  private yearChartRef: SVGSVGElement | null = null;
  private unsetTooltipTimeout: number | null = null;
  private unsetYearTooltipTimeout: number | null = null;

  constructor(props: Record<string, never>) {
    super(props);

    let winCount = 0;
    // let tieCount = 0;
    let lossCount = 0;

    let winPercentageData: WinPercentageOldDatum[] = [];
    const yearWinPercentageData: WinPercentageOldYearDatum[] = [];

    Schedules.getSeasons().forEach(async (year: number) => {
      const yearData = await Schedules.getForSeason(year);

      let yearWinCount = 0;
      let yearLossCount = 0;
      let yearTieCount = 0;
      let lastGameOfYearWinPercentage = 0;

      const currentYearData: (WinPercentageOldDatum | undefined)[] = yearData.map(
        ({score, opponentId, result, isHomeGame}: GameInfo) => {
          let scoreText;

          // Exclude future games
          if (result && score) {
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
          return undefined;
        }
      );

      // Remove undefined values from array
      const filteredYearData = currentYearData.filter((d): d is WinPercentageOldDatum =>
        Boolean(d)
      );

      let yearClassName = '';
      if (yearWinCount > yearLossCount) {
        yearClassName += 'winning-record';
      } else if (yearWinCount < yearLossCount) {
        yearClassName += 'losing-record';
      } else {
        yearClassName += 'even-record';
      }

      if (filteredYearData.length !== 0) {
        winPercentageData = winPercentageData.concat(filteredYearData);

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

    this.state = {data: winPercentageData, yearData: yearWinPercentageData};
  }

  setTooltip(tooltip: WinPercentageOldDatum | null) {
    this.setState({tooltip});
  }

  setYearTooltip(yearTooltip: WinPercentageOldYearDatum | null) {
    this.setState({yearTooltip});
  }

  getMinValueForKey(data: readonly WinPercentageOldDatum[], key: 'y') {
    return data.reduce((min, p) => (p[key] < min ? p[key] : min), data[0][key]);
  }

  getMaxValueForKey(data: readonly WinPercentageOldDatum[], key: 'y') {
    return data.reduce((max, p) => (p[key] > max ? p[key] : max), data[0][key]);
  }

  componentDidMount() {
    const margin = {top: 50, right: 50, bottom: 50, left: 50};

    const chartWidth = 1000;
    const chartHeight = 400;
    const domainWidth = chartWidth - margin.left - margin.right;
    const domainHeight = chartHeight - margin.top - margin.bottom;

    if (!this.chartRef || !this.yearChartRef) {
      return;
    }

    const chart = d3.select(this.chartRef).attr('width', chartWidth).attr('height', chartHeight);

    const chartX = d3.scaleLinear().domain([0, this.state.data.length]).range([0, domainWidth]);

    const chartY = d3.scaleLinear().domain([0, 100]).range([domainHeight, 0]);

    const g = chart
      .append('g')
      .attr('transform', 'translate(' + margin.top + ',' + margin.top + ')');

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
      .attr('cx', (_d, i) => {
        return chartX(i);
      })
      .attr('cy', (d: WinPercentageOldDatum) => {
        return chartY(d.y);
      })
      .style('stroke', (d: WinPercentageOldDatum) => {
        if (d.result === 'W') {
          return 'green';
        } else if (d.result === 'L') {
          return 'red';
        } else if (d.result === 'T') {
          return 'yellow';
        }
        return 'gray';
      })
      .style('fill', (d: WinPercentageOldDatum) => {
        if (d.result === 'W') {
          return 'green';
        } else if (d.result === 'L') {
          return 'red';
        } else if (d.result === 'T') {
          return 'yellow';
        }
        return 'gray';
      })
      .on('mouseover', (_event, d: WinPercentageOldDatum) => {
        // const tooltipHtml = `<p>${d.year} ${d.opponentId} <br /> ${d.scoreText} <br /> ${d.y}</p>`;

        if (this.unsetTooltipTimeout !== null) {
          window.clearTimeout(this.unsetTooltipTimeout);
        }

        const index = this.state.data.indexOf(d);
        (d as WinPercentageOldDatum & {realX: number; realY: number}).realX =
          chartX(index) + margin.left;
        (d as WinPercentageOldDatum & {realX: number; realY: number}).realY =
          chartY(d.y) + margin.top;

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
        this.unsetTooltipTimeout = window.setTimeout(() => this.setTooltip(null), 200);
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
    if (this.state.yearData.length === 0) {
      return;
    }

    const yearChart = d3
      .select(this.yearChartRef)
      .attr('width', chartWidth)
      .attr('height', chartHeight);

    const startingYear = this.state.yearData[0].year;

    const yearChartX = d3
      .scaleLinear()
      .domain([startingYear, startingYear + this.state.yearData.length])
      .range([0, domainWidth]);

    const yearChartY = d3.scaleLinear().domain([0, 100]).range([domainHeight, 0]);

    const yearG = yearChart
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
      .attr('cx', (d: WinPercentageOldYearDatum) => {
        return yearChartX(d.year);
      })
      .attr('cy', (d: WinPercentageOldYearDatum) => {
        return yearChartY(d.y);
      })
      .style('stroke', (d: WinPercentageOldYearDatum) => {
        if (d.yearWinCount > d.yearLossCount) {
          return 'green';
        } else if (d.yearWinCount < d.yearLossCount) {
          return 'red';
        } else {
          return 'yellow';
        }
      })
      .style('fill', (d: WinPercentageOldYearDatum) => {
        if (d.yearWinCount > d.yearLossCount) {
          return 'green';
        } else if (d.yearWinCount < d.yearLossCount) {
          return 'red';
        } else {
          return 'yellow';
        }
      })
      .on('mouseover', (_event, d: WinPercentageOldYearDatum) => {
        if (this.unsetYearTooltipTimeout !== null) {
          window.clearTimeout(this.unsetYearTooltipTimeout);
        }

        (d as WinPercentageOldYearDatum & {realX: number; realY: number}).realX =
          yearChartX(d.year) + margin.left;
        (d as WinPercentageOldYearDatum & {realX: number; realY: number}).realY =
          yearChartY(d.y) + margin.top;

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
        this.unsetYearTooltipTimeout = window.setTimeout(() => this.setYearTooltip(null), 200);
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
    const yearSeries: LineChartSeries[] = [
      {
        id: 'ND',
        values: this.state.yearData.map((datum) => ({
          x: datum.year,
          y: datum.y,
          radius: datum.radius,
          className: datum.className,
          tooltipChildren: datum.tooltipChildren,
        })),
      },
    ];

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
        <LineChart
          seriesData={yearSeries}
          xAxisLabel="Year"
          yAxisLabel="Win Percentage"
          domainY={[0, 100]}
          showLine={false}
        />
        <LineChart
          seriesData={yearSeries}
          xAxisLabel="Year"
          yAxisLabel="Win Percentage"
          domainY={[60, 90]}
          showLine={false}
        />

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
