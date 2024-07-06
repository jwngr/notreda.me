import classNames from 'classnames';
import format from 'date-fns/format';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Media from 'react-media';

import shamrockImage from '../images/shamrock.png';
import {
  AwayGamePrefix,
  AwayGameWrapper,
  DateOpponentDetailsWrapper,
  GameDate,
  HomeGameWrapper,
  Location,
  OpponentDetailsWrapper,
  OpponentLogo,
  OpponentName,
  OpponentRanking,
  OpponentWrapper,
  OvertimeIndicator,
  Score,
  ScoreResult,
  ScoreTotals,
  ShamrockSeriesLogo,
  TelevisionCoverage,
} from './Game.styles';
import {TVNetworkLogo} from './TVNetworkLogo';

export const Game = ({game, year, index, isSelected}) => {
  let lastColumnContent;
  if (game.isCanceled) {
    lastColumnContent = (
      <TelevisionCoverage>
        <p>Canceled</p>
      </TelevisionCoverage>
    );
  } else if (game.isPostponed) {
    lastColumnContent = (
      <TelevisionCoverage>
        <p>Posponed</p>
      </TelevisionCoverage>
    );
  } else if ('result' in game) {
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
  } else if ('fullDate' in game) {
    // TODO(cleanup): remove isTimeTbd logic.
    const time = game.isTimeTbd ? 'TBD' : format(new Date(game.fullDate), 'h:mm a');

    lastColumnContent = (
      <TelevisionCoverage channel={game.coverage && game.coverage.toLowerCase()}>
        <p>{time}</p>
        {game.coverage && game.coverage !== 'TBD' && <TVNetworkLogo coverage={game.coverage} />}
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
    date = new Date(game.fullDate);
  } else if (game.date === 'TBD') {
    date = 'TBD';
  } else {
    date = new Date(game.date);
  }

  // Format the date, making sure to add the year for games which happen in early January for
  // clarity.
  if (date !== 'TBD') {
    if (date.getFullYear() === year) {
      date = format(date, 'MMMM d');
    } else {
      date = format(date, 'MMMM d, yyyy');
    }
  }

  const opponentRanking = game.isHomeGame
    ? _.get(game, 'rankings.away.bcs') ||
      _.get(game, 'rankings.away.cfbPlayoff') ||
      _.get(game, 'rankings.away.ap')
    : _.get(game, 'rankings.home.bcs') ||
      _.get(game, 'rankings.home.cfbPlayoff') ||
      _.get(game, 'rankings.home.ap');

  const WrapperComponent = game.isHomeGame ? HomeGameWrapper : AwayGameWrapper;

  let shamrockSeriesLogoContent;
  if (game.isShamrockSeries) {
    shamrockSeriesLogoContent = (
      <ShamrockSeriesLogo src={shamrockImage} alt="Shamrock Series" title="Shamrock Series" />
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
    <WrapperComponent className={gameClassNames} to={`/${year}/${index + 1}/`}>
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
