import {darken} from 'polished';
import styled from 'styled-components';

export const STATS_SECTION_BREAKPOINTS = [1350, 1300, 950, 700];

export const GameStatsWrapper = styled.div`
  width: 100%;
  margin-top: 32px;
  border: solid 3px ${(props) => props.theme.colors.black};
`;

export const GameStatsHeaderRow = styled.div`
  width: 100%;
  padding: 0;
  display: flex;
  margin-top: -17px;
`;

export const STATS_HEADER_COLUMN_STYLES = {
  // Stat names are the left column (large version).
  leftLarge: `
    flex: unset;
    width: 180px;

    &:nth-of-type(2) {
      order: 1;
      margin-left: 0;
      margin-right: 12px;
    }

    &:last-of-type {
      order: 2;
      margin-right: 12px;
    }
  `,

  // Stat names are the left column (small version).
  leftSmall: `
    flex: unset;
    width: 160px;

    &:nth-of-type(2) {
      order: 1;
      margin-left: 0;
      margin-right: 8px;
    }

    &:last-of-type {
      order: 2;
      margin-right: 8px;
    }
  `,

  // Stat names are the middle column.
  middle: `
    flex: 1;
    width: unset;

    &:nth-of-type(2) {
      order: 0;
      margin-left: 4px;
      margin-right: 0;
    }

    &:last-of-type {
      order: 2;
      margin-right: 4px;
    }
  `,
};

export const GameStatsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  p {
    flex: 1;
    min-width: 132px;
    max-width: 200px;
    display: flex;
    padding: 4px 0;
    text-align: center;
    align-items: center;
    justify-content: center;
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
    text-shadow: ${(props) => props.theme.colors.black} 1px 1px;
    font-family: 'Bungee';
    font-size: ${({longestHeaderTextLength}) => (longestHeaderTextLength > 14 ? '12px' : '14px')};
    color: ${(props) => props.theme.colors.white};
    border: solid 3px ${(props) => props.theme.colors.black};
  }

  @media (min-width: ${STATS_SECTION_BREAKPOINTS[0] + 1}px) {
    ${STATS_HEADER_COLUMN_STYLES.leftLarge}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[0]}px) {
    ${STATS_HEADER_COLUMN_STYLES.leftSmall}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[1]}px) {
    ${STATS_HEADER_COLUMN_STYLES.middle}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[2]}px) {
    ${STATS_HEADER_COLUMN_STYLES.leftLarge}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[3]}px) {
    ${STATS_HEADER_COLUMN_STYLES.middle}
  }
`;

export const STATS_HEADER_SPACER_STYLES = {
  left: `
    flex: 1;
    order: 0;
    width: unset;
  `,
  middle: `
    flex: unset;
    order: 1;
    width: 100px;
  `,
};

export const GameStatsHeaderSpacer = styled.div`
  ${STATS_HEADER_SPACER_STYLES.left}

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[1]}px) {
    ${STATS_HEADER_SPACER_STYLES.middle}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[2]}px) {
    ${STATS_HEADER_SPACER_STYLES.left}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[3]}px) {
    ${STATS_HEADER_SPACER_STYLES.middle}
  }
`;
