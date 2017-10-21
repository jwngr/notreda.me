import React from 'react';
import format from 'date-fns/format';
import PropTypes from 'prop-types';

import TeamLogo from '../TeamLogo';

import './FutureGameSummary.css';


const FutureGameSummary = ({ game, homeTeam, awayTeam }) => {
  const notreDame = (game.isHomeGame) ? homeTeam : awayTeam;
  const opponent = (game.isHomeGame) ? awayTeam : homeTeam;
  const atOrVs = (game.isHomeGame) ? 'vs' : 'at';

  const date = format(game.timestamp || game.date, 'dddd, MMMM D YYYY');
  let time;
  if ('timestamp' in game) {
    time = format(game.timestamp || game.date, 'h:mm A');
  } else {
    time = 'TBD';
  }

  return (
    <div className='future-game-summary-container'>
      <div className='matchup-teams'>
        <TeamLogo team={notreDame} />
        <p>{atOrVs}</p>
        <TeamLogo team={opponent} />
      </div>
      <div className='matchup-details'>
        <p className='date'>{date}</p>
        <p className='time'>{game.coverage}, {time}</p>
        <p className='location'>{game.location}</p>
      </div>
    </div>
  );
};

FutureGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default FutureGameSummary;
