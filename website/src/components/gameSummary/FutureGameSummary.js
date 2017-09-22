import React from 'react';
import PropTypes from 'prop-types';

import TeamLogo from '../TeamLogo';

import {getLongFormattedDate} from '../../utils';

import './FutureGameSummary.css';


const FutureGameSummary = ({ game, homeTeam, awayTeam }) => {
  const notreDame = (game.isHomeGame) ? homeTeam : awayTeam;
  const opponent = (game.isHomeGame) ? awayTeam : homeTeam;
  const atOrVs = (game.isHomeGame) ? 'vs' : 'at';

  return (
    <div className='future-game-summary-container'>
      <div className='matchup-teams'>
        <TeamLogo team={notreDame} />
        <p>{atOrVs}</p>
        <TeamLogo team={opponent} />
      </div>
      <div className='matchup-details'>
        <p className='date'>{getLongFormattedDate(game.date)}</p>
        <p className='time'>NBC, 7:45 PM EST</p>
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
