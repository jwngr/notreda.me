import {format} from 'date-fns/format';
import React from 'react';
import styled from 'styled-components';

import {useMediaQuery} from '../hooks/useMediaQuery';
import {getDateFromGame, isMidnight} from '../lib/datetime';
import {formatGameLocationAsString, getGameLocation} from '../lib/locations';
import {Teams} from '../lib/teams';
import {GameInfo, GameResult} from '../models/games.models';
import {CollegeGameDayBadge} from './CollegeGameDayBadge';
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
  TelevisionCoverage,
  TelevisionNetworkLogo,
} from './Game.styles';
import {ShamrockSeriesBadge} from './ShamrockSeriesBadge';

const ListFallbackCollegeGameDayBadge = styled.span`
  display: none;
  margin-left: 4px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1200px) {
    display: inline-flex;
  }
`;

const DesktopCollegeGameDayBadge = styled.span`
  display: inline-flex;
  margin-left: 4px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1200px) {
    display: none;
  }
`;

const ListFallbackShamrockSeriesBadge = styled.span`
  display: none;
  margin-left: 4px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1200px) {
    display: inline-flex;
  }
`;

const DesktopShamrockSeriesBadge = styled.span`
  display: inline-flex;
  margin-left: 4px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1200px) {
    display: none;
  }
`;

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
      <TelevisionCoverage>
        <p>TBD</p>
      </TelevisionCoverage>
    );
  } else {
    const time = format(gameDate, 'h:mm a');

    lastColumnContent = (
      <TelevisionCoverage>
        <p>{time}</p>
        {game.coverage?.map((network) => (
          <TelevisionNetworkLogo key={network} $network={network}>
            <TVNetworkLogo network={network} />
          </TelevisionNetworkLogo>
        ))}
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
      to="/$selectedYear/$selectedGameIndex"
      params={{selectedYear: String(season), selectedGameIndex: String(index + 1)}}
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
            {game.isShamrockSeries ? (
              <ListFallbackShamrockSeriesBadge>
                <ShamrockSeriesBadge />
              </ListFallbackShamrockSeriesBadge>
            ) : null}
            {game.isCollegeGameDay ? (
              <ListFallbackCollegeGameDayBadge>
                <CollegeGameDayBadge />
              </ListFallbackCollegeGameDayBadge>
            ) : null}
          </OpponentDetailsWrapper>
        </DateOpponentDetailsWrapper>
      </FlexRow>
      <Location>
        {locationString}
        {game.isShamrockSeries ? (
          <DesktopShamrockSeriesBadge>
            <ShamrockSeriesBadge />
          </DesktopShamrockSeriesBadge>
        ) : null}
        {game.isCollegeGameDay ? (
          <DesktopCollegeGameDayBadge>
            <CollegeGameDayBadge />
          </DesktopCollegeGameDayBadge>
        ) : null}
      </Location>
      {lastColumnContent}
    </GameWrapper>
  );
};
