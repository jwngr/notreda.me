import _ from 'lodash';
import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link, Fragment} from 'redux-little-router';

import GameContainer from '../../containers/GameContainer';
import NavMenuContainer from '../../containers/NavMenuContainer';
import GameSummaryContainer from '../../containers/GameSummaryContainer';

import teams from '../../resources/teams';
import schedule from '../../resources/schedule';

import './index.css';

const FootballScheduleScreen = ({navMenuOpen, selectedYear, toggleNavMenu}) => {
  const gamesContent = _.map(schedule[selectedYear], (game, index) => {
    const gameClone = _.clone(game);

    gameClone.opponent = teams[game.opponentId];
    gameClone.opponent.abbreviation = game.opponentId;

    return <GameContainer key={index} index={index} game={gameClone} year={selectedYear} />;
  });

  const previousYear = selectedYear - 1;
  const nextYear = selectedYear + 1;

  const scheduleContainerClasses = classNames({
    'football-schedule-container': true,
    'nav-menu-open': navMenuOpen,
  });

  const closeNavMenuIfOpen = () => {
    if (navMenuOpen) {
      toggleNavMenu();
    }
  };

  return (
    <React.Fragment>
      <div className={scheduleContainerClasses} onClick={closeNavMenuIfOpen}>
        <div>
          <div className="current-year-container">
            <p className="current-year">{`Notre Dame Football ${selectedYear}`}</p>
          </div>

          <Link className="previous-year-container" href={`/${previousYear}`}>
            <div className="previous-year">
              <span>{String(previousYear)[0]}</span>
              <span>{String(previousYear)[1]}</span>
              <span>{String(previousYear)[2]}</span>
              <span>{String(previousYear)[3]}</span>
            </div>
          </Link>

          <Link className="next-year-container" href={`/${nextYear}`}>
            <div className="next-year">
              <span>{String(nextYear)[0]}</span>
              <span>{String(nextYear)[1]}</span>
              <span>{String(nextYear)[2]}</span>
              <span>{String(nextYear)[3]}</span>
            </div>
          </Link>

          <div className="master-container">
            <Media query="(max-width: 600px)">
              {(matches) =>
                matches ? (
                  <React.Fragment>
                    <Fragment forRoute="/:year/:selectedGameIndex">
                      <GameSummaryContainer />
                    </Fragment>
                    <Fragment forRoute="/" forNoMatch>
                      <div className="schedule-container">
                        <div className="schedule">{gamesContent}</div>
                      </div>
                    </Fragment>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="schedule-container">
                      <div className="schedule">{gamesContent}</div>
                    </div>

                    <GameSummaryContainer />
                  </React.Fragment>
                )
              }
            </Media>
          </div>
        </div>
      </div>
      <div>
        <div className="nav-menu-button" onClick={toggleNavMenu}>
          <span />
        </div>
        <NavMenuContainer />
      </div>
    </React.Fragment>
  );
};

FootballScheduleScreen.propTypes = {
  navMenuOpen: PropTypes.bool.isRequired,
  selectedYear: PropTypes.number.isRequired,
  toggleNavMenu: PropTypes.func.isRequired,
};

export default FootballScheduleScreen;
