import * as d3 from 'd3';
import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import TweetEmbed from 'react-tweet-embed';

import schedule from '../../resources/schedule.json';
import {Tooltip} from '../charts/Tooltip';
import {Note} from './Note';
import {Paragraph} from './Paragraph';

import './YardPoints.css';

export class YardPoints extends Component {
  constructor(props) {
    super(props);

    let yardsDifferentialData = [];

    Object.entries(schedule).forEach((yearData, year) => {
      let currentData = yearData.map(({stats, score, opponentId, result, isHomeGame}) => {
        if (typeof stats !== 'undefined') {
          let rushYardsDifferential;
          let passYardsDifferential;

          let scoreText;
          let turnoverDifferential;
          const awayTurnoverCount = stats.away.interceptionsThrown + stats.away.fumblesLost;
          const homeTurnoverCount = stats.home.interceptionsThrown + stats.home.fumblesLost;

          if (isHomeGame) {
            rushYardsDifferential = stats.home.rushYards - stats.away.rushYards;
            passYardsDifferential = stats.home.passYards - stats.away.passYards;
            scoreText = `${result} ${score.home}-${score.away}`;
            turnoverDifferential = awayTurnoverCount - homeTurnoverCount;
          } else {
            rushYardsDifferential = stats.away.rushYards - stats.home.rushYards;
            passYardsDifferential = stats.away.passYards - stats.home.passYards;
            scoreText = `${result} ${score.away}-${score.home}`;
            turnoverDifferential = homeTurnoverCount - awayTurnoverCount;
          }

          return {
            year,
            result,
            scoreText,
            opponentId,
            turnoverDifferential,
            x: rushYardsDifferential,
            y: passYardsDifferential,
            tooltipChildren: `${scoreText}, ${year} ${opponentId}`,
          };
        }
      });

      // Remove undefined values from array
      currentData = currentData.filter((d) => !!d);

      if (currentData.length > 0) {
        yardsDifferentialData = yardsDifferentialData.concat(currentData);
      }
    });

    this.state = {
      tooltip: null,
      data: yardsDifferentialData,
    };
  }

  setTooltip(tooltip) {
    this.setState({
      tooltip,
    });
  }

  getMinValueForKey(data, key) {
    return data.reduce((min, p) => (p[key] < min ? p[key] : min), data[0][key]);
  }

  getMaxValueForKey(data, key) {
    return data.reduce((max, p) => (p[key] > max ? p[key] : max), data[0][key]);
  }

  componentDidMount() {
    var margins = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    };

    const scatterPlotWidth = 500;
    const scatterPlotHeight = 500;
    var domainWidth = scatterPlotWidth - margins.left - margins.right;
    var domainHeight = scatterPlotHeight - margins.top - margins.bottom;

    const scatterPlot = d3
      .select(this.scatterPlotRef)
      .attr('width', scatterPlotWidth)
      .attr('height', scatterPlotHeight);

    const minX = this.getMinValueForKey(this.state.data, 'x');
    const maxX = this.getMaxValueForKey(this.state.data, 'x');

    const minY = this.getMinValueForKey(this.state.data, 'y');
    const maxY = this.getMaxValueForKey(this.state.data, 'y');

    const min = Math.min(minX, minY);
    const max = Math.max(maxX, maxY);

    const range = Math.max(-min, max);

    var scaleX = d3
      .scaleLinear()
      .domain([-range - 50, range + 50])
      .range([0, domainWidth]);

    var scaleY = d3
      .scaleLinear()
      .domain([-range - 50, range + 50])
      .range([domainHeight, 0]);

    var g = scatterPlot
      .append('g')
      .attr('transform', 'translate(' + margins.top + ',' + margins.top + ')');

    // var tooltip = scatterPlot.append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 0);

    g.append('rect')
      .attr('width', scatterPlotWidth - margins.left - margins.right)
      .attr('height', scatterPlotHeight - margins.top - margins.bottom)
      .attr('fill', '#F6F6F6');

    g.selectAll('circle')
      .data(this.state.data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', () => {
        // return Math.abs(d.turnoverDifferential) + 1;
        return 3;
      })
      .attr('cx', (d) => {
        return scaleX(d.x);
      })
      .attr('cy', (d) => {
        return scaleY(d.y);
      })
      .style('stroke', (d) => {
        if (d.result === 'W') {
          return 'green';
        } else if (d.result === 'L') {
          return 'red';
        } else if (d.result === 'T') {
          return 'yellow';
        }
      })
      .style('fill', (d) => {
        // if (d.turnoverDifferential >= 0) {
        if (d.result === 'W') {
          return 'green';
        } else if (d.result === 'L') {
          return 'red';
        } else if (d.result === 'T') {
          return 'yellow';
        }
        // } else {
        //   return 'transparent';
        // }
      })
      .on('mouseover', (d) => {
        // const tooltipHtml = `<p>${d.scoreText}, ${d.year} ${d.opponentId}</p>`;

        clearTimeout(this.unsetTooltipTimeout);

        const domNode = findDOMNode(this.scatterPlotRef);
        const boundingRect = domNode.getBoundingClientRect();

        this.setTooltip({
          x: scaleX(d.x) + window.pageXOffset + boundingRect.left + margins.left,
          y: scaleY(d.y) + window.pageYOffset + boundingRect.top + margins.top,
          children: d.tooltipChildren,
        });

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
        this.unsetTooltipTimeout = setTimeout(() => this.setTooltip(null), 200);
      });

    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + scaleY.range()[0] / 2 + ')')
      .call(d3.axisBottom(scaleX).ticks(7));

    g.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + scaleX.range()[1] / 2 + ', 0)')
      .call(d3.axisLeft(scaleY).ticks(7));
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
      <div>
        <h1>Yard Points</h1>

        <Paragraph>
          The graph below charts every Notre Dame game back to 2000. Green indicates a win, red a
          loss. The x-axis indicates the rush yards differential between the two teams while the
          y-axis indicates the pass yards differential (positive numbers indicate ND had more
          yards).
        </Paragraph>

        <TweetEmbed tweetId="783943172057694208" options={{cards: 'hidden'}} />
        <TweetEmbed tweetId="771763270273294336" options={{theme: 'dark'}} />
        <TweetEmbed tweetId="974086889287364609" />
        <TweetEmbed tweetId="1016049395110825984" />
        <TweetEmbed tweetId="1016049395110825984" options={{cards: 'hidden'}} />

        <div>
          <svg ref={(r) => (this.scatterPlotRef = r)} />
          {tooltipContent}
        </div>

        <Note>
          The chart above - and all charts in this post - are interactive! Roll your mouse over the
          data points for stats about that particular game.
        </Note>

        <Paragraph>Interesting trends to look into:</Paragraph>

        <Paragraph>
          Winning the rushing battle seems to be more important than winning the passing battle
          (that is, the division between green and red dots is more obvious when cut by the y-axis
          than when cut by the x-axis).
        </Paragraph>

        <Paragraph>
          There are some crazy outliers: 2009 loss to Navy (top left), 2010 loss to Navy (bottom
          right), 2005 loss to OSU (top right quadrant).
        </Paragraph>

        <Paragraph>
          The biggest blowouts based on yard points are those four red dots in the bottom left, and
          three of them are against USC (2007, 2008, 2014) and the other is against BC in 2007
          (WTF?!? What an awful season!).
        </Paragraph>

        <Paragraph>
          Turnover margin is the big missing data point. That will probably be discussed in another
          post.
        </Paragraph>
      </div>
    );
  }
}
