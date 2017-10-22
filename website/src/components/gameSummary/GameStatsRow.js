import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './GameStatsRow.css';


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

    const awayTimeInSeconds = (Number(awayTokens[0]) * 60) + Number(awayTokens[1]);
    const homeTimeInSeconds = (Number(homeTokens[0]) * 60) + Number(homeTokens[1]);

    isAwayHighlighted = (awayTimeInSeconds >= homeTimeInSeconds);
    isHomeHighlighted = (awayTimeInSeconds <= homeTimeInSeconds);
  } else if (_.includes(awayValue, ' - ')) {
    const awayTokens = awayValue.split(' - ');
    const homeTokens = homeValue.split(' - ');

    isAwayHighlighted = (Number(awayTokens[1]) >= Number(homeTokens[1]));
    isHomeHighlighted = (Number(awayTokens[1]) <= Number(homeTokens[1]));
  } else if (_.includes(awayValue, '/')) {
    const awayTokens = awayValue.split(' / ');
    const homeTokens = homeValue.split(' / ');

    const awayPercentage = (Number(awayTokens[0]) / Number(awayTokens[1])) || 0;
    const homePercentage = (Number(homeTokens[0]) / Number(homeTokens[1])) || 0;

    isAwayHighlighted = (Number(awayPercentage) >= Number(homePercentage));
    isHomeHighlighted = (Number(awayPercentage) <= Number(homePercentage));

    awayValue = `${awayValue} (${(awayPercentage * 100).toFixed(0)}%)`;
    homeValue = `${homeValue} (${(homePercentage * 100).toFixed(0)}%)`;
  } else {
    isAwayHighlighted = (Number(awayValue) >= Number(homeValue));
    isHomeHighlighted = (Number(awayValue) <= Number(homeValue));
  }


  // Swap highlights if the comparison should be reverse (e.g. stats where lower values are better)
  if (reverseComparison) {
    const tempIsAwayHighlighted = isAwayHighlighted;
    isAwayHighlighted = isHomeHighlighted;
    isHomeHighlighted = tempIsAwayHighlighted;
  }

  let awayStyles = {};
  if (isAwayHighlighted) {
    awayStyles = {
      color: awayTeam.color || 'blue' // TODO: remove || once all teams have a color
    };
  }

  let homeStyles = {};
  if (isHomeHighlighted) {
    homeStyles = {
      color: homeTeam.color || 'blue' // TODO: remove || once all teams have a color
    };
  }

  const gameStatsRowClassNames = classNames({
    'game-stats-row': true,
    'game-stats-header-row': isHeaderRow,
  });

  return (
    <div className={gameStatsRowClassNames}>
      <p>{statName}</p>
      <p style={awayStyles}>{awayValue}</p>
      <p style={homeStyles}>{homeValue}</p>
    </div>
  );
};

GameStatsRow.propTypes = {
  statName: PropTypes.string.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
  awayValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  homeValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  isHeaderRow: PropTypes.bool,
  reverseComparison: PropTypes.bool,
};

export default GameStatsRow;
