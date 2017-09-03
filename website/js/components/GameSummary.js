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

  let statsContent;
  if ('stats' in game) {
    statsContent = (
      <div className='game-stats'>
        <div>
          <p>{ awayTeam.nickname }</p>
          <p>vs.</p>
          <p>{ homeTeam.nickname }</p>
        </div>
        <div>
          <p>{ game.stats.firstDowns.away }</p>
          <p>First Downs</p>
          <p>{ game.stats.firstDowns.home }</p>
        </div>
        <div>
          <p>56</p>
          <p>Total Plays</p>
          <p>62</p>
        </div>
        <div>
          <p>{ game.stats.totalYards.away }</p>
          <p>Total Yards</p>
          <p>{ game.stats.totalYards.home }</p>
        </div>
        <div>
          <p>{ game.stats.passYards.away }</p>
          <p>Pass Yards</p>
          <p>{ game.stats.passYards.home }</p>
        </div>
        <div>
          <p>{ game.stats.rushYards.away }</p>
          <p>Rush Yards</p>
          <p>{ game.stats.rushYards.home }</p>
        </div>
        <div>
          <p>{ game.stats.penalties.away }</p>
          <p>Penalties</p>
          <p>{ game.stats.penalties.home }</p>
        </div>
        <div>
          <p>{ game.stats.possession.away }</p>
          <p>Possesion</p>
          <p>{ game.stats.possession.home }</p>
        </div>
        <div>
          <p>{ game.stats.turnovers.away }</p>
          <p>Turnovers</p>
          <p>{ game.stats.turnovers.home }</p>
        </div>
      </div>
    );
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

      { statsContent }
    </div>
  );
};

GameSummary.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default GameSummary;
