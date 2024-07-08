import * as d3 from 'd3';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {BarChartSvg, BarChartWrapper} from './index.styles';

const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_MARGINS = {top: 40, right: 20, bottom: 60, left: 80};
const DEFAULT_MARGINS_SMALL = {top: 20, right: 10, bottom: 50, left: 60};
const BAR_CHART_BORDER_WIDTH = 6;

export class BarChart extends Component {
  constructor(props) {
    super(props);

    this.barChart = null;

    this.debouncedResizeBarChart = debounce(this.resizeBarChart.bind(this), 350);
  }

  componentDidMount() {
    const {
      data,
      yMax,
      xAxisLabel,
      yAxisLabel,
      yAxisTicksCount,
      showCounts = true,
      formatCount = d3.format(',.0f'),
      xAxisTickLabels,
    } = this.props;

    const width = this.getBarChartWidth();
    let margins = {...DEFAULT_MARGINS, ...this.props.margins};
    if (width < 600) {
      margins = {...DEFAULT_MARGINS_SMALL, ...this.props.margins.sm};
    }

    this.barChart = d3
      .select(this.barChartRef)
      .attr('width', width)
      .attr('height', DEFAULT_CHART_HEIGHT + margins.top + margins.bottom);

    // set the ranges
    const xScale = d3
      .scaleBand()
      .domain(d3.range(0, data.length))
      .range([0, width - margins.left - margins.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax || d3.max(data)])
      .range([DEFAULT_CHART_HEIGHT, 0]);

    const bars = this.barChart
      .selectAll('.bar-chart-bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-chart-bar')
      .attr('transform', () => `translate(${margins.left}, ${margins.top})`);

    // append the rectangles for the bar chart
    bars
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('width', xScale.bandwidth())
      .attr('y', (d) => yScale(d))
      .attr('height', (d) => DEFAULT_CHART_HEIGHT - yScale(d));

    // add the x-axis
    let xAxis = d3.axisBottom(xScale).tickFormat((i) => xAxisTickLabels[i] ?? i);
    this.barChart
      .append('g')
      .attr('class', 'bar-chart-x-axis')
      .attr('transform', `translate(${margins.left}, ${DEFAULT_CHART_HEIGHT + margins.top})`)
      .call(xAxis);

    // add the y-axis
    let yAxis = d3.axisLeft(yScale).tickFormat((d) => formatCount(d));
    if (typeof yAxisTicksCount !== 'undefined') {
      yAxis = yAxis.ticks(yAxisTicksCount);
    }
    this.barChart
      .append('g')
      .attr('class', 'bar-chart-y-axis')
      .call(yAxis)
      .attr('transform', `translate(${margins.left}, ${margins.top})`);

    // Bar height counts
    if (showCounts) {
      bars
        .append('text')
        .attr('class', 'bar-chart-height-counts')
        .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(d) - 4)
        .text((d) => formatCount(d));
    }

    // X-axis label
    this.barChart
      .append('text')
      .attr('class', 'bar-chart-x-axis-label')
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
      .attr('class', 'bar-chart-y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (DEFAULT_CHART_HEIGHT + margins.left) / 2)
      .attr('y', width < 600 ? 20 : 26)
      .text(yAxisLabel);

    // Resize the bar chart on page resize.
    window.addEventListener('resize', this.debouncedResizeBarChart);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResizeBarChart);
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
    return (
      <BarChartWrapper className="bar-chart-wrapper">
        <BarChartSvg ref={(r) => (this.barChartRef = r)} />
      </BarChartWrapper>
    );
  }
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  yMax: PropTypes.number,
  showCounts: PropTypes.bool,
  formatCount: PropTypes.func,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  xAxisTickLabels: PropTypes.array,
  yAxisTicksCount: PropTypes.number,
};
