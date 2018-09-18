import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import TeamLogo from '../../TeamLogo';
import Metadata from '../CompletedGameSummary/Metadata';

import './index.css';

import {FutureGameWrapper, MetadataWrapper} from './index.styles';

const FutureGameSummary = ({game, homeTeam, awayTeam}) => {
  const notreDame = game.isHomeGame ? homeTeam : awayTeam;
  const opponent = game.isHomeGame ? awayTeam : homeTeam;
  const atOrVs = game.isHomeGame ? 'vs' : 'at';

  const homeApRanking = _.get(game, 'rankings.home.ap');
  const awayApRanking = _.get(game, 'rankings.away.ap');

  const notreDameRanking = game.isHomeGame ? homeApRanking : awayApRanking;
  const opponentRanking = game.isHomeGame ? awayApRanking : homeApRanking;

  let notreDameRankingContent = <p className="ranking">&nbsp;</p>;
  if (notreDameRanking) {
    notreDameRankingContent = <p className="ranking">#{notreDameRanking}</p>;
  }

  let opponentRankingContent = <p className="ranking">&nbsp;</p>;
  if (opponentRanking) {
    opponentRankingContent = <p className="ranking">#{opponentRanking}</p>;
  }

  return (
    <FutureGameWrapper>
      <div className="matchup-teams">
        <div>
          {notreDameRankingContent}
          <TeamLogo team={notreDame} />
        </div>
        <p className="at-or-vs">{atOrVs}</p>
        <div>
          <TeamLogo team={opponent} />
          {opponentRankingContent}
        </div>
      </div>
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
