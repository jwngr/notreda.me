import * as d3 from 'd3';
import {geoPath} from 'd3-geo';
import {schemeBlues} from 'd3-scale-chromatic';
import React, {Component} from 'react';
import {feature, mesh} from 'topojson-client';

import {Note} from './Note';
import {Paragraph} from './Paragraph';
import unemploymentData from './unemployment.json';

import './Imperialism.css';

export class Imperialism extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const width = 960;
    const height = 600;

    // Chart
    const map = d3.select(this.imperialismMapRef).attr('width', width).attr('height', height);

    var unemployment = d3.map();

    unemploymentData.forEach(({id, rate}) => {
      unemployment.set(id, +rate);
    });

    var path = geoPath();

    var scaleX = d3.scaleLinear().domain([1, 10]).rangeRound([600, 860]);

    var color = d3.scaleThreshold().domain(d3.range(2, 10)).range(schemeBlues[9]);

    var g = map.append('g').attr('class', 'key').attr('transform', 'translate(0,40)');

    // Color bar in legend
    g.selectAll('rect')
      .data(
        color.range().map(function (d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = scaleX.domain()[0];
          if (d[1] == null) d[1] = scaleX.domain()[1];
          return d;
        })
      )
      .enter()
      .append('rect')
      .attr('height', 8)
      .attr('x', function (d) {
        return scaleX(d[0]);
      })
      .attr('width', function (d) {
        return scaleX(d[1]) - scaleX(d[0]);
      })
      .attr('fill', function (d) {
        return color(d[0]);
      });

    // Legend title
    g.append('text')
      .attr('class', 'caption')
      .attr('x', scaleX.range()[0])
      .attr('y', -6)
      .attr('fill', '#000')
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text('Unemployment rate');

    // Legend ticks
    g.call(
      d3
        .axisBottom(scaleX)
        .tickSize(13)
        .tickFormat((x, i) => {
          return i ? x : x + '%';
        })
        .tickValues(color.domain())
    )
      .select('.domain')
      .remove();

    d3.queue().defer(d3.json, 'https://d3js.org/us-10m.v1.json').await(ready);

    function ready(error, us) {
      if (error) throw error;

      map
        .append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(feature(us, us.objects.counties).features)
        .enter()
        .append('path')
        .attr('fill', function (d) {
          return color((d.rate = unemployment.get(d.id)));
        })
        .attr('d', path)
        .append('title')
        .text(function (d) {
          return d.rate + '%';
        });

      map
        .append('path')
        .datum(
          mesh(us, us.objects.states, function (a, b) {
            return a !== b;
          })
        )
        .attr('class', 'states')
        .attr('d', path);
    }
  }

  render() {
    return (
      <div>
        <h1>State Imperialism Map</h1>
        <Paragraph>Here is a map:</Paragraph>

        <div>
          <svg className="imperialism-map" ref={(r) => (this.imperialismMapRef = r)} />
        </div>

        <Note>
          The map above - and everything else in this post - are interactive! Roll your mouse over
          the map for stats about particular states.
        </Note>
      </div>
    );
  }
}
