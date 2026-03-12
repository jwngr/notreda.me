import * as d3 from 'd3';
import debounce from 'lodash/debounce';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import React, {Component} from 'react';

import {Tooltip} from '../Tooltip';

import './index.css';

import {LineChartSvg, LineChartWrapper} from './index.styles';

const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_TICKS_COUNT_X = 10;
const DEFAULT_TICKS_COUNT_Y = 10;
const DEFAULT_DATUM_CIRCLE_SIZE = 3;
const DEFAULT_MARGINS = {top: 40, right: 20, bottom: 60, left: 80};
const DEFAULT_MARGINS_SMALL = {top: 20, right: 10, bottom: 50, left: 60};
const LINE_CHART_BORDER_WIDTH = 6;

interface LineChartMargins {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
  readonly sm?: Partial<LineChartMargins>;
}

export interface LineChartDatum {
  x: number | Date;
  y: number;
  radius?: number;
  className?: string;
  tooltipChildren?: React.ReactNode;
  seriesIndex?: number;
  seriesId?: string | number;
}

export interface LineChartSeries {
  readonly id?: string | number;
  readonly className?: string;
  readonly values: readonly LineChartDatum[];
}

interface LineChartTooltip {
  readonly x: number;
  readonly y: number;
  readonly children?: React.ReactNode;
}

interface LineChartProps {
  readonly children?: React.ReactNode;
  readonly seriesData: readonly LineChartSeries[];
  readonly xAxisLabel?: string;
  readonly yAxisLabel?: string;
  readonly xAxisTicksCount?: number;
  readonly yAxisTicksCount?: number;
  readonly formatXAxisTickLabels?: (value: number | Date) => string | number;
  readonly formatYAxisTickLabels?: (value: number) => string | number;
  readonly showArea?: boolean;
  readonly showLine?: boolean;
  readonly showLineLabels?: boolean;
  readonly showDataPoints?: boolean;
  readonly margins?: Partial<LineChartMargins>;
  readonly domainX?: [number | Date, number | Date];
  readonly domainY?: [number, number];
  readonly rangeX?: [number, number];
  readonly rangeY?: [number, number];
}

interface LineChartState {
  readonly tooltip: LineChartTooltip | null;
}

export class LineChart extends Component<LineChartProps, LineChartState> {
  state: LineChartState = {tooltip: null};

  private lineChart: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private lineChartRef: SVGSVGElement | null = null;
  private scaleX: d3.ScaleLinear<number, number> | null = null;
  private scaleY: d3.ScaleLinear<number, number> | null = null;
  private width = 0;
  private mouse: {readonly x: number; readonly y: number} | null = null;
  private unsetTooltipTimeout: number | null = null;
  private readonly debouncedRedrawChartData: () => void;
  private readonly debouncedResizeLineChart: () => void;
  private isXAxisDate = false;

  constructor(props: LineChartProps) {
    super(props);

    this.debouncedRedrawChartData = debounce(this.redrawChartData.bind(this), 150);
    this.debouncedResizeLineChart = debounce(this.resizeLineChart.bind(this), 350);
  }

  setTooltip(tooltip: LineChartTooltip | null) {
    this.setState({tooltip});
  }

  handleMouseMove = (event: MouseEvent) => {
    this.mouse = {x: event.pageX, y: event.pageY};
  };

  getXValue = (value: number | Date) => {
    return value instanceof Date ? value.getTime() : value;
  };

  getMargins = () => {
    let margins: LineChartMargins = {...DEFAULT_MARGINS, ...this.props.margins};
    if (this.width < 600) {
      margins = {...DEFAULT_MARGINS_SMALL, ...margins.sm};
    }

    return margins;
  };

  drawChartAxes = () => {
    const {
      xAxisLabel = '',
      yAxisLabel = '',
      formatXAxisTickLabels = (x) => x,
      formatYAxisTickLabels = (x) => x,
      xAxisTicksCount = DEFAULT_TICKS_COUNT_X,
      yAxisTicksCount = DEFAULT_TICKS_COUNT_Y,
    } = this.props;

    const margins = this.getMargins();

    if (!this.lineChart || !this.scaleX || !this.scaleY) {
      return;
    }

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
          .tickFormat((i) =>
            String(formatXAxisTickLabels(this.isXAxisDate ? new Date(Number(i)) : Number(i)))
          )
      );

    // Y-axis
    this.lineChart
      .append('g')
      .attr('class', 'line-chart-y-axis')
      .call(
        d3
          .axisLeft(this.scaleY)
          .ticks(yAxisTicksCount)
          .tickFormat((i) => String(formatYAxisTickLabels(Number(i))))
      )
      .attr('transform', `translate(${margins.left}, ${margins.top})`);

    // X-axis label
    this.lineChart
      .append('text')
      .attr('class', 'line-chart-x-axis-label')
      .attr(
        'transform',
        `translate(${margins.left + (this.width - margins.left - margins.right) / 2}, ${
          DEFAULT_CHART_HEIGHT + margins.top + margins.bottom - 10
        })`
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
    if (!this.lineChart) {
      return;
    }

    this.lineChart.selectAll('.line-chart-data').remove();
    this.drawChartData();
  };

  drawChartData = () => {
    const {
      seriesData,
      showLine = true,
      showArea = true,
      showLineLabels = true,
      showDataPoints = true,
    } = this.props;

    const margins = this.getMargins();

    if (!this.lineChart || !this.scaleX || !this.scaleY) {
      return;
    }

    // Scales
    const dataPoints: LineChartDatum[] = [];
    seriesData.forEach((s, i) => {
      forEach(s.values, (d) => {
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
      const area = d3
        .area<LineChartDatum>()
        .curve(d3.curveMonotoneX)
        .x((d) => this.scaleX?.(this.getXValue(d.x)) ?? 0)
        .y0(this.scaleY(0))
        .y1((d) => this.scaleY?.(d.y) ?? 0);

      gData.append('path').data([dataPoints]).attr('class', 'line-area').attr('d', area);
    }

    // Chart lines
    const line = d3
      .line<LineChartDatum>()
      .curve(d3.curveMonotoneX)
      .x((d) => this.scaleX?.(this.getXValue(d.x)) ?? 0)
      .y((d) => this.scaleY?.(d.y) ?? 0);

    if (showLine) {
      const showLineIds = showLineLabels && seriesData.length !== 1;

      const teams = gData
        .selectAll('.team')
        .data(seriesData)
        .enter()
        .append('g')
        .attr('class', 'team');

      teams
        .append('path')
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
          return `translate(${this.scaleX?.(this.getXValue(d.value.x)) ?? 0}, ${
            this.scaleY?.(d.value.y) ?? 0
          })`;
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
        .attr('cx', (d, i) => this.scaleX?.(this.getXValue(d.x || i)) ?? 0)
        .attr('cy', (d) => this.scaleY?.(d.y) ?? 0)
        .attr('class', (d) => {
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
        .on('mouseover', (_event, d) => {
          if (this.unsetTooltipTimeout !== null) {
            window.clearTimeout(this.unsetTooltipTimeout);
          }

          if (this.mouse) {
            // It is possible for the mouse to initially be on a spot which should show a tooltip,
            // so simply ignore that case.
            this.setTooltip({x: this.mouse.x, y: this.mouse.y, children: d.tooltipChildren});
          }
        })
        .on('mouseout', () => {
          this.unsetTooltipTimeout = window.setTimeout(() => this.setTooltip(null), 200);
        });
    }
  };

  componentDidMount() {
    const {seriesData, rangeX, rangeY} = this.props;
    let {domainX, domainY} = this.props;

    document.addEventListener('mousemove', this.handleMouseMove);

    this.width = this.getLineChartWidth();

    const margins = this.getMargins();

    if (!this.lineChartRef) {
      return;
    }

    // Scales
    const dataPoints: LineChartDatum[] = [];
    seriesData.forEach((s, i) => {
      forEach(s.values, (d) => {
        d.seriesIndex = i;
        d.seriesId = s.id;
        dataPoints.push(d);
      });
    });

    this.isXAxisDate = dataPoints.some((point) => point.x instanceof Date);

    if (!domainX) {
      const extentX = d3.extent(dataPoints, (d) => this.getXValue(d.x));
      domainX = extentX[0] != null && extentX[1] != null ? [extentX[0], extentX[1]] : [0, 0];
    }

    if (!domainY) {
      const extentY = d3.extent(dataPoints, (d) => d.y);
      domainY = extentY[0] != null && extentY[1] != null ? extentY : [0, 0];
    }

    const numericDomainX: [number, number] = [
      this.getXValue(domainX[0]),
      this.getXValue(domainX[1]),
    ];

    this.scaleX = d3
      .scaleLinear()
      .domain(numericDomainX)
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

  componentDidUpdate(prevProps: LineChartProps) {
    if (!isEqual(this.props.seriesData, prevProps.seriesData)) {
      this.debouncedRedrawChartData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResizeLineChart);
    document.removeEventListener('mousemove', this.handleMouseMove);
    if (this.unsetTooltipTimeout !== null) {
      window.clearTimeout(this.unsetTooltipTimeout);
    }
  }

  getLineChartWidth() {
    // Return width of wrapper element, minus border.
    const wrapper = document.querySelector('.line-chart-wrapper');
    if (!wrapper) {
      return 0;
    }

    return wrapper.getBoundingClientRect().width - LINE_CHART_BORDER_WIDTH;
  }

  resizeLineChart() {
    // TODO: Redraw chart when width changes.
    this.width = this.getLineChartWidth();
    this.lineChart?.attr('width', this.width);
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
        <LineChartWrapper className="line-chart-wrapper">
          <LineChartSvg
            ref={(r) => {
              this.lineChartRef = r;
            }}
          />
          {this.props.children}
        </LineChartWrapper>
      </>
    );
  }
}
