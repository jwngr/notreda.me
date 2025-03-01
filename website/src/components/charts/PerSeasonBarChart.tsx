import * as d3 from 'd3';
import debounce from 'lodash/debounce';
import last from 'lodash/last';
import {darken} from 'polished';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

import backgroundImage from '../../images/background.png';
import {PerSeasonChartData} from '../explorables/season1/episode2/models';
import {Tooltip} from './Tooltip';

const DEFAULT_FORMATTER: (d: number) => string = d3.format(',.0f');
const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_MARGINS = {top: 40, right: 20, bottom: 60, left: 80};
const DEFAULT_MARGINS_SMALL = {top: 20, right: 10, bottom: 50, left: 60};

const PerSeasonBarChartWrapper = styled.div`
  position: relative;
  margin: 20px auto 8px auto;
  overflow: hidden;
  font-family: 'Inter', serif;
  background-image: url(${backgroundImage});
  background-color: ${({theme}) => theme.colors.lightGray}40;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
`;

const PerSeasonBarChartSvg = styled.svg`
  text {
    fill: ${({theme}) => darken(0.2, theme.colors.green)};
  }

  .per-season-bar-chart-bar {
    rect {
      fill: ${({theme}) => theme.colors.green};
      stroke: ${({theme}) => darken(0.2, theme.colors.green)};
      stroke-width: 2px;

      @media (max-width: 800px) {
        stroke-width: 1px;
      }

      @media (max-width: 600px) {
        stroke-width: 0;
      }
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

  .per-season-bar-chart-x-axis,
  .per-season-bar-chart-y-axis {
    font-size: 14px;

    path,
    line {
      stroke: ${({theme}) => darken(0.2, theme.colors.green)};
    }

    @media (max-width: 600px) {
      font-size: 10px;
    }
  }

  .per-season-bar-chart-x-axis-label,
  .per-season-bar-chart-y-axis-label {
    font-size: 16px;
    text-anchor: middle;
    font-variant: small-caps;

    @media (max-width: 600px) {
      font-size: 14px;
    }
  }
`;

export const PerSeasonBarChart: React.FC<{
  readonly data: readonly PerSeasonChartData[];
  readonly xAxisLabel: string;
  readonly yAxisLabel: string;
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
}> = ({data, xAxisLabel, yAxisLabel, margins: marginsProp}) => {
  const barChartRef = useRef<SVGSVGElement>(null);
  const barChartWrapperRef = useRef<HTMLDivElement>(null);
  const barChartSvgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);

  const [tooltip, setTooltip] = useState<{
    readonly x: number;
    readonly y: number;
    readonly children: React.ReactNode;
  } | null>(null);
  const [mouseLocation, setMouseLocation] = useState<{
    readonly x: number;
    readonly y: number;
  } | null>(null);
  const unsetTooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  const getBarChartWidth = useCallback(() => {
    if (!barChartWrapperRef.current) return 0;
    // Return width of wrapper element, minus border.
    return barChartWrapperRef.current.getBoundingClientRect().width - 6;
  }, []);

  const resizeBarChart = useCallback(() => {
    if (!barChartSvgRef.current) return;
    barChartSvgRef.current.attr('width', getBarChartWidth());
  }, [getBarChartWidth]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMouseLocation({x: event.pageX, y: event.pageY});
  }, []);

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

    // Define the ranges.
    const xScale = d3
      .scaleTime()
      .domain([new Date(data[0]?.season ?? 0, 0, 1), new Date(last(data)?.season ?? 0, 0, 1)])
      .range([0, width - margins.left - margins.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.map(({value}) => value)) || 0])
      .range([DEFAULT_CHART_HEIGHT, 0]);

    const bars = barChartSvgRef.current
      .selectAll('.per-season-bar-chart-bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'per-season-bar-chart-bar')
      .attr('transform', () => `translate(${margins.left}, ${margins.top})`);

    // Append rectangles for the bar chart.
    bars
      .append('rect')
      .attr('x', (d) => xScale(new Date(d.season, 0, 1)))
      .attr('width', width / data.length)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => DEFAULT_CHART_HEIGHT - yScale(d.value))
      .on('mouseover', (_, d) => {
        if (unsetTooltipTimeout.current) {
          clearTimeout(unsetTooltipTimeout.current);
        }

        if (mouseLocation) {
          // It is possible for the mouse to initially be on a spot which should show a tooltip,
          // so simply ignore that case.
          setTooltip({x: mouseLocation.x, y: mouseLocation.y, children: d.tooltipChildren});
        }
      })
      .on('mouseout', () => {
        unsetTooltipTimeout.current = setTimeout(() => {
          setTooltip(null);
          unsetTooltipTimeout.current = null;
        }, 200);
      });

    // Add x-axis.
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d3.timeFormat('%Y')(d as Date));
    barChartSvgRef.current
      .append('g')
      .attr('class', 'per-season-bar-chart-x-axis')
      .attr('transform', `translate(${margins.left}, ${DEFAULT_CHART_HEIGHT + margins.top})`)
      .call(xAxis);

    // Add y-axis.
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => DEFAULT_FORMATTER(d as number));
    barChartSvgRef.current
      .append('g')
      .attr('class', 'per-season-bar-chart-y-axis')
      .call(yAxis)
      .attr('transform', `translate(${margins.left}, ${margins.top})`);

    // X-axis label.
    barChartSvgRef.current
      .append('text')
      .attr('class', 'per-season-bar-chart-x-axis-label')
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
      .attr('class', 'per-season-bar-chart-y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (DEFAULT_CHART_HEIGHT + margins.left) / 2)
      .attr('y', width < 600 ? 20 : 26)
      .text(yAxisLabel);

    // Responsively resize chart when window resizes.
    // TODO: Fix this - it is not actually resizing.
    const handleResizeDebounced = debounce(resizeBarChart, 350);
    window.addEventListener('resize', handleResizeDebounced);

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      barChartSvgRef.current?.selectAll('*').remove();
      window.removeEventListener('resize', handleResizeDebounced);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    data,
    getBarChartWidth,
    handleMouseMove,
    marginsProp,
    mouseLocation,
    resizeBarChart,
    xAxisLabel,
    yAxisLabel,
  ]);

  let tooltipContent: React.ReactNode = null;
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
      <PerSeasonBarChartWrapper ref={barChartWrapperRef}>
        <PerSeasonBarChartSvg ref={barChartRef} />
      </PerSeasonBarChartWrapper>
    </>
  );
};
