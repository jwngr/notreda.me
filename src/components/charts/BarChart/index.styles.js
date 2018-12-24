import {darken} from 'polished';
import styled from 'styled-components';

import backgroundImage from '../../../images/background.png';

export const BarChartWrapper = styled.div`
  margin: 20px auto 8px auto;
  overflow: hidden;
  font-family: 'Inter UI', serif;
  background-image: url(${backgroundImage});
  background-color: ${(props) => props.theme.colors.lightGray}40;
  border: solid 3px ${(props) => darken(0.2, props.theme.colors.green)};
`;

export const BarChartSvg = styled.svg`
  text {
    fill: ${(props) => darken(0.2, props.theme.colors.green)};
  }

  .bar-chart-bar {
    rect {
      fill: ${(props) => props.theme.colors.green};
      stroke: ${(props) => darken(0.2, props.theme.colors.green)};
      stroke-width: 2px;
    }

    text {
      font-size: 14px;
      text-anchor: middle;
      fill: ${(props) => darken(0.2, props.theme.colors.green)};

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
      stroke: ${(props) => darken(0.2, props.theme.colors.green)};
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
