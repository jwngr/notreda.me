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
          <p>20</p>
          <p>First Downs</p>
          <p>18</p>
        </div>
        <div>
          <p>59</p>
          <p>Total Plays</p>
          <p>50</p>
        </div>
        <div>
          <p>386</p>
          <p>Total Yars</p>
          <p>197</p>
        </div>
        <div>
          <p>315</p>
          <p>Passing Yards</p>
          <p>71</p>
        </div>
        <div>
          <p>71</p>
          <p>Rushing Yards</p>
          <p>126</p>
        </div>
        <div>
          <p>6 / 54</p>
          <p>Penalties</p>
          <p>7 / 76</p>
        </div>
        <div>
          <p>26:52</p>
          <p>Possesion</p>
          <p>33:08</p>
        </div>
        <div>
          <p>3</p>
          <p>Turnovers</p>
          <p>2</p>
        </div>
      </div>
    </div>
  );
};

GameSummary.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default GameSummary;
