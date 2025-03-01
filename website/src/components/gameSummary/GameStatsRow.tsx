import React from 'react';
import styled from 'styled-components';

import {useMediaQuery} from '../../hooks/useMediaQuery';
import {DEFAULT_TEAM_COLOR} from '../../lib/constants';
import {Team} from '../../models/teams.models';
import {FlexRow} from '../common/Flex';
import {
  STATS_HEADER_COLUMN_STYLES,
  STATS_HEADER_SPACER_STYLES,
  STATS_SECTION_BREAKPOINTS,
} from './GameSummary.styles';

const GameStatsRowWrapper = styled(FlexRow).attrs({justify: 'center'})`
  &:nth-of-type(2n + 1) {
    background-color: ${({theme}) => theme.colors.gray}2b;
  }
`;

const StatCell = styled.p`
  padding: 6px 0;
  color: ${({theme}) => theme.colors.black};
  font-size: 14px;
  font-family: 'Inter';
  white-space: nowrap;
`;

interface StatNameProps {
  readonly $isStatsGroupRow: boolean;
}

const STAT_NAME_STYLES = {
  left: ({$isStatsGroupRow}: StatNameProps) => `
    ${STATS_HEADER_SPACER_STYLES.left}; 
    font-weight: ${$isStatsGroupRow ? 'bold' : 'normal'};
    padding-left: ${$isStatsGroupRow ? '8px' : '20px'};
    text-align: left;
  `,
  middle: () => `
    ${STATS_HEADER_SPACER_STYLES.middle};
    padding-left: 0;
    font-weight: bold;
    text-align: center;
  `,
};

const StatName = styled(StatCell)<StatNameProps>`
  ${(props) => STAT_NAME_STYLES.left(props)};

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[1]}px) {
    ${() => STAT_NAME_STYLES.middle()};
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[2]}px) {
    ${(props) => STAT_NAME_STYLES.left(props)};
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[3]}px) {
    ${() => STAT_NAME_STYLES.middle()};
  }
`;

const StatValue = styled(StatCell)`
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

const shortStatNames: Record<string, string> = {
  '3rd Down Efficiency': '3rd Down Eff.',
  '4th Down Efficiency': '4th Down Eff.',
  'Completions / Attempts': 'Comp. / Att.',
  'Interceptions Thrown': 'Ints. Thrown',
};

export const GameStatsRow: React.FC<{
  readonly statName: string;
  readonly awayTeam: Team;
  readonly homeTeam: Team;
  readonly awayValue: string | number;
  readonly homeValue: string | number;
  readonly isStatsGroupRow?: boolean;
  readonly reverseComparison?: boolean;
}> = ({
  statName,
  awayTeam,
  homeTeam,
  awayValue,
  homeValue,
  isStatsGroupRow = false,
  reverseComparison = false,
}) => {
  let isAwayHighlighted;
  let isHomeHighlighted;

  if (statName === 'Possession') {
    const awayTokens = awayValue.toString().split(':');
    const homeTokens = homeValue.toString().split(':');

    const awayTimeInSeconds = Number(awayTokens[0]) * 60 + Number(awayTokens[1]);
    const homeTimeInSeconds = Number(homeTokens[0]) * 60 + Number(homeTokens[1]);

    isAwayHighlighted = awayTimeInSeconds >= homeTimeInSeconds;
    isHomeHighlighted = awayTimeInSeconds <= homeTimeInSeconds;
  } else if (awayValue.toString().includes(' - ')) {
    const awayTokens = awayValue.toString().split(' - ');
    const homeTokens = homeValue.toString().split(' - ');

    isAwayHighlighted = Number(awayTokens[1]) >= Number(homeTokens[1]);
    isHomeHighlighted = Number(awayTokens[1]) <= Number(homeTokens[1]);
  } else if (awayValue.toString().includes('/')) {
    const awayTokens = awayValue.toString().split(' / ');
    const homeTokens = homeValue.toString().split(' / ');

    const awayPercentage = Number(awayTokens[0]) / Number(awayTokens[1]) || 0;
    const homePercentage = Number(homeTokens[0]) / Number(homeTokens[1]) || 0;

    if (Number(homePercentage) === Number(awayPercentage)) {
      // If the teams' percentages are exactly the same...
      if (Number(homePercentage) === 0) {
        // ... and they are both zero, highlight the team with the smaller second token value, which
        // indicates attempts (0-0 is treated as better than 0-3).
        isAwayHighlighted = Number(awayTokens[1]) <= Number(homeTokens[1]);
        isHomeHighlighted = Number(awayTokens[1]) >= Number(homeTokens[1]);
      } else {
        // ... and they are non-zero, highlight both teams (1-2 is treated the same as 2-4).
        isAwayHighlighted = true;
        isHomeHighlighted = true;
      }
    } else {
      // Otherwise, if the teams' percentages are different, highlight the higher one.
      isAwayHighlighted = Number(awayPercentage) > Number(homePercentage);
      isHomeHighlighted = Number(awayPercentage) < Number(homePercentage);
    }

    awayValue = `${awayValue} (${(awayPercentage * 100).toFixed(0)}%)`;
    homeValue = `${homeValue} (${(homePercentage * 100).toFixed(0)}%)`;
  } else {
    isAwayHighlighted = Number(awayValue) >= Number(homeValue);
    isHomeHighlighted = Number(awayValue) <= Number(homeValue);
  }

  // Swap highlights if the comparison should be reversed (e.g. stats where lower values are better).
  if (reverseComparison) {
    const tempIsAwayHighlighted = isAwayHighlighted;
    isAwayHighlighted = isHomeHighlighted;
    isHomeHighlighted = tempIsAwayHighlighted;
  }

  let awayStyles = {};
  if (isAwayHighlighted) {
    awayStyles = {color: awayTeam.color || DEFAULT_TEAM_COLOR, fontWeight: 'bold'};
  }

  let homeStyles = {};
  if (isHomeHighlighted) {
    homeStyles = {color: homeTeam.color || DEFAULT_TEAM_COLOR, fontWeight: 'bold'};
  }

  // TODO: Make stat names more typesafe.
  const shortenedStatName = shortStatNames[statName] ?? statName;

  // TODO: Replace this with a container query.
  const isMiddle1 = useMediaQuery(
    `(max-width: ${STATS_SECTION_BREAKPOINTS[1]}px) and (min-width: ${
      STATS_SECTION_BREAKPOINTS[2] + 1
    }px)`
  );
  const isMiddle2 = useMediaQuery(`(max-width: ${STATS_SECTION_BREAKPOINTS[3]}px)`);

  return (
    <GameStatsRowWrapper>
      <StatName $isStatsGroupRow={isStatsGroupRow}>
        {isMiddle1 || isMiddle2 ? shortenedStatName : statName}
      </StatName>

      <StatValue style={awayStyles}>{awayValue}</StatValue>
      <StatValue style={homeStyles}>{homeValue}</StatValue>
    </GameStatsRowWrapper>
  );
};
