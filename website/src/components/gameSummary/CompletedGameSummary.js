import React from 'react';
import PropTypes from 'prop-types';

import TeamLogo from '../TeamLogo';
import GameStats from './GameStats';
import LineScore from './LineScore';

import {getLongFormattedDate} from '../../utils';

import './CompletedGameSummary.css';


const CompletedGameSummary = ({ game, homeTeam, awayTeam }) => (
  <div className='completed-game-summary-container'>
    <div className='total-score'>
      <TeamLogo team={awayTeam} />
      <p>{game.score.away} - {game.score.home}</p>
      <TeamLogo team={homeTeam} />
    </div>

    <div className='details'>
      <p>7:45 PM, {getLongFormattedDate(game.date)}</p>
      <p>{game.location}</p>
    </div>

    <LineScore lineScores={game.linescores} homeTeam={homeTeam} awayTeam={awayTeam} />

    <GameStats stats={game.stats} awayTeam={awayTeam} homeTeam={homeTeam} />
  </div>
);

CompletedGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default CompletedGameSummary;
