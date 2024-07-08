import {format} from 'date-fns/format';
import React from 'react';
import Media from 'react-media';

import shamrockImage from '../images/shamrock.png';
import {GameInfo, GameResult, Team, TeamId, TVNetwork} from '../models';
import teamsJson from '../resources/teams.json';
import {
  AwayGamePrefix,
  DateOpponentDetailsWrapper,
  GameDate,
  GameWrapper,
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

const teams = teamsJson as Record<TeamId, Team>;

export const Game: React.FC<{
  readonly game: GameInfo;
  readonly season: number;
  readonly index: number;
  readonly isSelected: boolean;
}> = ({game, season, index, isSelected}) => {
  let lastColumnContent: React.ReactNode;
  if (game.isCanceled) {
    lastColumnContent = (
      <TelevisionCoverage $network={TVNetwork.Unknown}>
        <p>Canceled</p>
      </TelevisionCoverage>
    );
  } else if (game.isPostponed) {
    lastColumnContent = (
      <TelevisionCoverage $network={TVNetwork.Unknown}>
        <p>Posponed</p>
      </TelevisionCoverage>
    );
  } else if (game.result && game.score) {
    const opponentScore = game.isHomeGame ? game.score.away : game.score.home;
    const notreDameScore = game.isHomeGame ? game.score.home : game.score.away;

    let scoreResult;
    if (notreDameScore > opponentScore) {
      scoreResult = <ScoreResult $result={GameResult.Win}>W</ScoreResult>;
    } else if (opponentScore > notreDameScore) {
      scoreResult = <ScoreResult $result={GameResult.Loss}>L</ScoreResult>;
    } else {
      scoreResult = <ScoreResult $result={GameResult.Tie}>T</ScoreResult>;
    }

    let overtimeContent;
    if (game.numOvertimes) {
      overtimeContent = (
        <OvertimeIndicator>
          <span style={{marginRight: '2px'}}>{game.numOvertimes}</span> OT
        </OvertimeIndicator>
      );
    }

    lastColumnContent = (
      <Score>
        {scoreResult}
        <ScoreTotals $isOvertimeGame={(game.numOvertimes ?? 0) > 0}>
          <p>
            {notreDameScore} - {opponentScore}
          </p>
          {overtimeContent}
        </ScoreTotals>
      </Score>
    );
  } else if (game.fullDate) {
    const time = format(new Date(game.fullDate), 'h:mm a');

    lastColumnContent = (
      <TelevisionCoverage
        $network={game.coverage === 'TBD' ? TVNetwork.Unknown : game.coverage ?? TVNetwork.Unknown}
      >
        <p>{time}</p>
        {game.coverage && game.coverage !== 'TBD' ? (
          <TVNetworkLogo network={game.coverage} />
        ) : null}
      </TelevisionCoverage>
    );
  } else {
    lastColumnContent = (
      <TelevisionCoverage $network={TVNetwork.Unknown}>
        <p>TBD</p>
      </TelevisionCoverage>
    );
  }

  let gameDate: Date | 'TBD' | undefined;
  if (game.fullDate) {
    gameDate = new Date(game.fullDate);
  } else if (game.date) {
    gameDate = game.date === 'TBD' ? 'TBD' : new Date(game.date);
  }

  // Format the date, making sure to add the year for games which happen in early January for
  // clarity.
  let dateString: string | null = null;
  if (gameDate && gameDate !== 'TBD') {
    if (gameDate.getFullYear() === season) {
      dateString = format(gameDate, 'MMMM d');
    } else {
      dateString = format(gameDate, 'MMMM d, yyyy');
    }
  }

  const opponentRanking = game.isHomeGame
    ? game.rankings?.away?.bcs || game.rankings?.away?.cfbPlayoff || game.rankings?.away?.ap
    : game.rankings?.home?.bcs || game.rankings?.home?.cfbPlayoff || game.rankings?.home?.ap;

  let shamrockSeriesLogoContent: React.ReactNode = null;
  if (game.isShamrockSeries) {
    shamrockSeriesLogoContent = (
      <ShamrockSeriesLogo src={shamrockImage} alt="Shamrock Series" title="Shamrock Series" />
    );
  }

  const opponent = teams[game.opponentId];

  const opponentNameContent = (
    <Media query="(max-width: 768px)">
      {(matches) =>
        matches ? (
          <OpponentName>{opponent.shortName || opponent.name}</OpponentName>
        ) : (
          <OpponentName>
            {opponent.name.length > 20 ? opponent.shortName : opponent.name}
          </OpponentName>
        )
      }
    </Media>
  );

  let location: string;
  if (game.location === 'TBD') {
    location = 'TBD';
  } else if (game.location.state) {
    location = `${game.location.city}, ${game.location.state}`;
  } else {
    location = `${game.location.city}, ${game.location.country}`;
  }

  return (
    <GameWrapper
      to={`/${season}/${index + 1}/`}
      $isSelected={isSelected}
      $isHomeGame={game.isHomeGame}
    >
      <OpponentWrapper>
        <OpponentLogo teamId={game.opponentId} />
        <DateOpponentDetailsWrapper>
          {dateString ? <GameDate>{dateString}</GameDate> : null}
          <OpponentDetailsWrapper>
            {game.isHomeGame ? null : <AwayGamePrefix>@</AwayGamePrefix>}
            {opponentRanking ? <OpponentRanking>#{opponentRanking}</OpponentRanking> : null}
            {opponentNameContent}
          </OpponentDetailsWrapper>
        </DateOpponentDetailsWrapper>
      </OpponentWrapper>
      <Location>
        {location}
        {shamrockSeriesLogoContent}
      </Location>
      {lastColumnContent}
    </GameWrapper>
  );
};
