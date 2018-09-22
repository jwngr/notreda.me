import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import TeamLogo from '../../TeamLogo';
import Metadata from '../CompletedGameSummary/Metadata';

import {
  Ranking,
  AtOrVersus,
  TeamWrapper,
  TeamsWrapper,
  MetadataWrapper,
  FutureGameWrapper,
} from './index.styles';

const FutureGameSummary = ({game, homeTeam, awayTeam}) => {
  const notreDame = game.isHomeGame ? homeTeam : awayTeam;
  const opponent = game.isHomeGame ? awayTeam : homeTeam;
  const atOrVs = game.isHomeGame ? 'vs' : 'at';

  const homeApRanking = _.get(game, 'rankings.home.ap');
  const awayApRanking = _.get(game, 'rankings.away.ap');

  const notreDameRanking = game.isHomeGame ? homeApRanking : awayApRanking;
  const opponentRanking = game.isHomeGame ? awayApRanking : homeApRanking;

  let notreDameRankingContent = <Ranking>&nbsp;</Ranking>;
  if (notreDameRanking) {
    notreDameRankingContent = <Ranking>#{notreDameRanking}</Ranking>;
  }

  let opponentRankingContent = <Ranking>&nbsp;</Ranking>;
  if (opponentRanking) {
    opponentRankingContent = <Ranking>#{opponentRanking}</Ranking>;
  }

  return (
    <FutureGameWrapper>
      <TeamsWrapper>
        <TeamWrapper>
          {notreDameRankingContent}
          <TeamLogo team={notreDame} />
        </TeamWrapper>
        <AtOrVersus>{atOrVs}</AtOrVersus>
        <TeamWrapper>
          <TeamLogo team={opponent} />
          {opponentRankingContent}
        </TeamWrapper>
      </TeamsWrapper>
      <MetadataWrapper>
        <Metadata game={game} />
      </MetadataWrapper>
    </FutureGameWrapper>
  );
};

FutureGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default FutureGameSummary;
