import _ from 'lodash';
import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import GameContainer from '../containers/GameContainer';
import GameSummaryContainer from '../containers/GameSummaryContainer';

import teams from '../resources/teams';
import schedule from '../resources/schedule';

import './YearSchedule.css';

const YearSchedule = ({selectedYear}) => {
  const gamesContent = _.map(schedule[selectedYear], (game, index) => {
    const gameClone = _.clone(game);

    gameClone.opponent = teams[game.opponentId];
    gameClone.opponent.abbreviation = game.opponentId;

    return <GameContainer key={index} index={index} game={gameClone} year={selectedYear} />;
  });

  const previousYear = selectedYear - 1;
  const nextYear = selectedYear + 1;

  return (
    <div>
      <div className="current-year-container">
        <p className="current-year">{`Notre Dame Football ${selectedYear}`}</p>
      </div>

      <Link className="previous-year-container" to={`/${previousYear}`}>
        <div className="previous-year">
          <span>{String(previousYear)[0]}</span>
          <span>{String(previousYear)[1]}</span>
          <span>{String(previousYear)[2]}</span>
          <span>{String(previousYear)[3]}</span>
        </div>
      </Link>

      <Link className="next-year-container" to={`/${nextYear}`}>
        <div className="next-year">
          <span>{String(nextYear)[0]}</span>
          <span>{String(nextYear)[1]}</span>
          <span>{String(nextYear)[2]}</span>
          <span>{String(nextYear)[3]}</span>
        </div>
      </Link>

      <div className="master-container">
        <div className="schedule-container">
          <div className="schedule">{gamesContent}</div>
        </div>

        <Media query="(min-width: 600px)">{(matches) => matches && <GameSummaryContainer />}</Media>
      </div>
    </div>
  );
};

YearSchedule.propTypes = {
  selectedYear: PropTypes.number.isRequired,
};

export default YearSchedule;
