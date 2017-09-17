import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import GameContainer from '../containers/GameContainer';
import GameSummaryContainer from '../containers/GameSummaryContainer';

import teams from '../resources/teams';
import schedule from '../resources/schedule';

import './YearSchedule.css';


const YearSchedule = ({selectedYear}) => {
  const gamesContent = _.map(schedule[selectedYear], (game, index) => {
    const gameClone = _.clone(game);

    gameClone.opponent = teams[game.opponentId];
    gameClone.opponent.abbreviation = game.opponentId;

    return (
      <GameContainer key={ index } index={ index } game={ gameClone } />
    );
  });

  return (
    <div className='master-container'>
      <div className='schedule-container'>
        <p className='current-year'>Fighting Irish { selectedYear }</p>
        <div className='schedule'>
          { gamesContent }
        </div>
      </div>

      <GameSummaryContainer />
    </div>
  );
};

YearSchedule.propTypes = {
  selectedYear: PropTypes.number.isRequired
};

export default YearSchedule;
