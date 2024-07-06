import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Media from 'react-media';

import {DEFAULT_TEAM_COLOR} from '../../../../../lib/constants';
import {STATS_SECTION_BREAKPOINTS} from '../index.styles';
import {GameStatsRowWrapper, StatName, StatValue} from './index.styles';

const shortStatNames = {
  '3rd Down Efficiency': '3rd Down Eff.',
  '4th Down Efficiency': '4th Down Eff.',
  'Completions / Attempts': 'Comp. / Att.',
  'Interceptions Thrown': 'Ints. Thrown',
};

export const GameStatsRow = ({
  statName,
  awayTeam,
  homeTeam,
  awayValue,
  homeValue,
  isStatsGroupRow,
  reverseComparison,
}) => {
  let isAwayHighlighted;
  let isHomeHighlighted;

  if (statName === 'Possession') {
    const awayTokens = awayValue.split(':');
    const homeTokens = homeValue.split(':');

    const awayTimeInSeconds = Number(awayTokens[0]) * 60 + Number(awayTokens[1]);
    const homeTimeInSeconds = Number(homeTokens[0]) * 60 + Number(homeTokens[1]);

    isAwayHighlighted = awayTimeInSeconds >= homeTimeInSeconds;
    isHomeHighlighted = awayTimeInSeconds <= homeTimeInSeconds;
  } else if (_.includes(awayValue, ' - ')) {
    const awayTokens = awayValue.split(' - ');
    const homeTokens = homeValue.split(' - ');

    isAwayHighlighted = Number(awayTokens[1]) >= Number(homeTokens[1]);
    isHomeHighlighted = Number(awayTokens[1]) <= Number(homeTokens[1]);
  } else if (_.includes(awayValue, '/')) {
    const awayTokens = awayValue.split(' / ');
    const homeTokens = homeValue.split(' / ');

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
    awayStyles = {
      color: awayTeam.color || DEFAULT_TEAM_COLOR,
      fontWeight: 'bold',
    };
  }

  let homeStyles = {};
  if (isHomeHighlighted) {
    homeStyles = {
      color: homeTeam.color || DEFAULT_TEAM_COLOR,
      fontWeight: 'bold',
    };
  }

  return (
    <GameStatsRowWrapper>
      {/* Show shortened stat names when the stat names column is in the middle. */}
      <Media
        queries={{
          middle1: `(max-width: ${STATS_SECTION_BREAKPOINTS[1]}px) and (min-width: ${
            STATS_SECTION_BREAKPOINTS[2] + 1
          }px)`,
          middle2: `(max-width: ${STATS_SECTION_BREAKPOINTS[3]}px)`,
        }}
      >
        {(matches) => (
          <StatName isStatsGroupRow={isStatsGroupRow}>
            {matches.middle1 || matches.middle2 ? shortStatNames[statName] || statName : statName}
          </StatName>
        )}
      </Media>

      <StatValue style={awayStyles}>{awayValue}</StatValue>
      <StatValue style={homeStyles}>{homeValue}</StatValue>
    </GameStatsRowWrapper>
  );
};

GameStatsRow.propTypes = {
  statName: PropTypes.string.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
  awayValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  homeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isStatsGroupRow: PropTypes.bool,
  reverseComparison: PropTypes.bool,
};
