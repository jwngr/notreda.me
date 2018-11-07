import {darken} from 'polished';
import styled from 'styled-components';

import backgroundImage from '../../../images/background.png';

export const LineChartWrapper = styled.div`
  position: relative;
  margin: 20px auto 8px auto;
  overflow: hidden;
  font-family: 'Inter UI', serif;
  background-image: url(${backgroundImage});
  background-color: ${(props) => props.theme.colors.lightGray}40;
  border: solid 3px ${(props) => darken(0.2, props.theme.colors.green)};
`;

export const LineChartSvg = styled.svg`
  text {
    fill: ${(props) => darken(0.2, props.theme.colors.green)};
  }

  .line-chart-x-axis,
  .line-chart-y-axis {
    font-size: 14px;

    path,
    line {
      stroke: ${(props) => darken(0.2, props.theme.colors.green)};
    }

    @media (max-width: 600px) {
      font-size: 10px;
    }
  }

  .line-chart-x-axis-label,
  .line-chart-y-axis-label {
    font-size: 16px;
    text-anchor: middle;

    @media (max-width: 600px) {
      font-size: 14px;
    }
  }

  .line {
    fill: transparent;
    stroke-width: 2px;
  }

  .line-area {
    fill: ${(props) => props.theme.colors.green};
    stroke: ${(props) => darken(0.2, props.theme.colors.green)};
    stroke-width: 2px;
  }

  .series-0 {
    stroke: ${(props) => darken(0.2, props.theme.colors.green)};
  }

  .dot.series-0 {
    fill: ${(props) => props.theme.colors.green};
    stroke: ${(props) => darken(0.2, props.theme.colors.green)};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-1 {
    stroke: ${(props) => darken(0.2, '#377eb8')};
  }

  .dot.series-1 {
    fill: ${(props) => '#377eb8'};
    stroke: ${(props) => darken(0.2, '#377eb8')};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-2 {
    stroke: ${(props) => darken(0.2, '#984ea3')};
  }

  .dot.series-2 {
    fill: ${(props) => '#984ea3'};
    stroke: ${(props) => darken(0.2, '#984ea3')};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-3 {
    stroke: ${(props) => darken(0.2, '#ff7f00')};
  }

  .dot.series-3 {
    fill: ${(props) => '#ff7f00'};
    stroke: ${(props) => darken(0.2, '#ff7f00')};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-4 {
    stroke: ${(props) => darken(0.2, '#b50321')};
  }

  .dot.series-4 {
    fill: ${(props) => '#b50321'};
    stroke: ${(props) => darken(0.2, '#b50321')};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-5 {
    stroke: ${(props) => darken(0.2, '#19dabf')};
  }

  .dot.series-5 {
    fill: ${(props) => '#19dabf'};
    stroke: ${(props) => darken(0.2, '#19dabf')};
    stroke-width: 2px;
    z-index: 10;
  }
`;
