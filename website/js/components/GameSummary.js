// Libraries
import React from 'react';

import BoxScore from './BoxScore';

import {getLongFormattedDate} from '../utils';

import teams from '../../resources/teams';

const genericTeamLogoUrl = 'http://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-football-college.png&h=80&w=80&scale=crop&cquality=40';

const GameSummary = ({ game }) => {
  const notreDame = teams.ND;
  notreDame.abbreviation = 'ND';

  let homeTeam;
  let awayTeam;
  if (game.isHomeGame) {
    homeTeam = notreDame;
    awayTeam = game.opponent;
  } else {
    homeTeam = game.opponent;
    awayTeam = notreDame;
  }

  const homeTeamColorStyles = {
    color: homeTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  const awayTeamColorStyles = {
    color: awayTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  let statsContent;
  if ('stats' in game) {
    const stats = [
      { key: 'firstDowns', name: 'First Downs'},
      { key: 'plays', name: 'Plays' },
      { key: 'totalYards', name: 'Yards' },
      { key: 'passYards', name: 'Pass Yards' },
      { key: 'rushYards', name: 'Rush Yards' },
      { key: 'penalties', name: 'Penalties' },
      { key: 'turnovers', name: 'Turnovers' },
      { key: 'possession', name: 'Possession' }
    ];

    statsContent = stats.map(({key: statKey, name: statName}) => {
      let awayTeamValue;
      let homeTeamValue;
      // TODO: remove this once I have all the stats
      if (!(statKey in game.stats)) {
        awayTeamValue = 67;
        homeTeamValue = 42;
      } else {
        awayTeamValue = game.stats[statKey].away;
        homeTeamValue = game.stats[statKey].home;
      }

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

    statsContent = (
      <div className='game-stats'>
        <div>
          <p></p>
          <p style={awayTeamColorStyles}>{ awayTeam.nickname }</p>
          <p style={homeTeamColorStyles}>{ homeTeam.nickname }</p>
        </div>
        {statsContent}
      </div>
    );
  }

  const scores = {
    home: [10, 7, 0, 13, 7, 3, 8, 8],
    away: [0, 7, 10, 3, 7, 3, 8, 0]
  };

  return (
    <div className='game-summary-container'>
      <div className='total-score'>
        <div>
          <img src={awayTeam.logoUrl || genericTeamLogoUrl} />
        </div>
        <p className='score'>{game.scores.away} - {game.scores.home}</p>
        <div>
          <img src={homeTeam.logoUrl || genericTeamLogoUrl} />
        </div>
      </div>
      <div className='details'>
        <p>7:45 PM, {getLongFormattedDate(game.date)}</p>
        <p>{game.location}</p>
      </div>

      <BoxScore scores={scores} homeTeam={homeTeam} awayTeam={awayTeam} />

      { statsContent }
    </div>
  );
};

GameSummary.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default GameSummary;
