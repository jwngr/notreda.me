import React from 'react';
import Media from 'react-media';
// import {MatchupHistory} from '../MatchupHistory';

import styled from 'styled-components';

import {Teams} from '../../lib/teams';
import {GameInfo, TeamId} from '../../models';
import {TeamLogo} from '../TeamLogo';
import {GameCoverage} from './GameCoverage';

const FutureGameWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 768px) {
    padding-bottom: 20px;
  }
`;

const TeamsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'Bungee';
  margin: 16px 0;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    display: grid;
    grid-gap: 12px 20px;
    grid-template-areas:
      'awayTeamDetails awayTeamLogo'
      'atOrVersus atOrVersus'
      'homeTeamDetails homeTeamLogo';
    }
  }
`;

const TeamWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 80px;
    width: 80px;
    margin: 0 40px;
  }

  &:first-of-type img {
    margin-left: 8px;
    margin-right: 20px;
  }

  &:last-of-type img {
    margin-left: 20px;
    margin-right: 8px;
  }
`;

interface TeamDetailsWrapperProps {
  readonly $isHomeGame: boolean;
}

const TeamDetailsWrapper = styled.div<TeamDetailsWrapperProps>`
  display: flex;
  flex-direction: column;
  font-family: 'Inter UI', serif;

  text-align: ${({$isHomeGame}) => ($isHomeGame ? 'left' : 'right')};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    text-align: right;
    align-self: center;
    justify-self: right;
    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamDetails' : 'awayTeamDetails')};
  }
`;

const TeamName = styled.p`
  font-size: 12px;
  text-transform: uppercase;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    font-size: 18px;
  }
`;

const TeamNickname = styled.p`
  font-size: 20px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    font-size: 24px;
  }
`;

interface TeamImageProps {
  readonly $isHomeGame: boolean;
}

const TeamImage = styled(TeamLogo)<TeamImageProps>`
  margin-left: 8px;
  margin-right: 8px;

  ${({$isHomeGame}) => ($isHomeGame ? null : `order: 1;`)}

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    width: 72px;
    height: 72px;

    margin: 0 16px 0 0;
    align-self: center;
    justify-self: center;

    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamLogo' : 'awayTeamLogo')};
  }
`;

const TeamRanking = styled.span`
  font-size: 12px;
  margin-right: 4px;
  color: ${({theme}) => theme.colors.gray};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    font-size: 16px;
  }
`;

const TeamRecord = styled.p`
  font-size: 12px;
  color: ${({theme}) => theme.colors.gray};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    font-size: 16px;
  }
`;

const AtOrVersus = styled.p`
  font-size: 32px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    align-self: center;
    justify-self: center;
    grid-area: atOrVersus;
  }
`;

const StatsWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

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
