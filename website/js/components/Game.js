// Libraries
import React from 'react';
import classNames from 'classnames';

import {getShortFormattedDate} from '../utils';

const Game = ({ game, index, selected, onGameSelected }) => {
  let prefix;
  let opponentScore;
  let notreDameScore;
  if (game.isHomeGame) {
    prefix = '';
    opponentScore = game.scores.away;
    notreDameScore = game.scores.home;
  } else {
    prefix = '@';
    opponentScore = game.scores.home;
    notreDameScore = game.scores.away;
  }

  const result = (notreDameScore > opponentScore) ?
    <span className='win'>W</span> :
    <span className='loss'>L</span>;

  const gameClassNames = classNames({
    game: true,
    selected: selected,
    homeGame: game.isHomeGame,
    awayGame: !game.isHomeGame
  });

  return (
    <div className={ gameClassNames } onClick={ onGameSelected.bind(onGameSelected, index) } >
      <img src='http://www.texassports.com/images/logos/Oklahoma.png?width=80&height=80&mode=max' />
      <div>
        <p className='date'>{ getShortFormattedDate(game.date) }</p>
        <p className='opponent'>{ prefix } { game.opponent.name }</p>
      </div>
      <p className='location'>{ game.location }</p>
      <p className='score'>{ result } { notreDameScore } - { opponentScore }</p>
    </div>
  );
};

// TODO
Game.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default Game;
