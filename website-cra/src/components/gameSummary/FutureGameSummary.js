import React from 'react';
import PropTypes from 'prop-types';

import {getLongFormattedDate} from '../../utils';

import './FutureGameSummary.css';


const genericTeamLogoUrl = 'http://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-football-college.png&h=80&w=80&scale=crop&cquality=40';

const FutureGameSummary = ({ game, homeTeam, awayTeam }) => (
  <div className='game-summary-container'>
    <div className='total-score'>
      <div>
        <img src={awayTeam.logoUrl || genericTeamLogoUrl} alt={`${awayTeam.name} logo`} />
      </div>
      <p className='score'>vs</p>
      <div>
        <img src={homeTeam.logoUrl || genericTeamLogoUrl} alt={`${homeTeam.name} logo`}/>
      </div>
    </div>
    <div className='details'>
      <p>7:45 PM, {getLongFormattedDate(game.date)}</p>
      <p>{game.location}</p>
    </div>
  </div>
);

FutureGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default FutureGameSummary;
