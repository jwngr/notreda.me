import React, {Component} from 'react';
import * as d3 from 'd3';

import './Explorables.css';

class Explorables extends Component {
  constructor(props) {
    super(props);
    const parseTime = d3.timeParse('%Y');
    this.state = {
      scatterPlotData: [
        {
          question: 'Activity One',
          answer: 'Some answer',
          value: 2,
          consequence: -2,
        },
        {
          question: 'Activity Two',
          answer: 'Some answer',
          value: 1,
          consequence: -2,
        },
        {
          question: 'Activity Three',
          answer: 'Another answer',
          value: 1,
          consequence: -1,
        },
        {
          question: 'Activity Four',
          answer: 'Another answer',
          value: 2,
          consequence: 1,
        },
        {
          question: 'Activity Five',
          answer: 'Another answer',
          value: 1,
          consequence: 2,
        },
        {
          question: 'Activity Six',
          answer: 'Another answer',
          value: -2,
          consequence: -2,
        },
        {
          question: 'Activity Seven',
          answer: 'Another answer',
          value: -2,
          consequence: 2,
        },
      ],
      data2: [
        {
          key: 'apples',
          values: [
            {
              date: parseTime('2013'),
              value: 121,
            },
            {
              date: parseTime('2014'),
              value: 111,
            },
            {
              date: parseTime('2015'),
              value: 91,
            },
            {
              date: parseTime('2016'),
              value: 111,
            },
            {
              date: parseTime('2017'),
              value: 150,
            },
          ],
        },
        {
          key: 'bananas',
          values: [
            {
              date: parseTime('2013'),
              value: 215,
            },
            {
              date: parseTime('2014'),
              value: 190,
            },
            {
              date: parseTime('2015'),
              value: 105,
            },
            {
              date: parseTime('2016'),
              value: 220,
            },
            {
              date: parseTime('2017'),
              value: 140,
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {
    /**********************/
    /*  MULTI LINE CHART  */
    /**********************/

    //TODO: add margins to display axis nicer

    const width = 700,
      height = 500;

    const chart = d3
      .select(this.chartRef)
      .attr('width', width + 100)
      .attr('height', height + 200) //200 for legend
      .append('g')
      .attr('transform', 'translate(100, 0)');

    const x = d3
      .scaleTime()
      .domain([new Date(2013, 0, 1), new Date(2017, 0, 1)]) // min max dates
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, 250]) //max value
      .range([height, 0]);

    const colors = d3
      .scaleOrdinal()
      .domain(['apples', 'bananas'])
      .range(['red', 'green']);

    const graph = chart
      .selectAll('.graph')
      .data(this.state.data2)
      .enter()
      .append('g')
      .attr('class', 'graph');

    graph
      .append('path')
      .attr('class', 'line')
      .style('stroke', (d) => {
        return colors(d.key);
      })
      .attr('d', (parentData) => {
        return d3
          .line()
          .curve(d3.curveBasis) // make points round, not sharp
          .x((d) => x(d.date))
          .y((d) => y(d.value))(parentData.values);
      });

    chart
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${y(0) - 20})`)
      .call(d3.axisBottom(x));

    chart
      .append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(0,0)`)
      .call(d3.axisLeft(y));

    const legendContainer = chart
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, ${y(0) + 20})`);

    legendContainer
      .selectAll('rect')
      .data(['apples', 'bananas'])
      .enter()
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('x', (d, i) => {
        return i * 100;
      })
      .attr('fill', colors);

    legendContainer
      .selectAll('text')
      .data(['apples', 'bananas'])
      .enter()
      .append('text')
      .attr('x', (d, i) => {
        return i * 100 + 25;
      })
      .attr('y', 12)
      .text((d) => d);

    /******************/
    /*  SCATTER PLOT  */
    /******************/
    // var svg = d3.select("#scatter");
    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    };

    const scatterPlotWidth = 500;
    const scatterPlotHeight = 500;
    // var width = +svg.attr("width");
    // var height = +svg.attr("height");
    var domainWidth = scatterPlotWidth - margin.left - margin.right;
    var domainHeight = scatterPlotHeight - margin.top - margin.bottom;

    const scatterPlot = d3
      .select(this.scatterPlotRef)
      .attr('width', scatterPlotWidth)
      .attr('height', scatterPlotHeight);

    var scatterPlotX = d3
      .scaleLinear()
      .domain(padExtent([-2, 2]))
      .range(padExtent([0, domainWidth]));

    var scatterPlotY = d3
      .scaleLinear()
      .domain(padExtent([-2, 2]))
      .range(padExtent([domainHeight, 0]));

    var g = scatterPlot
      .append('g')
      .attr('transform', 'translate(' + margin.top + ',' + margin.top + ')');

    g
      .append('rect')
      .attr('width', scatterPlotWidth - margin.left - margin.right)
      .attr('height', scatterPlotHeight - margin.top - margin.bottom)
      .attr('fill', '#F6F6F6');

    g
      .selectAll('circle')
      .data(this.state.scatterPlotData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 4)
      .attr('cx', function(d) {
        return scatterPlotX(d.consequence);
      })
      .attr('cy', function(d) {
        return scatterPlotY(d.value);
      })
      .style('fill', function(d) {
        if (d.value >= 0 && d.consequence <= 0) {
          // Top left
          return '#60B19C';
        } else if (d.value >= 0 && d.consequence >= 0) {
          // Top right
          return '#8EC9DC';
        } else if (d.value <= 0 && d.consequence >= 0) {
          // Bottom left
          return '#D06B47';
        } else {
          // Bottom right
          return '#A72D73';
        }
      });

    g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + scatterPlotY.range()[0] / 2 + ')')
      .call(d3.axisBottom(scatterPlotX).ticks(5));

    g
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + scatterPlotX.range()[1] / 2 + ', 0)')
      .call(d3.axisLeft(scatterPlotY).ticks(5));

    function padExtent(e, p) {
      if (p === undefined) p = 1;
      return [e[0] - p, e[1] + p];
    }
  }

  render() {
    return (
      <div>
        <svg className="line-chart--base" ref={(r) => (this.chartRef = r)} />
        <svg className="quadrant-chart" ref={(r) => (this.scatterPlotRef = r)} />
      </div>
    );
  }
}

export default Explorables;
