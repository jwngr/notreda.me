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
    date = format(new Date(game.fullDate), 'MMMM D, YYYY');
    time = game.isTimeTbd ? 'TBD' : format(new Date(game.fullDate), 'h:mm A');
  } else if (game.date === 'TBD') {
    date = 'Date TBD';
  } else {
    date = format(game.timestamp || game.date, 'MMMM D, YYYY');
    if ('timestamp' in game) {
      time = format(game.timestamp || game.date, 'h:mm A');
    }
  }

  if (time && game.coverage && game.coverage !== 'TBD') {
    time = (
      <React.Fragment>
        <p>{time}</p>
        <img
          alt={`${game.coverage} logo`}
          src={require(`../../images/tvLogos/${game.coverage.toLowerCase()}.png`)}
        />
      </React.Fragment>
    );
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

  let stadium = game.location.stadium || null;
  let location;
  if (game.location === 'TBD') {
    location = 'Location TBD';
  } else if (game.location.state) {
    location = `${game.location.city}, ${game.location.state}`;
  } else {
    location = `${game.location.city}, ${game.location.country}`;
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
        <div className="time">{time}</div>
        <p className="stadium">{stadium}</p>
        <p className="location">{location}</p>
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
