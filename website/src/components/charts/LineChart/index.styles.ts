import {darken} from 'polished';
import styled from 'styled-components';

import backgroundImage from '../../../images/background.png';

export const LineChartWrapper = styled.div`
  position: relative;
  margin: 20px auto 8px auto;
  overflow: hidden;
  font-family: 'Inter', serif;
  background-image: url(${backgroundImage});
  background-color: ${({theme}) => theme.colors.lightGray}40;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
`;

export const LineChartSvg = styled.svg`
  text {
    fill: ${({theme}) => darken(0.2, theme.colors.green)};
  }

  .line-chart-x-axis,
  .line-chart-y-axis {
    font-size: 14px;

    path,
    line {
      stroke: ${({theme}) => darken(0.2, theme.colors.green)};
    }

    @media (max-width: 600px) {
      font-size: 10px;
    }
  }

  .line-chart-x-axis-label,
  .line-chart-y-axis-label {
    font-size: 16px;
    text-anchor: middle;
    font-variant: small-caps;

    @media (max-width: 600px) {
      font-size: 14px;
    }
  }

  .line {
    fill: transparent;
    stroke-width: 2px;
  }

  .line-area {
    fill: ${({theme}) => theme.colors.green};
    stroke: ${({theme}) => darken(0.2, theme.colors.green)};
    stroke-width: 2px;
  }

  .series-0 {
    stroke: ${({theme}) => darken(0.2, theme.colors.green)};
  }

  .dot.series-0 {
    fill: ${({theme}) => theme.colors.green};
    stroke: ${({theme}) => darken(0.2, theme.colors.green)};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-1 {
    stroke: ${darken(0.2, '#377eb8')};
  }

  .dot.series-1 {
    fill: #377eb8;
    stroke: ${darken(0.2, '#377eb8')};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-2 {
    stroke: ${() => darken(0.2, '#984ea3')};
  }

  .dot.series-2 {
    fill: #984ea3;
    stroke: ${darken(0.2, '#984ea3')};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-3 {
    stroke: ${darken(0.2, '#ff7f00')};
  }

  .dot.series-3 {
    fill: #ff7f00;
    stroke: ${darken(0.2, '#ff7f00')};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-4 {
    stroke: ${darken(0.2, '#b50321')};
  }

  .dot.series-4 {
    fill: #b50321;
    stroke: ${darken(0.2, '#b50321')};
    stroke-width: 2px;
    z-index: 10;
  }

  .series-5 {
    stroke: ${darken(0.2, '#19dabf')};
  }

  .dot.series-5 {
    fill: #19dabf;
    stroke: ${darken(0.2, '#19dabf')};
    stroke-width: 2px;
    z-index: 10;
  }
`;
