import React from 'react';
import PropTypes from 'prop-types';

import GameStats from './GameStats';
import LineScore from './LineScore';

import {getLongFormattedDate} from '../../utils';

import './CompletedGameSummary.css';


const genericTeamLogoUrl = 'http://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-football-college.png&h=80&w=80&scale=crop&cquality=40';

const CompletedGameSummary = ({ game, homeTeam, awayTeam }) => (
  <div className='game-summary-container'>
    <div className='total-score'>
      <div>
        <img src={awayTeam.logoUrl || genericTeamLogoUrl} alt={`${awayTeam.name} logo`} />
      </div>
      <p className='score'>{game.score.away} - {game.score.home}</p>
      <div>
        <img src={homeTeam.logoUrl || genericTeamLogoUrl} alt={`${homeTeam.name} logo`}/>
      </div>
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
