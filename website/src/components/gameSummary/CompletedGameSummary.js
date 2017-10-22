import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import TeamLogo from '../TeamLogo';
import GameStats from './GameStats';
import Linescore from './Linescore';

import './CompletedGameSummary.css';


const CompletedGameSummary = ({ game, homeTeam, awayTeam }) => {
  const homeApRanking = _.get(game, 'rankings.home.ap');
  const awayApRanking = _.get(game, 'rankings.away.ap');

  let homeRankingContent = <p className='ranking'>&nbsp;</p>;
  if (homeApRanking) {
    homeRankingContent = <p className='ranking'>#{homeApRanking}</p>;
  }

  let awayRankingContent = <p className='ranking'>&nbsp;</p>;
  if (awayApRanking) {
    awayRankingContent = <p className='ranking'>#{awayApRanking}</p>;
  }

  return (
    <div className='completed-game-summary-container'>
      <div className='total-score'>
        <div>
          {awayRankingContent}
          <TeamLogo team={awayTeam} />
        </div>
        <p className='score'>{game.score.away} - {game.score.home}</p>
        <div>
          <TeamLogo team={homeTeam} />
          {homeRankingContent}
        </div>
      </div>

      <Linescore linescore={game.linescore} homeTeam={homeTeam} awayTeam={awayTeam} />

      <GameStats stats={game.stats} awayTeam={awayTeam} homeTeam={homeTeam} />
    </div>
  );
}

CompletedGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default CompletedGameSummary;
