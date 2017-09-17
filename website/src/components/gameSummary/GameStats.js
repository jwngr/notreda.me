import React from 'react';
import PropTypes from 'prop-types';

import './GameStats.css';


const GameStats = ({ stats, homeTeam, awayTeam }) => {
  const homeTeamColorStyles = {
    color: homeTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  const awayTeamColorStyles = {
    color: awayTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  const statsNames = [
    { key: 'firstDowns', name: 'First Downs'},
    { key: 'plays', name: 'Plays' },
    { key: 'totalYards', name: 'Yards' },
    { key: 'passYards', name: 'Pass Yards' },
    { key: 'rushYards', name: 'Rush Yards' },
    { key: 'penalties', name: 'Penalties' },
    { key: 'turnovers', name: 'Turnovers' },
    { key: 'possession', name: 'Possession' }
  ];

  const statsContent = statsNames.map(({key: statKey, name: statName}) => {
    const awayTeamValue = stats.away[statKey];
    const homeTeamValue = stats.home[statKey];

    let awayTeamStyles;
    if (awayTeamValue >= homeTeamValue) {
      awayTeamStyles = {
        color: awayTeam.color || 'blue', // TODO: remove || once all teams have a color
        fontWeight: 'bold'
      };
    }

    let homeTeamStyles;
    if (homeTeamValue >= awayTeamValue) {
      homeTeamStyles = {
        color: homeTeam.color || 'blue', // TODO: remove || once all teams have a color
        fontWeight: 'bold'
      };
    }

    return (
      <div key={statKey}>
        <p>{statName}</p>
        <p style={awayTeamStyles}>{ awayTeamValue }</p>
        <p style={homeTeamStyles}>{ homeTeamValue }</p>
      </div>
    );
  });

  return (
    <div className='game-stats'>
      <div>
        <p></p>
        <p style={awayTeamColorStyles}>{ awayTeam.nickname }</p>
        <p style={homeTeamColorStyles}>{ homeTeam.nickname }</p>
      </div>
      {statsContent}
    </div>
  );
};

GameStats.propTypes = {
  stats: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default GameStats;
