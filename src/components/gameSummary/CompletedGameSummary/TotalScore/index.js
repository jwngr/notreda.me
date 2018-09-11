import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import TeamLogo from '../../../TeamLogo';

import {
  Score,
  TeamName,
  TeamRecord,
  TeamRanking,
  TeamWrapper,
  TeamNickname,
  TeamDetailsWrapper,
  TotalScoreWrapper,
} from './index.styles';

const Team = ({team, ranking, record, homeOrAway}) => (
  <TeamWrapper className={homeOrAway}>
    <TeamLogo team={team} />
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
    <TotalScoreWrapper>
      <Team team={awayTeam} ranking={awayApRanking} record={awayRecord} homeOrAway="away" />
      <Score>
        {game.score.away} - {game.score.home}
      </Score>
      <Team team={homeTeam} ranking={homeApRanking} record={homeRecord} homeOrAway="home" />
    </TotalScoreWrapper>
  );
};

TotalScore.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default TotalScore;
