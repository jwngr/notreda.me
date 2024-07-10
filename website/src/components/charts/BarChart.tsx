import * as d3 from 'd3';
import debounce from 'lodash/debounce';
import {darken} from 'polished';
import React, {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';

import backgroundImage from '../../images/background.png';

const DEFAULT_FORMATTER: (d: number) => string = d3.format(',.0f');
const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_MARGINS = {top: 40, right: 20, bottom: 60, left: 80};
const DEFAULT_MARGINS_SMALL = {top: 20, right: 10, bottom: 50, left: 60};

const BarChartWrapper = styled.div`
  margin: 20px auto 8px auto;
  overflow: hidden;
  font-family: 'Inter UI', serif;
  background-image: url(${backgroundImage});
  background-color: ${({theme}) => theme.colors.lightGray}40;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
`;

const BarChartSvg = styled.svg`
  text {
    fill: ${({theme}) => darken(0.2, theme.colors.green)};
  }

  .bar-chart-bar {
    rect {
      fill: ${({theme}) => theme.colors.green};
      stroke: ${({theme}) => darken(0.2, theme.colors.green)};
      stroke-width: 2px;
    }

    text {
      font-size: 14px;
      text-anchor: middle;
      fill: ${({theme}) => darken(0.2, theme.colors.green)};

      @media (max-width: 600px) {
        font-size: 10px;
      }
    }
  }

  .bar-chart-x-axis,
  .bar-chart-y-axis {
    font-size: 14px;

    path,
    line {
      stroke: ${({theme}) => darken(0.2, theme.colors.green)};
    }

    @media (max-width: 600px) {
      font-size: 10px;
    }
  }

  .bar-chart-x-axis-label,
  .bar-chart-y-axis-label {
    font-size: 16px;
    text-anchor: middle;
    font-variant: small-caps;

    @media (max-width: 600px) {
      font-size: 14px;
    }
  }
`;

export const BarChart: React.FC<{
  readonly data: readonly number[];
  readonly xAxisLabel: string;
  readonly yAxisLabel: string;
  readonly xAxisTickLabels: string[];
  readonly yAxisTicksCount?: number;
  readonly yMax?: number;
  readonly showCounts?: boolean;
  readonly formatCount?: (d: number) => string;
  // TODO: Simplify how margins are handled. Consider moving responsibility to the parent.
  readonly margins?: {
    readonly top?: number;
    readonly right?: number;
    readonly bottom?: number;
    readonly left?: number;
    readonly sm?: {
      readonly top?: number;
      readonly right?: number;
      readonly bottom?: number;
      readonly left?: number;
    };
  };
}> = ({
  data,
  yMax,
  xAxisLabel,
  yAxisLabel,
  yAxisTicksCount,
  showCounts = true,
  formatCount = DEFAULT_FORMATTER,
  xAxisTickLabels,
  margins: marginsProp,
}) => {
  const barChartRef = useRef<SVGSVGElement>(null);
  const barChartWrapperRef = useRef<HTMLDivElement>(null);
  const barChartSvgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);

  const getBarChartWidth = useCallback(() => {
    if (!barChartWrapperRef.current) return 0;
    // Return width of wrapper element, minus border.
    return barChartWrapperRef.current.getBoundingClientRect().width - 6;
  }, []);

  const resizeBarChart = useCallback(() => {
    if (!barChartSvgRef.current) return;
    barChartSvgRef.current.attr('width', getBarChartWidth());
  }, [getBarChartWidth]);

  useEffect(() => {
    if (!barChartRef.current) return;

    // Use smaller margins on mobile.
    const width = getBarChartWidth();
    let margins = {...DEFAULT_MARGINS, ...(marginsProp ?? {})};
    if (width < 600) {
      margins = {...DEFAULT_MARGINS_SMALL, ...(marginsProp?.sm ?? {})};
    }

    barChartSvgRef.current = d3
      .select(barChartRef.current)
      .attr('width', width)
      .attr('height', DEFAULT_CHART_HEIGHT + margins.top + margins.bottom);

    // Set the ranges.
    const xScale = d3
      .scaleBand()
      .domain(d3.range(0, data.length).map(String))
      .range([0, width - margins.left - margins.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax || (d3.max(data) ?? 0)])
      .range([DEFAULT_CHART_HEIGHT, 0]);

    const bars = barChartSvgRef.current
      .selectAll('.bar-chart-bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-chart-bar')
      .attr('transform', () => `translate(${margins.left}, ${margins.top})`);

    // Append rectangles for the bar chart.
    bars
      .append('rect')
      .attr('x', (_, i) => xScale(i.toString()) ?? 0)
      .attr('width', xScale.bandwidth())
      .attr('y', (d) => yScale(d) ?? 0)
      .attr('height', (d) => DEFAULT_CHART_HEIGHT - yScale(d));

    // Add x-axis.
    const xAxis = d3.axisBottom(xScale).tickFormat((_, i) => xAxisTickLabels[i] ?? i);
    barChartSvgRef.current
      .append('g')
      .attr('class', 'bar-chart-x-axis')
      .attr('transform', `translate(${margins.left}, ${DEFAULT_CHART_HEIGHT + margins.top})`)
      .call(xAxis);

    // Add y-axis.
    let yAxis = d3.axisLeft(yScale).tickFormat((d) => formatCount(d as number));
    if (typeof yAxisTicksCount !== 'undefined') {
      yAxis = yAxis.ticks(yAxisTicksCount);
    }
    barChartSvgRef.current
      .append('g')
      .attr('class', 'bar-chart-y-axis')
      .call(yAxis)
      .attr('transform', `translate(${margins.left}, ${margins.top})`);

    // Bar height counts.
    if (showCounts) {
      bars
        .append('text')
        .attr('class', 'bar-chart-height-counts')
        .attr('x', (_, i) => (xScale(i.toString()) ?? 0) + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(d) - 4)
        .text((d) => formatCount(d));
    }

    // X-axis label.
    barChartSvgRef.current
      .append('text')
      .attr('class', 'bar-chart-x-axis-label')
      .attr(
        'transform',
        `translate(${margins.left + (width - margins.left - margins.right) / 2}, ${
          DEFAULT_CHART_HEIGHT + margins.top + margins.bottom - 10
        })`
      )
      .text(xAxisLabel);

    // Y-axis label.
    barChartSvgRef.current
      .append('text')
      .attr('class', 'bar-chart-y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (DEFAULT_CHART_HEIGHT + margins.left) / 2)
      .attr('y', width < 600 ? 20 : 26)
      .text(yAxisLabel);

    // Responsively resize chart when window resizes.
    // TODO: Fix this - it is not actually resizing.
    const handleResizeDebounced = debounce(resizeBarChart, 350);
    window.addEventListener('resize', handleResizeDebounced);

    return () => {
      barChartSvgRef.current?.selectAll('*').remove();
      window.removeEventListener('resize', handleResizeDebounced);
    };
  }, [
    data,
    formatCount,
    getBarChartWidth,
    marginsProp,
    resizeBarChart,
    showCounts,
    xAxisLabel,
    xAxisTickLabels,
    yAxisLabel,
    yAxisTicksCount,
    yMax,
  ]);

  return (
    <BarChartWrapper ref={barChartWrapperRef}>
      <BarChartSvg ref={barChartRef} />
    </BarChartWrapper>
  );
};
