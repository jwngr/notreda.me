// Libraries
import React from 'react';

const Game = ({ game }) => {
  let prefix;
  let opponentScore;
  let notreDameScore;
  if (game.isHomeGame) {
    prefix = 'vs.';
    opponentScore = game.score.away;
    notreDameScore = game.score.home;
  } else {
    prefix = '@';
    opponentScore = game.score.home;
    notreDameScore = game.score.away;
  }

  const winOrLoss = (notreDameScore > opponentScore) ? 'W' : 'L';

  return (
    <div>
      <p>{ game.date } { prefix } { game.opponent.school }, { winOrLoss } { notreDameScore } - { opponentScore }</p>
    </div>
  );
};

Game.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default Game;
