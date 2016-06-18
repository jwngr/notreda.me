// Libraries
import _ from 'lodash';
import React from 'react';

const Game = ({ game }) => {
  game.notreDameScore = _.random(3, 50);
  game.opponentScore = _.random(3, 50);
  const prefix = game.isHomeGame ? 'vs.' : '@';
  const winOrLoss = (game.notreDameScore > game.opponentScore) ? 'W' : 'L';

  return (
    <div>
      <p>{ game.date } { prefix } { game.opponent }, { winOrLoss } { game.notreDameScore } - { game.opponentScore }</p>
    </div>
  );
};

Game.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default Game;
