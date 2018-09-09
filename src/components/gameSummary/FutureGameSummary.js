import _ from 'lodash';
import React from 'react';
import format from 'date-fns/format';
import PropTypes from 'prop-types';

import TeamLogo from '../TeamLogo';

import './FutureGameSummary.css';

const FutureGameSummary = ({game, homeTeam, awayTeam}) => {
  const notreDame = game.isHomeGame ? homeTeam : awayTeam;
  const opponent = game.isHomeGame ? awayTeam : homeTeam;
  const atOrVs = game.isHomeGame ? 'vs' : 'at';

  let date;
  let time;
  if ('fullDate' in game) {
    date = format(new Date(game.fullDate), 'dddd, MMMM D YYYY');
    time = game.isTimeTbd ? 'TBD' : format(new Date(game.fullDate), 'h:mm A');
  } else {
    date = format(game.timestamp || game.date, 'dddd, MMMM D YYYY');
    if ('timestamp' in game) {
      time = format(game.timestamp || game.date, 'h:mm A');
    } else {
      time = 'TBD';
    }
  }

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
    <div className="future-game-summary-container">
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
      <div className="matchup-details">
        <p className="date">{date}</p>
        <p className="time">
          {game.coverage}, {time}
        </p>
        <p className="location">{game.location}</p>
      </div>
    </div>
  );
};

FutureGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default FutureGameSummary;
