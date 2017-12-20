import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import GameStats from './GameStats';
import LineScore from './LineScore';
import TeamLayout from './TeamLayout';

import './CompletedGameSummary.css';


const CompletedGameSummary = ({ game, homeTeam, awayTeam }) => {
  const homeApRanking = _.get(game, 'rankings.home.ap');
  const awayApRanking = _.get(game, 'rankings.away.ap');

  const date = format(game.timestamp || game.date, 'MMMM D, YYYY');
  let time;
  if ('timestamp' in game) {
    time = format(game.timestamp || game.date, 'h:mm A');
  }

  let tvCoverageIcon;
  if (game.coverage && game.coverage !== 'TBD') {
    tvCoverageIcon = (
      <img
        className='tv-coverage'
        alt={`${game.coverage} logo`}
        src={require(`../../images/tvLogos/${game.coverage.toLowerCase()}.png`)}
      />
    );
  }

  // TODO: get correct stadium
  return (
    <div className='completed-game-summary-container'>
      <div className='total-score'>
        <TeamLayout team={awayTeam} ranking={awayApRanking} homeOrAway='away' />
        <p className='score'>{game.score.away} - {game.score.home}</p>
        <TeamLayout team={homeTeam} ranking={homeApRanking} homeOrAway='home' />
      </div>

      <div className='linescore-and-metadata-container'>
        <LineScore linescore={game.linescore} homeTeam={homeTeam} awayTeam={awayTeam} />
        <div className='game-metadata'>
          <div className='game-metadata-date-container'>
            <p className='game-metadata-date'>{date}</p>
          </div>
          <p>Notre Dame Stadium</p>
          <p>{game.location}</p>
          <p>{tvCoverageIcon} {time}</p>
        </div>
      </div>

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
