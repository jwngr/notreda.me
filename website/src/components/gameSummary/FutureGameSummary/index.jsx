import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Media from 'react-media';

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

const TeamInfo = ({team, ranking, record, homeOrAway}) => {
  return (
    <TeamWrapper className={homeOrAway}>
      <TeamImage team={team} className={homeOrAway} />
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

TeamInfo.propTypes = {
  team: PropTypes.object.isRequired,
  ranking: PropTypes.number,
  homeOrAway: PropTypes.string.isRequired,
};

export const FutureGameSummary = ({game, homeTeam, awayTeam}) => {
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

  let awayRecord;
  if (game.records) {
    if (game.records.away.away) {
      awayRecord = `${game.records.away.overall}, ${game.records.away.away} Away`;
    } else {
      awayRecord = game.records.away.overall;
    }
  }

  let homeRecord;
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
              <TeamImage className="away" team={awayTeam} />
              <TeamImage className="home" team={homeTeam} />
              <AtOrVersus>{atOrVs}</AtOrVersus>
            </TeamsWrapper>
          ) : (
            <TeamsWrapper>
              <TeamInfo
                team={awayTeam}
                ranking={awayApRanking}
                record={awayRecord}
                homeOrAway="away"
              />
              <AtOrVersus>{atOrVs}</AtOrVersus>
              <TeamInfo
                team={homeTeam}
                ranking={homeApRanking}
                record={homeRecord}
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
        <MatchupHistory game={game} />
      </StatsWrapper>
    </FutureGameWrapper>
  );
};

FutureGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};