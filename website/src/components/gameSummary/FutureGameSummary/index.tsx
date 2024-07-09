import React from 'react';
import Media from 'react-media';

import {Teams} from '../../../lib/teams';
import {GameInfo, TeamId} from '../../../models';
import {GameCoverage} from '../GameCoverage';
// import {MatchupHistory} from '../MatchupHistory';
import {
  AtOrVersus,
  FutureGameWrapper,
  StatsWrapper,
  TeamDetailsWrapper,
  TeamImage,
  TeamName,
  TeamNickname,
  TeamRanking,
  TeamRecord,
  TeamsWrapper,
  TeamWrapper,
} from './index.styles';

const TeamInfo: React.FC<{
  readonly teamId: TeamId;
  readonly record: string | null;
  readonly ranking: number | null;
  readonly homeOrAway: string;
}> = ({teamId, ranking, record, homeOrAway}) => {
  const team = Teams.getTeam(teamId);
  return (
    <TeamWrapper>
      <TeamImage teamId={teamId} $isHomeGame={homeOrAway === 'home'} size={52} />
      <TeamDetailsWrapper $isHomeGame={homeOrAway === 'home'}>
        <TeamName>
          {ranking ? <TeamRanking>#{ranking}</TeamRanking> : null}
          {team.name}
        </TeamName>
        <TeamNickname>{team.nickname}</TeamNickname>
        {record ? <TeamRecord>{record}</TeamRecord> : null}
      </TeamDetailsWrapper>
    </TeamWrapper>
  );
};

export const FutureGameSummary: React.FC<{
  readonly game: GameInfo;
  readonly selectedSeason: number;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
}> = ({game, homeTeamId, awayTeamId}) => {
  const homeTeam = Teams.getTeam(homeTeamId);
  const awayTeam = Teams.getTeam(awayTeamId);

  let atOrVs = game.isHomeGame ? 'vs' : 'at';
  atOrVs = 'vs';

  const homeApRanking =
    game.rankings?.home?.bcs || game.rankings?.home?.cfbPlayoff || game.rankings?.home?.ap;
  const awayApRanking =
    game.rankings?.away?.bcs || game.rankings?.away?.cfbPlayoff || game.rankings?.away?.ap;

  let awayRecord: string | undefined;
  if (game.records) {
    if (game.records.away.away) {
      awayRecord = `${game.records.away.overall}, ${game.records.away.away} Away`;
    } else {
      awayRecord = game.records.away.overall;
    }
  }

  let homeRecord: string | undefined;
  if (game.records) {
    if (game.records.home.home) {
      homeRecord = `${game.records.home.overall}, ${game.records.home.home} Home`;
    } else {
      homeRecord = game.records.home.overall;
    }
  }

  return (
    <FutureGameWrapper>
      <Media query="(max-width: 600px), (min-width: 950px) and (max-width: 1120px)">
        {(matches) =>
          matches ? (
            <TeamsWrapper>
              <TeamDetailsWrapper $isHomeGame={false}>
                <TeamName>
                  {awayApRanking ? <TeamRanking>#{awayApRanking}</TeamRanking> : null}
                  {awayTeam.name}
                </TeamName>
                <TeamNickname>{awayTeam.nickname}</TeamNickname>
                {awayRecord ? <TeamRecord>{awayRecord}</TeamRecord> : null}
              </TeamDetailsWrapper>
              <TeamDetailsWrapper $isHomeGame>
                <TeamName>
                  {homeApRanking ? <TeamRanking>#{homeApRanking}</TeamRanking> : null}
                  {homeTeam.name}
                </TeamName>
                <TeamNickname>{homeTeam.nickname}</TeamNickname>
                {homeRecord ? <TeamRecord>{homeRecord}</TeamRecord> : null}
              </TeamDetailsWrapper>
              <TeamImage teamId={awayTeamId} $isHomeGame={false} size={52} />
              <TeamImage teamId={homeTeamId} $isHomeGame size={52} />
              <AtOrVersus>{atOrVs}</AtOrVersus>
            </TeamsWrapper>
          ) : (
            <TeamsWrapper>
              <TeamInfo
                teamId={awayTeamId}
                ranking={awayApRanking ?? null}
                record={awayRecord ?? null}
                homeOrAway="away"
              />
              <AtOrVersus>{atOrVs}</AtOrVersus>
              <TeamInfo
                teamId={homeTeamId}
                ranking={homeApRanking ?? null}
                record={homeRecord ?? null}
                homeOrAway="home"
              />
            </TeamsWrapper>
          )
        }
      </Media>

      <StatsWrapper>
        <GameCoverage game={game} />
        {/* TODO: Re-enable matchup history after improving data loading performance. */}
        {/* <MatchupHistory selectedGame={game} selectedSeason={selectedSeason} /> */}
      </StatsWrapper>
    </FutureGameWrapper>
  );
};
