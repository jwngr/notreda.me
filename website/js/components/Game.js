// Libraries
import React from 'react';
import classNames from 'classnames';

const Game = ({ game, index, selected, onGameSelected }) => {
  let prefix;
  let opponentScore;
  let notreDameScore;
  if (game.isHomeGame) {
    prefix = 'vs.';
    opponentScore = game.scores.away;
    notreDameScore = game.scores.home;
  } else {
    prefix = '@';
    opponentScore = game.scores.home;
    notreDameScore = game.scores.away;
  }

  const result = (notreDameScore > opponentScore) ?
    <span className='win'>W</span> : <span className='loss'>L</span>;

  const gameClassNames = classNames({
    selected: selected
  });

  return (
    <div className={ gameClassNames } onClick={ onGameSelected.bind(onGameSelected, index) } >
      <p>{ prefix } { game.opponent.school }, { result } { notreDameScore } - { opponentScore }</p>
    </div>
  );
};

// TODO
Game.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default Game;
