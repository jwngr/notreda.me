import _ from 'lodash';
import React from 'react';
import Media from 'react-media';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Score,
  GameDate,
  Location,
  ScoreResult,
  ScoreTotals,
  OpponentLogo,
  OpponentName,
  AwayGamePrefix,
  OpponentWrapper,
  AwayGameWrapper,
  HomeGameWrapper,
  OpponentRanking,
  OvertimeIndicator,
  ShamrockSeriesLogo,
  TelevisionCoverage,
  OpponentDetailsWrapper,
  DateOpponentDetailsWrapper,
} from './Game.styles';

const Game = ({game, year, index, isSelected}) => {
  let lastColumnContent;
  if ('result' in game) {
    const opponentScore = game.isHomeGame ? game.score.away : game.score.home;
    const notreDameScore = game.isHomeGame ? game.score.home : game.score.away;

    let scoreResult;
    if (notreDameScore > opponentScore) {
      scoreResult = <ScoreResult className="win">W</ScoreResult>;
    } else if (opponentScore > notreDameScore) {
      scoreResult = <ScoreResult className="loss">L</ScoreResult>;
    } else {
      scoreResult = <ScoreResult className="tie">T</ScoreResult>;
    }

    let overtimeContent;
    if (game.numOvertimes) {
      overtimeContent = (
        <OvertimeIndicator>
          <span style={{marginRight: '2px'}}>{game.numOvertimes}</span> OT
        </OvertimeIndicator>
      );
    }

    const scoreTotalClasses = classNames({
      'overtime-game': game.numOvertimes,
    });

    lastColumnContent = (
      <Score>
        {scoreResult}
        <ScoreTotals className={scoreTotalClasses}>
          <p>
            {notreDameScore} - {opponentScore}
          </p>
          {overtimeContent}
        </ScoreTotals>
      </Score>
    );
  } else if ('timestamp' in game || 'fullDate' in game) {
    let time;
    if ('fullDate' in game) {
      time = game.isTimeTbd ? 'TBD' : format(new Date(game.fullDate), 'h:mm A');
    } else {
      time = 'timestamp' in game ? format(game.timestamp, 'h:mm A') : 'TBD';
    }

    lastColumnContent = (
      <TelevisionCoverage>
        <p>{time}</p>
        {game.coverage &&
          game.coverage !== 'TBD' && (
            <img
              alt={`${game.coverage} logo`}
              src={require(`../images/tvLogos/${game.coverage.toLowerCase()}.png`)}
            />
          )}
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
    selected: isSelected,
    homeGame: game.isHomeGame,
    awayGame: !game.isHomeGame,
  });

  let date;
  if ('fullDate' in game) {
    date = format(new Date(game.fullDate), 'MMMM D, YYYY');
  } else if (game.date === 'TBD') {
    date = 'TBD';
  } else {
    date = format(game.timestamp || game.date, 'MMMM D');
  }

  const opponentRanking = game.isHomeGame
    ? _.get(game, 'rankings.away.ap')
    : _.get(game, 'rankings.home.ap');

  const WrapperComponent = game.isHomeGame ? HomeGameWrapper : AwayGameWrapper;

  let shamrockSeriesLogoContent;
  if (game.isShamrockSeries) {
    shamrockSeriesLogoContent = (
      <ShamrockSeriesLogo
        src={require('../images/shamrock.png')}
        alt="Shamrock Series"
        title="Shamrock Series"
      />
    );
  }

  const opponentNameContent = (
    <Media query="(max-width: 768px)">
      {(matches) =>
        matches ? (
          <OpponentName>{game.opponent.shortName || game.opponent.name}</OpponentName>
        ) : (
          <OpponentName>
            {game.opponent.name.length > 20 ? game.opponent.shortName : game.opponent.name}
          </OpponentName>
        )
      }
    </Media>
  );

  let location;
  if (game.location === 'TBD') {
    location = 'TBD';
  } else if (game.location.state) {
    location = `${game.location.city}, ${game.location.state}`;
  } else {
    location = `${game.location.city}, ${game.location.country}`;
  }

  return (
    <WrapperComponent className={gameClassNames} href={`/${year}/${index + 1}/`}>
      <OpponentWrapper>
        <OpponentLogo team={game.opponent} />
        <DateOpponentDetailsWrapper>
          <GameDate>{date}</GameDate>
          <OpponentDetailsWrapper>
            {!game.isHomeGame && <AwayGamePrefix>@</AwayGamePrefix>}
            {opponentRanking && <OpponentRanking>#{opponentRanking}</OpponentRanking>}
            {opponentNameContent}
          </OpponentDetailsWrapper>
        </DateOpponentDetailsWrapper>
      </OpponentWrapper>
      <Location>
        {location}
        {shamrockSeriesLogoContent}
      </Location>
      {lastColumnContent}
    </WrapperComponent>
  );
};

Game.propTypes = {
  game: PropTypes.object.isRequired,
  year: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default Game;
