import {darken} from 'polished';
import styled from 'styled-components';

import backgroundImage from '../../../images/background.png';

export const LineChartWrapper = styled.div`
  margin: 20px auto;
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

  .bar {
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

  .x-axis,
  .y-axis {
    font-size: 14px;

    path,
    line {
      stroke: ${(props) => darken(0.2, props.theme.colors.green)};
    }

    @media (max-width: 600px) {
      font-size: 10px;
    }
  }

  .x-axis-label,
  .y-axis-label {
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

  .area {
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
`;
