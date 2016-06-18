// Libraries
import _ from 'lodash';
import React from 'react';

// Presentational components
import Game from './Game';

// Resources
import schedule from '../../resources/schedule';

const DEFAULT_YEAR = 2014;

const YearSchedule = ({ params }) => {
  const currentYear = params.year || DEFAULT_YEAR;
  const games = _.sortBy(schedule[currentYear], '.priority');
  const gamesContent = _.map(games, (game) => {
    return <Game game={ game } key= { game['.priority'] }/>;
  });

  return (
    <div>
      <div className='schedule-container'>
        <p className='current-year'>Fighting Irish Football { currentYear }</p>
        <div className='schedule'>
          { gamesContent }
        </div>
      </div>

      <div className='stats-container'>
      </div>
    </div>
  );
};

YearSchedule.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default YearSchedule;
