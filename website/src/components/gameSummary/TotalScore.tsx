import Media from 'react-media';
import styled from 'styled-components';

import {Teams} from '../../lib/teams';
import {GameInfo} from '../../models/games.models';
import {TeamId} from '../../models/teams.models';
import {FlexColumn, FlexRow} from '../common/Flex';
import {TeamLogo} from '../common/TeamLogo';

const TotalScoreWrapper = styled(FlexRow).attrs({
  justify: 'center',
})`
  width: 100%;
  font-family: 'Bungee';
  margin-bottom: 44px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    display: grid;
    grid-gap: 12px 8px;
    grid-template-areas:
      'awayTeamDetails awayTeamLogo awayTeamScore'
      'homeTeamDetails homeTeamLogo homeTeamScore';
    }
  }
`;

interface TeamWrapperProps {
  readonly $isHomeGame: boolean;
}

const TeamWrapper = styled(FlexRow)<TeamWrapperProps>`
  flex: 1;
  justify-content: ${({$isHomeGame}) => ($isHomeGame ? 'flex-start' : 'flex-end')};
`;

interface TeamImageProps {
  readonly $isHomeGame: boolean;
}

const TeamImage = styled(TeamLogo)<TeamImageProps>`
  margin-left: 8px;
  margin-right: 8px;
  order: ${({$isHomeGame}) => ($isHomeGame ? 0 : 1)};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    margin: 0 16px 0 0;
    align-self: center;
    justify-self: center;
    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamLogo' : 'awayTeamLogo')};
  }
`;

interface TeamDetailsWrapperProps {
  readonly $isHomeGame: boolean;
}

const TeamDetailsWrapper = styled(FlexColumn)<TeamDetailsWrapperProps>`
  text-align: ${({$isHomeGame}) => ($isHomeGame ? 'left' : 'right')};
  font-family: 'Inter', serif;

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

const TeamRanking = styled.span`
  font-size: 14px;
  color: ${({theme}) => theme.colors.gray};
  margin-right: 4px;
`;

const TeamRecord = styled.p`
  font-size: 14px;
  color: ${({theme}) => theme.colors.gray};
`;

interface ScoreProps {
  readonly $isHomeGame: boolean;
}

const Score = styled.p<ScoreProps>`
  font-size: 36px;
  text-align: right;
  white-space: nowrap;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    align-self: center;
    justify-self: center;
    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamScore' : 'awayTeamScore')};
  }
`;

const FinalScore = styled.p`
  margin: 0 8px;
  font-size: 36px;
  align-self: center;
  justify-self: center;
`;

const TeamInfo: React.FC<{
  readonly teamId: TeamId;
  readonly ranking?: number;
  readonly record?: string;
  readonly homeOrAway: 'home' | 'away';
}> = ({teamId, ranking, record, homeOrAway}) => {
  const team = Teams.getTeam(teamId);
  const isHomeGame = homeOrAway === 'home';
  return (
    <TeamWrapper $isHomeGame={isHomeGame}>
      <TeamImage teamId={teamId} $isHomeGame={isHomeGame} size={52} />
      <TeamDetailsWrapper $isHomeGame={isHomeGame}>
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

export const TotalScore: React.FC<{
  readonly game: GameInfo;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
}> = ({game, homeTeamId, awayTeamId}) => {
  const homeTeam = Teams.getTeam(homeTeamId);
  const awayTeam = Teams.getTeam(awayTeamId);

  const homeApRanking =
    game.rankings?.home?.bcs || game.rankings?.home?.cfbPlayoff || game.rankings?.home?.ap;
  const awayApRanking =
    game.rankings?.away?.bcs || game.rankings?.away?.cfbPlayoff || game.rankings?.away?.ap;

  let awayRecord: string;
  if (game.records) {
    if (game.isBowlGame || game.isShamrockSeries || game.isNeutralSiteGame) {
      // Only show overall record for neutral site games. Assume bowl and Shamrock Series games are
      // played on neutral sites.
      awayRecord = game.records.away.overall;
    } else if (game.records.away.away) {
      awayRecord = `${game.records.away.overall}, ${game.records.away.away} Away`;
    } else {
      awayRecord = game.records.away.overall;
    }
  }

  let homeRecord: string;
  if (game.records) {
    if (game.isBowlGame || game.isShamrockSeries || game.isNeutralSiteGame) {
      // Only show overall record for neutral site games. Assume bowl and Shamrock Series games are
      // played on neutral sites.
      homeRecord = game.records.home.overall;
    } else if (game.records.home.home) {
      homeRecord = `${game.records.home.overall}, ${game.records.home.home} Home`;
    } else {
      homeRecord = game.records.home.overall;
    }
  }

  return (
    <Media query="(max-width: 600px), (min-width: 950px) and (max-width: 1120px)">
      {(matches) =>
        matches ? (
          <TotalScoreWrapper>
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
            <TeamImage $isHomeGame={false} teamId={awayTeamId} size={52} />
            <TeamImage $isHomeGame teamId={homeTeamId} size={52} />
            {/* TODO: Introduce `CompletedGame` type so this `?` is not required. */}
            <Score $isHomeGame={false}>{game.score?.away}</Score>
            <Score $isHomeGame>{game.score?.home}</Score>
          </TotalScoreWrapper>
        ) : (
          <TotalScoreWrapper>
            <TeamInfo
              teamId={awayTeamId}
              ranking={awayApRanking}
              record={awayRecord}
              homeOrAway="away"
            />
            <FinalScore>
              {game.score?.away} - {game.score?.home}
            </FinalScore>
            <TeamInfo
              teamId={homeTeamId}
              ranking={homeApRanking}
              record={homeRecord}
              homeOrAway="home"
            />
          </TotalScoreWrapper>
        )
      }
    </Media>
  );
};
