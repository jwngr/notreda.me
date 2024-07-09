import Media from 'react-media';

import {Teams} from '../../../../lib/teams';
import {GameInfo, TeamId} from '../../../../models';
import {
  FinalScore,
  Score,
  TeamDetailsWrapper,
  TeamImage,
  TeamName,
  TeamNickname,
  TeamRanking,
  TeamRecord,
  TeamWrapper,
  TotalScoreWrapper,
} from './index.styles';

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
    if (game.isNeutralSiteGame && game.records.away.neutral) {
      awayRecord = `${game.records.away.overall}, ${game.records.away.neutral} Neutral Site`;
    } else if (game.records.away.away) {
      awayRecord = `${game.records.away.overall}, ${game.records.away.away} Away`;
    } else {
      awayRecord = game.records.away.overall;
    }
  }

  let homeRecord: string;
  if (game.records) {
    if (game.isNeutralSiteGame && game.records.home.neutral) {
      homeRecord = `${game.records.home.overall}, ${game.records.home.neutral} Neutral Site`;
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
