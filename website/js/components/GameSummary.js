// Libraries
import React from 'react';

import BoxScore from './BoxScore';

import {getLongFormattedDate} from '../utils';

import teams from '../../resources/teams';

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

  return (
    <div className='game-summary-container'>
      <div className='total-score'>
        <div>
          <img src={`${awayTeam.logoUrl || 'http://www.texassports.com/images/logos/Oklahoma.png'}?width=80&height=80&mode=max`} />
        </div>
        <p className='score'>{game.scores.away} - {game.scores.home}</p>
        <div>
          <img src={`${homeTeam.logoUrl || 'http://www.texassports.com/images/logos/Oklahoma.png'}?width=80&height=80&mode=max`} />
        </div>
      </div>
      <div className='details'>
        <p>7:45 PM, {getLongFormattedDate(game.date)}</p>
        <p>{game.location}</p>
      </div>
      <div className='box-score'>
        <div>
          <p></p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>OT 1</p>
          <p>OT 2</p>
          <p>OT 3</p>
          <p>OT 4</p>
          <p>T</p>
        </div>
        <div className='quarter-scores'>
          <p style={awayTeamColorStyles}>{ awayTeam.abbreviation }</p>
          <p>10</p>
          <p>7</p>
          <p>0</p>
          <p>13</p>
          <p>7</p>
          <p>8</p>
          <p>8</p>
          <p>8</p>
          <p style={awayTeamColorStyles}>30</p>
        </div>
        <div className='quarter-scores'>
          <p style={homeTeamColorStyles}>{ homeTeam.abbreviation }</p>
          <p>0</p>
          <p>7</p>
          <p>10</p>
          <p>3</p>
          <p>7</p>
          <p>8</p>
          <p>8</p>
          <p>0</p>
          <p style={homeTeamColorStyles}>20</p>
        </div>
      </div>

      { statsContent }
    </div>
  );
};

GameSummary.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default GameSummary;
