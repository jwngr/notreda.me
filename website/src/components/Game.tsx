import {format} from 'date-fns/format';
import React from 'react';

import {useMediaQuery} from '../hooks/useMediaQuery';
import shamrockImage from '../images/shamrock.png';
import {getDateFromGame, isMidnight} from '../lib/datetime';
import {formatGameLocationAsString, getGameLocation} from '../lib/locations';
import {Teams} from '../lib/teams';
import {GameInfo, GameResult, TVNetwork} from '../models/games.models';
import {FlexRow} from './common/Flex';
import {TVNetworkLogo} from './common/TVNetworkLogo';
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
  OvertimeIndicator,
  Score,
  ScoreResult,
  ScoreTotals,
  ShamrockSeriesLogo,
  TelevisionCoverage,
} from './Game.styles';

export const Game: React.FC<{
  readonly game: GameInfo;
  readonly season: number;
  readonly index: number;
  readonly isSelected: boolean;
}> = ({game, season, index, isSelected}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const gameDate = getDateFromGame(game.date);

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
  } else if (gameDate === 'TBD' || isMidnight(gameDate)) {
    lastColumnContent = (
      <TelevisionCoverage $network={TVNetwork.Unknown}>
        <p>TBD</p>
      </TelevisionCoverage>
    );
  } else {
    const time = format(gameDate, 'h:mm a');

    lastColumnContent = (
      <TelevisionCoverage
        $network={
          game.coverage === 'TBD' ? TVNetwork.Unknown : (game.coverage ?? TVNetwork.Unknown)
        }
      >
        <p>{time}</p>
        {game.coverage && game.coverage !== 'TBD' ? (
          <TVNetworkLogo network={game.coverage} />
        ) : null}
      </TelevisionCoverage>
    );
  }

  // Format the date, making sure to add the year for games which happen in early January for
  // clarity.
  let dateString: string | null = null;
  if (gameDate !== 'TBD') {
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

  const opponent = Teams.getTeam(game.opponentId);

  const opponentNameContent = (
    <OpponentName>
      {isMobile
        ? opponent.shortName || opponent.name
        : opponent.name.length > 20
          ? opponent.shortName
          : opponent.name}
    </OpponentName>
  );

  const computedLocation = getGameLocation({game, season});
  const locationString = formatGameLocationAsString({location: computedLocation, tbdText: 'TBD'});

  return (
    <GameWrapper
      to={`/${season}/${index + 1}/`}
      $isSelected={isSelected}
      $isHomeGame={game.isHomeGame}
    >
      <FlexRow>
        <OpponentLogo teamId={game.opponentId} size={40} />
        <DateOpponentDetailsWrapper>
          {dateString ? <GameDate>{dateString}</GameDate> : null}
          <OpponentDetailsWrapper>
            {game.isHomeGame ? null : <AwayGamePrefix>@</AwayGamePrefix>}
            {opponentRanking ? <OpponentRanking>#{opponentRanking}</OpponentRanking> : null}
            {opponentNameContent}
          </OpponentDetailsWrapper>
        </DateOpponentDetailsWrapper>
      </FlexRow>
      <Location>
        {locationString}
        {shamrockSeriesLogoContent}
      </Location>
      {lastColumnContent}
    </GameWrapper>
  );
};
