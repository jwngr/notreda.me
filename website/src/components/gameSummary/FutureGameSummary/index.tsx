import _ from 'lodash';
import React from 'react';
import Media from 'react-media';

import {GameInfo, Team, TeamId} from '../../../models';
import teamsJson from '../../../resources/teams.json';
import {CoverageLocationWrapper} from '../CompletedGameSummary/index.styles';
import {GameCoverage} from '../GameCoverage';
import {Location} from '../Location';
import {MatchupHistory} from '../MatchupHistory';
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

const teams = teamsJson as Record<TeamId, Team>;

const TeamInfo: React.FC<{
  readonly teamId: TeamId;
  readonly record: string | null;
  readonly ranking: number | null;
  readonly homeOrAway: string;
}> = ({teamId, ranking, record, homeOrAway}) => {
  const team = teams[teamId];
  return (
    <TeamWrapper className={homeOrAway}>
      <TeamImage teamId={teamId} className={homeOrAway} />
      <TeamDetailsWrapper className={homeOrAway}>
        <TeamName>
          {ranking && <TeamRanking>#{ranking}</TeamRanking>}
          {team.name}
        </TeamName>
        <TeamNickname>{team.nickname}</TeamNickname>
        {record && <TeamRecord>{record}</TeamRecord>}
      </TeamDetailsWrapper>
    </TeamWrapper>
  );
};

export const FutureGameSummary: React.FC<{
  readonly game: GameInfo;
  readonly selectedSeason: number;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
}> = ({game, selectedSeason, homeTeamId, awayTeamId}) => {
  const homeTeam = teams[homeTeamId];
  const awayTeam = teams[awayTeamId];

  let atOrVs = game.isHomeGame ? 'vs' : 'at';
  atOrVs = 'vs';

  const homeApRanking =
    _.get(game, 'rankings.home.bcs') ||
    _.get(game, 'rankings.home.cfbPlayoff') ||
    _.get(game, 'rankings.home.ap');
  const awayApRanking =
    _.get(game, 'rankings.away.bcs') ||
    _.get(game, 'rankings.away.cfbPlayoff') ||
    _.get(game, 'rankings.away.ap');

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
              <TeamDetailsWrapper className="away">
                <TeamName>
                  {awayApRanking && <TeamRanking>#{awayApRanking}</TeamRanking>}
                  {awayTeam.name}
                </TeamName>
                <TeamNickname>{awayTeam.nickname}</TeamNickname>
                {awayRecord && <TeamRecord>{awayRecord}</TeamRecord>}
              </TeamDetailsWrapper>
              <TeamDetailsWrapper className="home">
                <TeamName>
                  {homeApRanking && <TeamRanking>#{homeApRanking}</TeamRanking>}
                  {homeTeam.name}
                </TeamName>
                <TeamNickname>{homeTeam.nickname}</TeamNickname>
                {homeRecord && <TeamRecord>{homeRecord}</TeamRecord>}
              </TeamDetailsWrapper>
              <TeamImage className="away" teamId={awayTeamId} />
              <TeamImage className="home" teamId={homeTeamId} />
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
        <CoverageLocationWrapper>
          <GameCoverage game={game} />
          <Location game={game} />
        </CoverageLocationWrapper>
        <MatchupHistory selectedGame={game} selectedSeason={selectedSeason} />
      </StatsWrapper>
    </FutureGameWrapper>
  );
};
