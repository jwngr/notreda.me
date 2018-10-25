import _ from 'lodash';
import * as d3 from 'd3';
import {findDOMNode} from 'react-dom';
import React, {Component} from 'react';

import Tooltip from '../Tooltip';

import './index.css';
import {LineChartWrapper, LineChartSvg} from './index.styles';

const DEFAULT_MARGINS = {top: 50, right: 50, bottom: 50, left: 50};
const DEFAULT_CHART_HEIGHT = 400;
const DEFAULT_TICKS_COUNT_X = 10;
const DEFAULT_TICKS_COUNT_Y = 10;
const DEFAULT_DATUM_CIRCLE_SIZE = 3;
const LINE_CHART_BORDER_WIDTH = 6;

class LineChart extends Component {
  state = {
    tooltip: null,
  };

  constructor() {
    super();

    this.lineChart = null;

    this.debouncedResizeLineChart = _.debounce(this.resizeLineChart.bind(this), 350);
  }

  setTooltip(tooltip) {
    this.setState({
      tooltip,
    });
  }

  componentDidMount() {
    let {
      seriesData,
      height = DEFAULT_CHART_HEIGHT,
      margins = DEFAULT_MARGINS,
      domainX,
      rangeX,
      domainY,
      rangeY,
      ticksCountX = DEFAULT_TICKS_COUNT_X,
      ticksCountY = DEFAULT_TICKS_COUNT_Y,
      showLine = true,
      showDataPoints = true,
    } = this.props;

    const width = this.getLineChartWidth();

    var domainWidth = width - margins.left - margins.right;
    var domainHeight = height - margins.top - margins.bottom;

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

    var scaleX = d3
      .scaleLinear()
      .domain(domainX)
      .range(rangeX || [0, domainWidth]);

    var scaleY = d3
      .scaleLinear()
      .domain(domainY)
      .range(rangeY || [domainHeight, 0]);

    // Line chart
    this.lineChart = d3
      .select(this.lineChartRef)
      .attr('width', width)
      .attr('height', height);

    var g = this.lineChart
      .append('g')
      .attr('transform', 'translate(' + margins.top + ',' + margins.top + ')');

    // Chart background
    g.append('rect')
      .attr('width', width - margins.left - margins.right)
      .attr('height', height - margins.top - margins.bottom)
      .attr('class', 'chart-background');

    // Axes
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + scaleY.range()[0] + ')')
      .call(d3.axisBottom(scaleX).ticks(ticksCountX));

    g.append('g')
      .attr('class', 'y axis')
      // .attr('transform', 'translate(' + scaleX.range()[1] / 2 + ', 0)')
      .call(d3.axisLeft(scaleY).ticks(ticksCountY));

    // Add the area under the line.
    var area = d3
      .area()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => scaleX(d.x))
      .y0(scaleY(0))
      .y1((d) => scaleY(d.y));

    g.append('path')
      .data([dataPoints])
      .attr('class', 'area')
      .attr('d', area);

    // Chart lines
    var line = d3
      .line()
      // .curve(d3.curveStepAfter)
      .curve(d3.curveCatmullRom.alpha(0.5))
      // .curve(d3.curveMonotoneX)
      .x((d) => scaleX(d.x))
      .y((d) => scaleY(d.y));

    if (showLine) {
      const teams = g
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
          return 'translate(' + scaleX(d.value.x) + ',' + scaleY(d.value.y) + ')';
        })
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font', '10px sans-serif')
        .text((d) => d.id);
    }

    // Chart data points
    if (showDataPoints) {
      g.selectAll('circle')
        .data(dataPoints)
        .enter()
        .append('circle')
        .attr('r', (d) => d.radius || DEFAULT_DATUM_CIRCLE_SIZE)
        .attr('cx', (d, i) => scaleX(d.x || i))
        .attr('cy', (d) => scaleY(d.y))
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

          const domNode = findDOMNode(this.lineChartRef);
          const boundingRect = domNode.getBoundingClientRect();

          this.setTooltip({
            x: scaleX(d.x || i) + window.pageXOffset + boundingRect.left + margins.left,
            y: scaleY(d.y) + window.pageYOffset + boundingRect.top + margins.top,
            children: d.tooltipChildren,
          });
        })
        .on('mouseout', (d) => {
          this.unsetTooltipTimeout = setTimeout(() => this.setTooltip(null), 200);
        });
    }

    // Resize the line chart on page resize.
    window.addEventListener('resize', this.debouncedResizeLineChart);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResizeLineChart);
  }

  getLineChartWidth() {
    // Return width of wrapper element, minus border.
    return (
      document.querySelector('.line-chart-wrapper').getBoundingClientRect().width -
      LINE_CHART_BORDER_WIDTH
    );
  }

  resizeLineChart() {
    this.lineChart.attr('width', this.getLineChartWidth());
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
      <LineChartWrapper className="line-chart-wrapper">
        <LineChartSvg innerRef={(r) => (this.lineChartRef = r)} />
        {tooltipContent}
      </LineChartWrapper>
    );
  }
}

// TODO: add prop types
LineChart.propTypes = {};

export default LineChart;
