import _ from 'lodash';
import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Fragment} from 'redux-little-router';

import GameContainer from '../../containers/GameContainer';
import NavMenuContainer from '../../containers/NavMenuContainer';
import GameSummaryContainer from '../../containers/GameSummaryContainer';

import teams from '../../resources/teams';
import schedule from '../../resources/schedule';

import {
  Header,
  HeaderTitle,
  NextYearLink,
  NavMenuButton,
  ScheduleWrapper,
  PreviousYearLink,
  ScheduleScreenWrapper,
} from './index.styles';

const FootballScheduleScreen = ({navMenuOpen, selectedYear, toggleNavMenu}) => {
  const gamesContent = _.map(schedule[selectedYear], (game, index) => {
    const gameClone = _.clone(game);

    gameClone.opponent = teams[game.opponentId];
    gameClone.opponent.abbreviation = game.opponentId;

    return <GameContainer key={index} index={index} game={gameClone} year={selectedYear} />;
  });

  const scheduleContainerClasses = classNames({
    'football-schedule-container': true,
    'nav-menu-open': navMenuOpen,
  });

  const closeNavMenuIfOpen = () => {
    if (navMenuOpen) {
      toggleNavMenu();
    }
  };

  let nextYear = selectedYear === 1889 ? 1892 : selectedYear + 1;
  let previousYear = selectedYear === 1892 ? 1889 : selectedYear - 1;

  return (
    <React.Fragment>
      <ScheduleScreenWrapper onClick={closeNavMenuIfOpen}>
        <Header>
          <PreviousYearLink className={selectedYear === 1887 && 'hidden'} href={`/${previousYear}`}>
            <span>&#x2190;</span>
            <Media query="(min-width: 700px)">
              <React.Fragment>{previousYear}</React.Fragment>
            </Media>
          </PreviousYearLink>

          <HeaderTitle>{`Notre Dame Football ${selectedYear}`}</HeaderTitle>

          <NextYearLink className={selectedYear === 2029 && 'hidden'} href={`/${nextYear}`}>
            <Media query="(min-width: 700px)">
              <React.Fragment>{nextYear}</React.Fragment>
            </Media>
            <span>&#x2192;</span>
          </NextYearLink>
        </Header>

        <ScheduleWrapper>
          <Media query="(max-width: 800px)">
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
        </ScheduleWrapper>
      </ScheduleScreenWrapper>

      <NavMenuButton onClick={toggleNavMenu}>
        <span />
      </NavMenuButton>
      <NavMenuContainer />
    </React.Fragment>
  );
};

FootballScheduleScreen.propTypes = {
  navMenuOpen: PropTypes.bool.isRequired,
  selectedYear: PropTypes.number.isRequired,
  toggleNavMenu: PropTypes.func.isRequired,
};

export default FootballScheduleScreen;
