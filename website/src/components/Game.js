import _ from 'lodash';
import React from 'react';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import './Game.css';


const Game = ({ game, year, index, selected }) => {
  let lastColumnContent;
  if ('result' in game) {
    const opponentScore = game.isHomeGame ? game.score.away : game.score.home;
    const notreDameScore = game.isHomeGame ? game.score.home : game.score.away;

    let result;
    if (notreDameScore > opponentScore) {
      result = <span className='win'>W</span>;
    } else if (opponentScore > notreDameScore) {
      result = <span className='loss'>L</span>;
    } else {
      result = <span className='tie'>T</span>;
    }

    lastColumnContent = (
      <p className='score'>{ result } { notreDameScore } - { opponentScore }</p>
    );
  } else if ('timestamp' in game) {
    const time = ('timestamp' in game) ? format(game.timestamp, 'h:mm A') : 'TBD';

    lastColumnContent = (
      <div className='coverage'>
        <p>{time}</p>
        <img
          alt={`${game.coverage} logo`}
          src={require(`../images/tvLogos/${game.coverage.toLowerCase()}.png`)}
        />
      </div>
    );
  } else {
    lastColumnContent = <p className='coverage'>TBD</p>;
  }

  const gameClassNames = classNames({
    game: true,
    selected: selected,
    homeGame: game.isHomeGame,
    awayGame: !game.isHomeGame
  });

  let prefix = game.isHomeGame ? '' : '@';

  let date = format(game.timestamp || game.date, 'MMMM D');

  const opponentRanking = game.isHomeGame ? _.get(game, 'rankings.away.ap') : _.get(game, 'rankings.home.ap');
  let opponentRankingContent;
  if (opponentRanking) {
    opponentRankingContent = <p className='opponent-ranking'>#{opponentRanking}</p>;
  }

  // TODO: remove hard-coded URL when all teams have a logo URL
  return (
    <Link className={gameClassNames} to={`/${year}/${index + 1}/`}>
      <img
        className='opponent-logo'
        src={`${game.opponent.logoUrl || 'http://www.texassports.com/images/logos/Oklahoma.png'}?width=80&height=80&mode=max`}
        alt={`${game.opponent.name} logo`} />
      <div>
        <p className='date'>{date}</p>
        <div className='opponent'>
          <p>{prefix}</p>
          {opponentRankingContent}
          <p className='opponent-name'>{game.opponent.name}</p>
        </div>
      </div>
      <p className='location'>{game.location}</p>
      {lastColumnContent}
    </Link>
  );
};

// TODO: finish these
Game.propTypes = {
  game: PropTypes.object.isRequired
};

export default Game;
