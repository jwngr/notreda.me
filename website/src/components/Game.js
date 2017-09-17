import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import {getShortFormattedDate} from '../utils';

import './Game.css';


const Game = ({ game, year, index, selected }) => {
  let prefix;
  let opponentScore;
  let notreDameScore;

  let resultContent = <p className='score'></p>;
  if ('result' in game) {
    if (game.isHomeGame) {
      prefix = '';
      opponentScore = game.score.away;
      notreDameScore = game.score.home;
    } else {
      prefix = '@';
      opponentScore = game.score.home;
      notreDameScore = game.score.away;
    }

    let result;
    if (notreDameScore > opponentScore) {
      result = <span className='win'>W</span>;
    } else if (opponentScore > notreDameScore) {
      result = <span className='loss'>L</span>;
    } else {
      result = <span className='tie'>T</span>;
    }

    resultContent = (
      <p className='score'>{ result } { notreDameScore } - { opponentScore }</p>
    );
  }

  const gameClassNames = classNames({
    game: true,
    selected: selected,
    homeGame: game.isHomeGame,
    awayGame: !game.isHomeGame
  });

  // TODO: remove hard-coded URL when all teams have a logo URL
  return (
    <Link className={ gameClassNames } to={ `/${year}/${index + 1}/` }>
      <img
        src={`${game.opponent.logoUrl || 'http://www.texassports.com/images/logos/Oklahoma.png'}?width=80&height=80&mode=max`}
        alt={`${game.opponent.name} logo`} />
      <div>
        <p className='date'>{ getShortFormattedDate(game.date) }</p>
        <p className='opponent'>{ prefix } { game.opponent.name }</p>
      </div>
      <p className='location'>{ game.location }</p>
      { resultContent }
    </Link>
  );
};

// TODO: finish these
Game.propTypes = {
  game: PropTypes.object.isRequired
};

export default Game;
