import _ from 'lodash';
import * as d3 from 'd3';
import {findDOMNode} from 'react-dom';
import React, {Component} from 'react';

import Tooltip from './Tooltip';

import './LineChart.css';

const DEFAULT_MARGINS = {top: 50, right: 50, bottom: 50, left: 50};
const DEFAULT_CHART_WIDTH = 1000;
const DEFAULT_CHART_HEIGHT = 400;
const DEFAULT_TICKS_COUNT_X = 10;
const DEFAULT_TICKS_COUNT_Y = 10;
const DEFAULT_DATUM_CIRCLE_SIZE = 3;

class LineChart extends Component {
  state = {
    tooltip: null,
  };

  setTooltip(tooltip) {
    this.setState({
      tooltip,
    });
  }

  componentDidMount() {
    let {
      seriesData,
      width = DEFAULT_CHART_WIDTH,
      height = DEFAULT_CHART_HEIGHT,
      margins = DEFAULT_MARGINS,
      domainX,
      rangeX,
      domainY,
      rangeY,
      ticksCountX = DEFAULT_TICKS_COUNT_X,
      ticksCountY = DEFAULT_TICKS_COUNT_Y,
      showDataPoints = true,
    } = this.props;

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
      .scaleTime()
      .domain(domainX)
      .range(rangeX || [0, domainWidth]);

    var scaleY = d3
      .scaleLinear()
      .domain(domainY)
      .range(rangeY || [domainHeight, 0]);

    // Chart
    const chart = d3
      .select(this.chartRef)
      .attr('width', width)
      .attr('height', height);

    var g = chart
      .append('g')
      .attr('transform', 'translate(' + margins.top + ',' + margins.top + ')');

    // Chart background
    g
      .append('rect')
      .attr('width', width - margins.left - margins.right)
      .attr('height', height - margins.top - margins.bottom)
      .attr('class', 'chart-background');

    // Chart lines
    var line = d3
      .line()
      // .curve(d3.curveStepAfter)
      .curve(d3.curveCatmullRom.alpha(0.5))
      // .curve(d3.curveMonotoneX)
      .x(function(d) {
        return scaleX(d.x);
      })
      .y(function(d) {
        return scaleY(d.y);
      });

    var teams = g
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

    // Chart data points
    if (showDataPoints) {
      g
        .selectAll('circle')
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

          // TODO: fix tooltip positioning
          const domNode = findDOMNode(this.chartRef);
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

    // Axes
    g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + scaleY.range()[0] + ')')
      .call(d3.axisBottom(scaleX).ticks(ticksCountX));

    g
      .append('g')
      .attr('class', 'y axis')
      // .attr('transform', 'translate(' + scaleX.range()[1] / 2 + ', 0)')
      .call(d3.axisLeft(scaleY).ticks(ticksCountY));
  }

  render() {
    const {tooltip} = this.state;

    let tooltipContent;
    if (tooltip !== null) {
      const tooltipText = `${tooltip.year} ${tooltip.opponentId}, ${tooltip.scoreText}, ${
        tooltip.winPercentage
      }`;
      tooltipContent = (
        <Tooltip x={tooltip.x} y={tooltip.y}>
          {tooltip.children}
        </Tooltip>
      );
    }

    return (
      <div>
        <div>
          <svg className="chart" ref={(r) => (this.chartRef = r)} />
          {tooltipContent}
        </div>
      </div>
    );
  }
}

// TODO: add prop types
LineChart.propTypes = {};

export default LineChart;
