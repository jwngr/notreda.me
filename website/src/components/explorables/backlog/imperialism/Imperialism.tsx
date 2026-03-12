import * as d3 from 'd3';
import {geoPath} from 'd3-geo';
import {schemeBlues} from 'd3-scale-chromatic';
import type {FeatureCollection, Geometry, MultiLineString} from 'geojson';
import React, {Component} from 'react';
import {feature, mesh} from 'topojson-client';

import {Note} from '../../Note';
import {Paragraph} from '../../Paragraph';
import unemploymentData from './unemployment.json';

import './Imperialism.css';

type ImperialismState = Record<string, never>;

export class Imperialism extends Component<Record<string, never>, ImperialismState> {
  private imperialismMapRef: SVGSVGElement | null = null;

  constructor(props: Record<string, never>) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    void this.loadMap();
  }

  private async loadMap() {
    const width = 960;
    const height = 600;

    // Chart
    if (!this.imperialismMapRef) {
      return;
    }

    const map = d3.select(this.imperialismMapRef).attr('width', width).attr('height', height);

    const unemployment = new Map<string, number>();

    unemploymentData.forEach(({id, rate}) => {
      unemployment.set(id, Number(rate));
    });

    const path = geoPath<d3.GeoPermissibleObjects>();

    const scaleX = d3.scaleLinear().domain([1, 10]).rangeRound([600, 860]);

    const color = d3
      .scaleThreshold<number, string>()
      .domain(d3.range(2, 10))
      .range([...schemeBlues[9]]);

    const g = map.append('g').attr('class', 'key').attr('transform', 'translate(0,40)');

    // Color bar in legend
    g.selectAll('rect')
      .data(
        color.range().map((d) => {
          const extent = color.invertExtent(d);
          if (extent[0] == null) extent[0] = scaleX.domain()[0];
          if (extent[1] == null) extent[1] = scaleX.domain()[1];
          return extent;
        })
      )
      .enter()
      .append('rect')
      .attr('height', 8)
      .attr('x', (d) => {
        return scaleX(d[0] ?? 0);
      })
      .attr('width', (d) => {
        return scaleX(d[1] ?? 0) - scaleX(d[0] ?? 0);
      })
      .attr('fill', (d) => {
        return color(d[0] ?? 0);
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
          return i ? String(x) : `${x}%`;
        })
        .tickValues(color.domain())
    )
      .select('.domain')
      .remove();

    const us = await d3.json('https://d3js.org/us-10m.v1.json');
    if (!us) {
      return;
    }

    const topoJson = us as {readonly objects: {readonly counties: object; readonly states: object}};
    const counties = feature(topoJson, topoJson.objects.counties) as FeatureCollection<
      Geometry,
      {id: string; rate?: number}
    >;

    map
      .append('g')
      .attr('class', 'counties')
      .selectAll('path')
      .data(counties.features)
      .enter()
      .append('path')
      .attr('fill', (d) => {
        const id = d.properties?.id ?? '';
        const rate = unemployment.get(id) ?? 0;
        d.properties = {...(d.properties ?? {}), rate};
        return color(rate);
      })
      .attr('d', path)
      .append('title')
      .text((d) => `${d.properties?.rate ?? 0}%`);

    map
      .append('path')
      .datum(
        mesh(
          topoJson,
          topoJson.objects.states,
          (a: unknown, b: unknown) => a !== b
        ) as MultiLineString
      )
      .attr('class', 'states')
      .attr('d', path);
  }

  render() {
    return (
      <div>
        <h1>State Imperialism Map</h1>
        <Paragraph>Here is a map:</Paragraph>

        <div>
          <svg
            ref={(r) => {
              this.imperialismMapRef = r;
            }}
          />
        </div>

        <Note>
          The map above - and everything else in this post - are interactive! Roll your mouse over
          the map for stats about particular states.
        </Note>
      </div>
    );
  }
}
