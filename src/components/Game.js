import _ from 'lodash';
import React from 'react';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

import {
  AwayGamePrefix,
  GameDate,
  DateOpponentWrapper,
  Location,
  OpponentLogo,
  OpponentName,
  OpponentRanking,
  OpponentWrapper,
  Score,
  TelevisionCoverage,
  Wrapper,
  HomeGameWrapper,
  AwayGameWrapper,
  SelectedGameWrapper,
} from './Game.styles';

const Game = ({game, year, index, selected}) => {
  let lastColumnContent;
  if ('result' in game) {
    const opponentScore = game.isHomeGame ? game.score.away : game.score.home;
    const notreDameScore = game.isHomeGame ? game.score.home : game.score.away;

    let result;
    if (notreDameScore > opponentScore) {
      result = <span className="win">W</span>;
    } else if (opponentScore > notreDameScore) {
      result = <span className="loss">L</span>;
    } else {
      result = <span className="tie">T</span>;
    }

    lastColumnContent = (
      <Score>
        {result} {notreDameScore} - {opponentScore}
      </Score>
    );
  } else if ('timestamp' in game) {
    const time = 'timestamp' in game ? format(game.timestamp, 'h:mm A') : 'TBD';

    lastColumnContent = (
      <TelevisionCoverage>
        <p>{time}</p>
        <img
          alt={`${game.coverage} logo`}
          src={require(`../images/tvLogos/${game.coverage.toLowerCase()}.png`)}
        />
      </TelevisionCoverage>
    );
  } else {
    lastColumnContent = (
      <TelevisionCoverage>
        <p>TBD</p>
      </TelevisionCoverage>
    );
  }

  const gameClassNames = classNames({
    selected: selected,
    homeGame: game.isHomeGame,
    awayGame: !game.isHomeGame,
  });

  const gameType = selected ? 'selected' : game.isHomeGame ? 'home' : 'away';

  let date = format(game.timestamp || game.date, 'MMMM D');

  const opponentRanking = game.isHomeGame
    ? _.get(game, 'rankings.away.ap')
    : _.get(game, 'rankings.home.ap');

  const WrapperComponent = game.isHomeGame ? HomeGameWrapper : AwayGameWrapper;

  // TODO: remove hard-coded URL when all teams have a logo URL
  return (
    <WrapperComponent className={gameClassNames} type={gameType} to={`/${year}/${index + 1}/`}>
      <OpponentLogo
        src={`${game.opponent.logoUrl ||
          'http://www.texassports.com/images/logos/Oklahoma.png'}?width=80&height=80&mode=max`}
        alt={`${game.opponent.name} logo`}
      />
      <DateOpponentWrapper>
        <GameDate>{date}</GameDate>
        <OpponentWrapper>
          {!game.isHomeGame && <AwayGamePrefix>@</AwayGamePrefix>}
          {opponentRanking && <OpponentRanking>#{opponentRanking}</OpponentRanking>}
          <OpponentName>{game.opponent.name}</OpponentName>
        </OpponentWrapper>
      </DateOpponentWrapper>
      <Location>{game.location}</Location>
      {lastColumnContent}
    </WrapperComponent>
  );
};

// TODO: finish these
Game.propTypes = {
  game: PropTypes.object.isRequired,
};

export default Game;
