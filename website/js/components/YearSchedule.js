// Libraries
import _ from 'lodash';
import React from 'react';

// Presentational components
import GameContainer from '../containers/GameContainer';
import GameSummaryContainer from '../containers/GameSummaryContainer';

// Resources
import schedule from '../../resources/schedule';

const DEFAULT_YEAR = 2015;

const YearSchedule = ({ params }) => {
  const currentYear = params.year || DEFAULT_YEAR;

  const gamesContent = _.map(schedule[currentYear], (game, index) => {
    return (
      <GameContainer key={ index } index={ index } game={ game } />
    );
  });

  return (
    <div>
      <div className='schedule-container'>
        <p className='current-year'>Fighting Irish Football { currentYear }</p>
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
