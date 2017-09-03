// Libraries
import _ from 'lodash';
import React from 'react';

// Presentational components
import GameContainer from '../containers/GameContainer';
import GameSummaryContainer from '../containers/GameSummaryContainer';

// Resources
import teams from '../../resources/teams';
import schedule from '../../resources/schedule';

const DEFAULT_YEAR = 2015;

const YearSchedule = ({ params }) => {
  const currentYear = params.year || DEFAULT_YEAR;

  const gamesContent = _.map(schedule[currentYear], (game, index) => {
    const gameClone = _.clone(game);
    gameClone.opponent = {
      name: teams[game.opponent].name,
      nickname: teams[game.opponent].nickname,
      abbreviation: game.opponent
    };

    return (
      <GameContainer key={ index } index={ index } game={ gameClone } />
    );
  });

  return (
    <div className='master-container'>
      <div className='schedule-container'>
        <p className='current-year'>Fighting Irish { currentYear }</p>
        <div className='schedule'>
          { gamesContent }
        </div>
      </div>

      <GameSummaryContainer />
    </div>
  );
};

YearSchedule.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default YearSchedule;
