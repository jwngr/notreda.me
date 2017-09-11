// Libraries
import React from 'react';

import LineScore from './LineScore';

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

  let scoreContent = <p className='score'>vs</p>;
  let statsContent;
  let lineScoreContent;
  if ('result' in game) {
    scoreContent = (
      <p className='score'>{game.score.away} - {game.score.home}</p>
    );

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
      const awayTeamValue = game.stats.away[statKey];
      const homeTeamValue = game.stats.home[statKey];

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

    // TODO: remove hardcoded line scores when
    let lineScore = {
      home: [10, 7, 0, 13, 7, 3, 8, 8],
      away: [0, 7, 10, 3, 7, 3, 8, 0]
    };

    if (game.linescores.home.length !== 0) {
      lineScore = game.linescores;
    }

    lineScoreContent = (
      <LineScore scores={lineScore} homeTeam={homeTeam} awayTeam={awayTeam} />
    );
  }

  return (
    <div className='game-summary-container'>
      <div className='total-score'>
        <div>
          <img src={awayTeam.logoUrl || genericTeamLogoUrl} />
        </div>
        { scoreContent }
        <div>
          <img src={homeTeam.logoUrl || genericTeamLogoUrl} />
        </div>
      </div>
      <div className='details'>
        <p>7:45 PM, {getLongFormattedDate(game.date)}</p>
        <p>{game.location}</p>
      </div>

      { lineScoreContent }

      { statsContent }
    </div>
  );
};

GameSummary.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default GameSummary;
