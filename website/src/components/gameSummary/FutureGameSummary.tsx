import React from 'react';
import styled from 'styled-components';

import {useMediaQuery} from '../../hooks/useMediaQuery';
import {Teams} from '../../lib/teams';
import {GameInfo} from '../../models/games.models';
import {TeamId} from '../../models/teams.models';
import {FlexColumn, FlexRow} from '../common/Flex';
import {TeamLogo} from '../common/TeamLogo';
import {GameCoverage} from './GameCoverage';

const FutureGameWrapper = styled(FlexColumn).attrs({align: 'center'})`
  flex: 1;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 768px) {
    padding-bottom: 20px;
  }
`;

const TeamsWrapper = styled(FlexRow).attrs({justify: 'center'})`
  width: 100%;
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
`;

const TeamWrapper = styled(FlexRow)`
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

const TeamDetailsWrapper = styled(FlexColumn)<TeamDetailsWrapperProps>`
  font-family: 'Inter', serif;

  text-align: ${({$isHomeGame}) => ($isHomeGame ? 'left' : 'right')};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    text-align: right;
    align-self: center;
    justify-self: right;
    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamDetails' : 'awayTeamDetails')};
  }
`;

const TeamName = styled.p`
  font-size: 14px;
  text-transform: uppercase;
`;

const TeamNickname = styled.p`
  font-size: 22px;
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
  font-size: 14px;
  margin-right: 4px;
  color: ${({theme}) => theme.colors.gray};
`;

const TeamRecord = styled.p`
  font-size: 14px;
  color: ${({theme}) => theme.colors.gray};
`;

const AtOrVersus = styled.p`
  font-size: 32px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    align-self: center;
    justify-self: center;
    grid-area: atOrVersus;
  }
`;

const StatsWrapper = styled(FlexColumn).attrs({gap: 20, justify: 'center'})`
  width: 100%;
  margin-top: 20px;
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
  readonly season: number;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
}> = ({game, season, homeTeamId, awayTeamId}) => {
  const isMobileOrTablet = useMediaQuery(
    '(max-width: 600px), (min-width: 950px) and (max-width: 1120px)'
  );

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
    if (game.isNeutralSiteGame) {
      // Only show overall record for neutral site games.
      awayRecord = game.records.away.overall;
    } else if (game.records.away.away) {
      awayRecord = `${game.records.away.overall}, ${game.records.away.away} Away`;
    } else {
      awayRecord = game.records.away.overall;
    }
  }

  let homeRecord: string | undefined;
  if (game.records) {
    if (game.isNeutralSiteGame) {
      // Only show overall record for neutral site games.
      homeRecord = game.records.home.overall;
    } else if (game.records.home.home) {
      homeRecord = `${game.records.home.overall}, ${game.records.home.home} Home`;
    } else {
      homeRecord = game.records.home.overall;
    }
  }

  return (
    <FutureGameWrapper>
      <TeamsWrapper>
        {isMobileOrTablet ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
      </TeamsWrapper>

      <StatsWrapper>
        <GameCoverage game={game} season={season} />
        {/* TODO: Re-enable matchup history after improving data loading performance. */}
        {/* <MatchupHistory game={game} season={season} /> */}
      </StatsWrapper>
    </FutureGameWrapper>
  );
};
