import _ from 'lodash';
import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {StatName, StatValue, GameStatsRowWrapper} from './index.styles';

import {getDefaultTeamColor} from '../../../../utils';

const shortStatNames = {
  '3rd Down Efficiency': '3rd Down Eff.',
  '4th Down Efficiency': '4th Down Eff.',
  'Completions / Attempts': 'Comp. / Att.',
  'Interceptions Thrown': 'Ints. Thrown',
};

const GameStatsRow = ({
  statName,
  awayTeam,
  homeTeam,
  awayValue,
  homeValue,
  isHeaderRow,
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
      color: awayTeam.color || getDefaultTeamColor(),
      fontWeight: 'bold',
    };
  }

  let homeStyles = {};
  if (isHomeHighlighted) {
    homeStyles = {
      color: homeTeam.color || getDefaultTeamColor(),
      fontWeight: 'bold',
    };
  }

  const gameStatsRowClassNames = classNames({
    'game-stats-header-row': isHeaderRow,
  });

  return (
    <GameStatsRowWrapper className={gameStatsRowClassNames}>
      <Media query="(max-width: 1024px)">
        {(matches) =>
          matches ? (
            <StatName>{shortStatNames[statName] || statName}</StatName>
          ) : (
            <StatName>{statName}</StatName>
          )
        }
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
  isHeaderRow: PropTypes.bool,
  reverseComparison: PropTypes.bool,
};

export default GameStatsRow;
