import _ from 'lodash';
import Media from 'react-media';

import {GameInfo, Team, TeamId} from '../../../../models';
import teamsJson from '../../../../resources/teams.json';
import {
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

const teams = teamsJson as Record<TeamId, Team>;

const TeamInfo: React.FC<{
  readonly teamId: TeamId;
  readonly ranking?: number;
  readonly record?: string;
  readonly homeOrAway: 'home' | 'away';
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

export const TotalScore: React.FC<{
  readonly game: GameInfo;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
}> = ({game, homeTeamId, awayTeamId}) => {
  const homeTeam = teams[homeTeamId];
  const awayTeam = teams[awayTeamId];

  const homeApRanking =
    _.get(game, 'rankings.home.bcs') ||
    _.get(game, 'rankings.home.cfbPlayoff') ||
    _.get(game, 'rankings.home.ap');
  const awayApRanking =
    _.get(game, 'rankings.away.bcs') ||
    _.get(game, 'rankings.away.cfbPlayoff') ||
    _.get(game, 'rankings.away.ap');

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
            {/* TODO: Introduce `CompletedGame` type so this `?` is not required. */}
            <Score className="away">{game.score?.away}</Score>
            <Score className="home">{game.score?.home}</Score>
          </TotalScoreWrapper>
        ) : (
          <TotalScoreWrapper>
            <TeamInfo
              teamId={awayTeamId}
              ranking={awayApRanking}
              record={awayRecord}
              homeOrAway="away"
            />
            <Score>
              {game.score?.away} - {game.score?.home}
            </Score>
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
