// Libraries
import React from 'react';

const GameSummary = ({ game }) => {
  const notreDame = {
    name: 'Notre Dame',
    nickname: 'Irish',
    abbreviation: 'ND'
  };

  let homeTeam;
  let awayTeam;
  if (game.isHomeGame) {
    homeTeam = notreDame;
    awayTeam = game.opponent;
  } else {
    homeTeam = game.opponent;
    awayTeam = notreDame;
  }

  return (
    <div className='game-summary-container'>
      <div className='box-score'>
        <div>
          <p></p>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>T</p>
        </div>
        <div className='quarter-scores'>
          <p>{ awayTeam.abbreviation }</p>
          <p>10</p>
          <p>7</p>
          <p>0</p>
          <p>13</p>
          <p>30</p>
        </div>
        <div className='quarter-scores'>
          <p>{ homeTeam.abbreviation }</p>
          <p>0</p>
          <p>7</p>
          <p>10</p>
          <p>3</p>
          <p>20</p>
        </div>
      </div>

      <div className='game-stats'>
        <div>
          <p>{ awayTeam.nickname }</p>
          <p>vs.</p>
          <p>{ homeTeam.nickname }</p>
        </div>
        <div>
          <p>{ game.stats['1st Downs'].away }</p>
          <p>First Downs</p>
          <p>{ game.stats['1st Downs'].home }</p>
        </div>
        <div>
          <p>56</p>
          <p>Total Plays</p>
          <p>62</p>
        </div>
        <div>
          <p>{ game.stats['Total Yards'].away }</p>
          <p>Total Yards</p>
          <p>{ game.stats['Total Yards'].home }</p>
        </div>
        <div>
          <p>{ game.stats.Passing.away }</p>
          <p>Passing Yards</p>
          <p>{ game.stats.Passing.home }</p>
        </div>
        <div>
          <p>{ game.stats.Rushing.away }</p>
          <p>Rushing Yards</p>
          <p>{ game.stats.Rushing.home }</p>
        </div>
        <div>
          <p>{ game.stats.Penalties.away }</p>
          <p>Penalties</p>
          <p>{ game.stats.Penalties.home }</p>
        </div>
        <div>
          <p>{ game.stats.Possession.away }</p>
          <p>Possesion</p>
          <p>{ game.stats.Possession.home }</p>
        </div>
        <div>
          <p>{ game.stats.Turnovers.away }</p>
          <p>Turnovers</p>
          <p>{ game.stats.Turnovers.home }</p>
        </div>
      </div>
    </div>
  );
};

GameSummary.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default GameSummary;
