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
  let awayHighlighted;
  let homeHighlighted;
  if (_.includes(awayValue, '-')) {
    const awayTokens = awayValue.split('-');
    const homeTokens = homeValue.split('-');
    const awayPercentage = Number(awayTokens[0]) / Number(awayTokens[1]);
    const homePercentage = Number(homeTokens[0]) / Number(homeTokens[1]);

    awayHighlighted = (Number(awayPercentage) >= Number(homePercentage));
    homeHighlighted = (Number(awayPercentage) <= Number(homePercentage));
  } else {
    awayHighlighted = (Number(awayValue) >= Number(homeValue));
    homeHighlighted = (Number(awayValue) <= Number(homeValue));
  }

  // Swap highlights if the comparison should be reverse (e.g. stats where lower values are better)
  if (reverseComparison) {
    const tempAwayHighlighted = awayHighlighted;
    awayHighlighted = homeHighlighted;
    homeHighlighted = tempAwayHighlighted;
  }

  // Special-case fumbles stat
  if (statName === 'Fumbles-Lost') {
    const awayTokens = awayValue.split('-');
    const homeTokens = homeValue.split('-');
    awayHighlighted = (Number(awayTokens[1]) >= Number(homeTokens[1]));
    homeHighlighted = (Number(awayTokens[1]) <= Number(homeTokens[1]));
  }

  // Special-case possession stat
  if (statName === 'Possession') {
    const awayTokens = awayValue.split(':');
    const homeTokens = homeValue.split(':');
    const awayTimeInSeconds = (Number(awayTokens[0]) * 60) + Number(awayTokens[1]);
    const homeTimeInSeconds = (Number(homeTokens[0]) * 60) + Number(homeTokens[1]);

    awayHighlighted = (awayTimeInSeconds >= homeTimeInSeconds);
    homeHighlighted = (awayTimeInSeconds <= homeTimeInSeconds);
  }

  let awayStyles = {};
  if (awayHighlighted) {
    awayStyles = {
      color: awayTeam.color || 'blue' // TODO: remove || once all teams have a color
    };
  }

  let homeStyles = {};
  if (homeHighlighted) {
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
  awayValue: PropTypes.string.isRequired,
  homeValue: PropTypes.string.isRequired,
  isHeaderRow: PropTypes.bool,
  reverseComparison: PropTypes.bool,
};

export default GameStatsRow;
