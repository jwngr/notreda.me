import _ from 'lodash';
import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';

import {
  Score,
  TeamName,
  TeamImage,
  TeamRecord,
  TeamRanking,
  TeamWrapper,
  TeamNickname,
  TeamDetailsWrapper,
  TotalScoreWrapper,
} from './index.styles';

const Team = ({team, score, ranking, record, homeOrAway}) => {
  let scoreContent;
  if (score) {
    scoreContent = <Score>{score}</Score>;
  }

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
      {scoreContent}
    </TeamWrapper>
  );
};

Team.propTypes = {
  team: PropTypes.object.isRequired,
  ranking: PropTypes.number,
  homeOrAway: PropTypes.string.isRequired,
};

const TotalScore = ({game, homeTeam, awayTeam}) => {
  const homeApRanking = _.get(game, 'rankings.home.ap');
  const awayApRanking = _.get(game, 'rankings.away.ap');

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
    <Media query="(max-width: 1250px)">
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
            <TeamImage className="away" team={awayTeam} />
            <TeamImage className="home" team={homeTeam} />
            <Score className="away">{game.score.away}</Score>
            <Score className="home">{game.score.home}</Score>
          </TotalScoreWrapper>
        ) : (
          <TotalScoreWrapper>
            <Team team={awayTeam} ranking={awayApRanking} record={awayRecord} homeOrAway="away" />
            <Score>
              {game.score.away} - {game.score.home}
            </Score>
            <Team team={homeTeam} ranking={homeApRanking} record={homeRecord} homeOrAway="home" />
          </TotalScoreWrapper>
        )
      }
    </Media>
  );
};

TotalScore.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default TotalScore;
