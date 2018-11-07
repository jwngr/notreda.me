import _ from 'lodash';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Tooltip from '../Tooltip';

import './index.css';
import {LineChartWrapper, LineChartSvg} from './index.styles';

const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_TICKS_COUNT_X = 10;
const DEFAULT_TICKS_COUNT_Y = 10;
const DEFAULT_DATUM_CIRCLE_SIZE = 3;
const DEFAULT_MARGINS = {top: 40, right: 20, bottom: 60, left: 80};
const DEFAULT_MARGINS_SMALL = {top: 20, right: 10, bottom: 50, left: 60};
const LINE_CHART_BORDER_WIDTH = 6;

class LineChart extends Component {
  state = {
    tooltip: null,
  };

  constructor(props) {
    super(props);

    this.lineChart = null;

    this.debouncedRedrawChartData = _.debounce(this.redrawChartData.bind(this), 150);
    this.debouncedResizeLineChart = _.debounce(this.resizeLineChart.bind(this), 350);
  }

  setTooltip(tooltip) {
    this.setState({
      tooltip,
    });
  }

  handleMouseMove = (event) => {
    this.mouse = {
      x: event.pageX,
      y: event.pageY,
    };
  };

  getMargins = () => {
    let margins = {...DEFAULT_MARGINS, ...this.props.margins};
    if (this.width < 600) {
      margins = {...DEFAULT_MARGINS_SMALL, ..._.get(this.props.margins, 'sm')};
    }

    return margins;
  };

  drawChartAxes = () => {
    let {
      xAxisLabel,
      yAxisLabel,
      formatXAxisTickLabels = (x) => x,
      formatYAxisTickLabels = (x) => x,
      xAxisTicksCount = DEFAULT_TICKS_COUNT_X,
      yAxisTicksCount = DEFAULT_TICKS_COUNT_Y,
    } = this.props;

    let margins = this.getMargins();

    // // X-axis
    // this.lineChart
    //   .append('g')
    //   .attr('class', 'line-chart-x-axis')
    //   .attr('transform', 'translate(0,' + this.scaleY.range()[0] + ')')
    //   .call(d3.axisBottom(this.scaleX).ticks(xAxisTicksCount));

    // // Y-axis
    // this.lineChart
    //   .append('g')
    //   .attr('class', 'line-chart-y-axis')
    //   // .attr('transform', 'translate(' + this.scaleX.range()[1] / 2 + ', 0)')
    //   .call(d3.axisLeft(this.scaleY).ticks(yAxisTicksCount));

    // X-axis
    this.lineChart
      .append('g')
      .attr('class', 'line-chart-x-axis')
      .attr('transform', `translate(${margins.left}, ${DEFAULT_CHART_HEIGHT + margins.top})`)
      .call(
        d3
          .axisBottom(this.scaleX)
          .ticks(xAxisTicksCount)
          .tickFormat((i) => formatXAxisTickLabels(i))
      );

    // Y-axis
    this.lineChart
      .append('g')
      .attr('class', 'line-chart-y-axis')
      .call(
        d3
          .axisLeft(this.scaleY)
          .ticks(yAxisTicksCount)
          .tickFormat((i) => formatYAxisTickLabels(i))
      )
      .attr('transform', `translate(${margins.left}, ${margins.top})`);

    // X-axis label
    this.lineChart
      .append('text')
      .attr('class', 'line-chart-x-axis-label')
      .attr(
        'transform',
        `translate(${margins.left +
          (this.width - margins.left - margins.right) / 2}, ${DEFAULT_CHART_HEIGHT +
          margins.top +
          margins.bottom -
          10})`
      )
      .text(xAxisLabel);

    // Y-axis label
    this.lineChart
      .append('text')
      .attr('class', 'line-chart-y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (DEFAULT_CHART_HEIGHT + margins.left) / 2)
      .attr('y', this.width < 600 ? 20 : 26)
      .text(yAxisLabel);
  };

  redrawChartData = () => {
    this.lineChart.selectAll('.line-chart-data').remove();
    this.drawChartData();
  };

  drawChartData = () => {
    let {
      seriesData,
      showLine = true,
      showArea = true,
      showLineLabels = true,
      showDataPoints = true,
    } = this.props;

    const margins = this.getMargins();

    // Scales
    const dataPoints = [];
    _.forEach(seriesData, (s, i) => {
      _.forEach(s.values, (d) => {
        d.seriesIndex = i;
        d.seriesId = s.id;
        dataPoints.push(d);
      });
    });

    const gData = this.lineChart
      .append('g')
      .attr('class', 'line-chart-data')
      .attr('transform', () => `translate(${margins.left}, ${margins.top})`);

    // Add the area under the line.
    if (showArea) {
      var area = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x((d) => this.scaleX(d.x))
        .y0(this.scaleY(0))
        .y1((d) => this.scaleY(d.y));

      gData
        .append('path')
        .data([dataPoints])
        .attr('class', 'line-area')
        .attr('d', area);
    }

    // Chart lines
    var line = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((d) => this.scaleX(d.x))
      .y((d) => this.scaleY(d.y));

    if (showLine) {
      const showLineIds = showLineLabels && _.size(seriesData) !== 1;

      const teams = gData
        .selectAll('.team')
        .data(seriesData)
        .enter()
        .append('g')
        .attr('class', 'team');

      teams
        .append('path')
        .attr('class', 'line')
        .attr('d', (d) => {
          return line(d.values);
        })
        .attr('class', (d, i) => {
          const classNames = ['line', `series-${i}`];
          if (typeof d.className === 'string') {
            classNames.push(d.className);
          }
          if (typeof d.id !== 'undefined') {
            classNames.push(`series-${d.id}`);
          }

          return classNames.join(' ');
        });

      teams
        .append('text')
        .datum((d, i) => {
          return {id: d.id || i, value: d.values[d.values.length - 1]};
        })
        .attr('transform', (d) => {
          return 'translate(' + this.scaleX(d.value.x) + ',' + this.scaleY(d.value.y) + ')';
        })
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font', '10px sans-serif')
        .text((d) => (showLineIds ? d.id : ''));
    }

    // Chart data points
    if (showDataPoints) {
      gData
        .selectAll('circle')
        .data(dataPoints)
        .enter()
        .append('circle')
        .attr('r', (d) => d.radius || DEFAULT_DATUM_CIRCLE_SIZE)
        .attr('cx', (d, i) => this.scaleX(d.x || i))
        .attr('cy', (d) => this.scaleY(d.y))
        .attr('class', (d, i) => {
          const classNames = ['dot'];
          if (typeof d.className === 'string') {
            classNames.push(d.className);
          }
          if (typeof d.seriesIndex === 'number') {
            classNames.push(`series-${d.seriesIndex}`);
          }
          if (typeof d.seriesId !== 'undefined') {
            classNames.push(`series-${d.seriesId}`);
          }

          return classNames.join(' ');
        })
        .on('mouseover', (d, i) => {
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
        .on('mouseout', (d) => {
          this.unsetTooltipTimeout = setTimeout(() => this.setTooltip(null), 200);
        });
    }
  };

  componentDidMount() {
    let {seriesData, domainX, rangeX, domainY, rangeY} = this.props;

    document.addEventListener('mousemove', this.handleMouseMove);

    this.width = this.getLineChartWidth();

    let margins = this.getMargins();

    // Scales
    const dataPoints = [];
    _.forEach(seriesData, (s, i) => {
      _.forEach(s.values, (d) => {
        d.seriesIndex = i;
        d.seriesId = s.id;
        dataPoints.push(d);
      });
    });

    if (!domainX) {
      domainX = d3.extent(dataPoints, (d) => d.x);
    }

    if (!domainY) {
      domainY = d3.extent(dataPoints, (d) => d.y);
    }

    this.scaleX = d3
      .scaleLinear()
      .domain(domainX)
      .range(rangeX || [0, this.width - margins.left - margins.right]);

    this.scaleY = d3
      .scaleLinear()
      .domain(domainY)
      .range(rangeY || [DEFAULT_CHART_HEIGHT, 0]);

    // Line chart
    this.lineChart = d3
      .select(this.lineChartRef)
      .attr('width', this.width)
      .attr('height', DEFAULT_CHART_HEIGHT + margins.top + margins.bottom);

    this.drawChartAxes();
    this.drawChartData();

    // Resize the line chart on page resize.
    window.addEventListener('resize', this.debouncedResizeLineChart);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.seriesData, prevProps.seriesData)) {
      this.debouncedRedrawChartData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResizeLineChart);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  getLineChartWidth() {
    // Return width of wrapper element, minus border.
    return (
      document.querySelector('.line-chart-wrapper').getBoundingClientRect().width -
      LINE_CHART_BORDER_WIDTH
    );
  }

  resizeLineChart() {
    // TODO: redraw chart when width changes.
    this.width = this.getLineChartWidth();
    this.lineChart.attr('width', this.width);
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
      <React.Fragment>
        {tooltipContent}
        <LineChartWrapper className="line-chart-wrapper">
          <LineChartSvg innerRef={(r) => (this.lineChartRef = r)} />
          {this.props.children}
        </LineChartWrapper>
      </React.Fragment>
    );
  }
}

// TODO: add prop types
LineChart.propTypes = {
  showArea: PropTypes.bool,
  showLineLabels: PropTypes.bool,
  seriesData: PropTypes.array.isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  xAxisTicksCount: PropTypes.number,
  yAxisTicksCount: PropTypes.number,
  formatXAxisTickLabels: PropTypes.func,
  formatYAxisTickLabels: PropTypes.func,
};

export default LineChart;
