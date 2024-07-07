import {darken} from 'polished';
import styled from 'styled-components';

import backgroundImage from '../../../images/background.png';

export const PerSeasonBarChartWrapper = styled.div`
  position: relative;
  margin: 20px auto 8px auto;
  overflow: hidden;
  font-family: 'Inter UI', serif;
  background-image: url(${backgroundImage});
  background-color: ${({theme}) => theme.colors.lightGray}40;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
`;

export const PerSeasonBarChartSvg = styled.svg`
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
