import styled from 'styled-components';

import {
  STATS_HEADER_COLUMN_STYLES,
  STATS_HEADER_SPACER_STYLES,
  STATS_SECTION_BREAKPOINTS,
} from '../index.styles';

export const GameStatsRowWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:nth-of-type(2n + 1) {
    background-color: ${(props) => props.theme.colors.gray}2b;
  }
`;

const StatCell = styled.p`
  padding: 6px 0;
  color: ${(props) => props.theme.colors.black};
  font-size: 14px;
  font-family: 'Inter UI';
  white-space: nowrap;
`;

const STAT_NAME_STYLES = {
  left: ({isStatsGroupRow}) => `
    ${STATS_HEADER_SPACER_STYLES.left};
    font-weight: ${isStatsGroupRow ? 'bold' : 'normal'};
    padding-left: ${isStatsGroupRow ? '8px' : '20px'};
    text-align: left;
  `,
  middle: () => `
    ${STATS_HEADER_SPACER_STYLES.middle};
    padding-left: 0;
    font-weight: bold;
    text-align: center;
  `,
};

export const StatName = styled(StatCell)`
  ${(props) => STAT_NAME_STYLES.left(props)};

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[1]}px) {
    ${(props) => STAT_NAME_STYLES.middle(props)};
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[2]}px) {
    ${(props) => STAT_NAME_STYLES.left(props)};
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[3]}px) {
    ${(props) => STAT_NAME_STYLES.middle(props)};
  }
`;

export const StatValue = styled(StatCell)`
  text-align: center;

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
