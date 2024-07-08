import * as d3 from 'd3';
import debounce from 'lodash/debounce';
import last from 'lodash/last';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Tooltip} from '../Tooltip';
import {PerSeasonBarChartSvg, PerSeasonBarChartWrapper} from './index.styles';

const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_MARGINS = {top: 40, right: 20, bottom: 60, left: 80};
const DEFAULT_MARGINS_SMALL = {top: 20, right: 10, bottom: 50, left: 60};
const BAR_CHART_BORDER_WIDTH = 6;

export class PerSeasonBarChart extends Component {
  state = {
    tooltip: null,
  };

  constructor(props) {
    super(props);

    this.barChart = null;

    this.debouncedResizeBarChart = debounce(this.resizeBarChart.bind(this), 350);
  }

  setTooltip = (tooltip) => {
    this.setState({
      tooltip,
    });
  };

  handleMouseMove = (event) => {
    this.mouse = {
      x: event.pageX,
      y: event.pageY,
    };
  };

  componentDidMount() {
    const {
      data,
      yMax,
      xAxisLabel,
      yAxisLabel,
      yAxisTicksCount,
      formatCount = d3.format(',.0f'),
    } = this.props;

    document.addEventListener('mousemove', this.handleMouseMove);

    const width = this.getBarChartWidth();
    let margins = {...DEFAULT_MARGINS, ...this.props.margins};
    if (width < 600) {
      margins = {...DEFAULT_MARGINS_SMALL, ...this.props.margins.sm};
    }

    this.barChart = d3
      .select(this.perSeasonBarChartRef)
      .attr('width', width)
      .attr('height', DEFAULT_CHART_HEIGHT + margins.top + margins.bottom);

    // set the ranges
    const xScale = d3
      .scaleTime()
      .domain([new Date(data[0].season, 0, 1), new Date(last(data).season, 0, 1)])
      .range([0, width - margins.left - margins.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax || d3.max(data.map(({value}) => value))])
      .range([DEFAULT_CHART_HEIGHT, 0]);

    const bars = this.barChart
      .selectAll('.per-season-bar-chart-bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'per-season-bar-chart-bar')
      .attr('transform', () => `translate(${margins.left}, ${margins.top})`);

    // append the rectangles for the bar chart
    bars
      .append('rect')
      .attr('x', (d) => xScale(new Date(d.season, 0, 1)))
      .attr('width', width / data.length)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => DEFAULT_CHART_HEIGHT - yScale(d.value))
      .on('mouseover', (d) => {
        clearTimeout(this.unsetTooltipTimeout);

        if (this.mouse) {
          // It is possible for the mouse to initially be on a spot which should show a tooltip,
          // so simply ignore that case.
          this.setTooltip({
            x: this.mouse.x,
            y: this.mouse.y,
            children: d.tooltipChildren,
          });
        }
      })
      .on('mouseout', () => {
        this.unsetTooltipTimeout = setTimeout(() => this.setTooltip(null), 200);
      });

    // add the x-axis
    let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
    this.barChart
      .append('g')
      .attr('class', 'per-season-bar-chart-x-axis')
      .attr('transform', `translate(${margins.left}, ${DEFAULT_CHART_HEIGHT + margins.top})`)
      .call(xAxis);

    // add the y-axis
    let yAxis = d3.axisLeft(yScale).tickFormat((d) => formatCount(d));
    if (typeof yAxisTicksCount !== 'undefined') {
      yAxis = yAxis.ticks(yAxisTicksCount);
    }
    this.barChart
      .append('g')
      .attr('class', 'per-season-bar-chart-y-axis')
      .call(yAxis)
      .attr('transform', `translate(${margins.left}, ${margins.top})`);

    // X-axis label
    this.barChart
      .append('text')
      .attr('class', 'per-season-bar-chart-x-axis-label')
      .attr(
        'transform',
        `translate(${margins.left + (width - margins.left - margins.right) / 2}, ${
          DEFAULT_CHART_HEIGHT + margins.top + margins.bottom - 10
        })`
      )
      .text(xAxisLabel);

    // Y-axis label
    this.barChart
      .append('text')
      .attr('class', 'per-season-bar-chart-y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (DEFAULT_CHART_HEIGHT + margins.left) / 2)
      .attr('y', width < 600 ? 20 : 26)
      .text(yAxisLabel);

    // Resize the bar chart on page resize.
    window.addEventListener('resize', this.debouncedResizeBarChart);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResizeBarChart);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  getBarChartWidth() {
    // Return width of wrapper element, minus border.
    return (
      document.querySelector('.bar-chart-wrapper').getBoundingClientRect().width -
      BAR_CHART_BORDER_WIDTH
    );
  }

  resizeBarChart() {
    this.barChart.attr('width', this.getBarChartWidth());
  }

  render() {
    const {tooltip} = this.state;

    let tooltipContent;
    if (tooltip !== null) {
      tooltipContent = (
        <Tooltip x={tooltip.x} y={tooltip.y}>
          {tooltip.children}
        </Tooltip>
      );
    }

    return (
      <>
        {tooltipContent}
        <PerSeasonBarChartWrapper className="bar-chart-wrapper">
          <PerSeasonBarChartSvg ref={(r) => (this.perSeasonBarChartRef = r)} />
        </PerSeasonBarChartWrapper>
      </>
    );
  }
}

PerSeasonBarChart.propTypes = {
  data: PropTypes.array.isRequired,
  yMax: PropTypes.number,
  formatCount: PropTypes.func,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  yAxisTicksCount: PropTypes.number,
};
