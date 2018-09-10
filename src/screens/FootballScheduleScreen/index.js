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

import {Header, HeaderTitle, NextYearLink, PreviousYearLink} from './index.styles';

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
          <Header>
            <PreviousYearLink href={`/${previousYear}`}>
              <span>&#x2190;</span>
              <Media query="(min-width: 700px)">
                <React.Fragment>{previousYear}</React.Fragment>
              </Media>
            </PreviousYearLink>

            <HeaderTitle>{`Notre Dame Football ${selectedYear}`}</HeaderTitle>

            <NextYearLink href={`/${nextYear}`}>
              <Media query="(min-width: 700px)">
                <React.Fragment>{nextYear}</React.Fragment>
              </Media>
              <span>&#x2192;</span>
            </NextYearLink>
          </Header>

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
