import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Media from 'react-media';
import {Route, Switch} from 'react-router-dom';

import {GameContainer} from '../../containers/GameContainer';
import {GameSummaryContainer} from '../../containers/GameSummaryContainer';
import {NavMenuContainer} from '../../containers/NavMenuContainer';
import {LATEST_YEAR} from '../../lib/constants';
import schedule from '../../resources/schedule';
import teams from '../../resources/teams';
import {
  GamesWrapper,
  Header,
  HeaderTitle,
  NavMenuButton,
  NextYearLink,
  PreviousYearLink,
  ScheduleScreenWrapper,
  ScheduleWrapper,
} from './index.styles';

export const FootballScheduleScreen = ({navMenuOpen, selectedYear, toggleNavMenu}) => {
  const gamesContent = _.map(schedule[selectedYear], (game, index) => {
    const gameClone = _.clone(game);

    gameClone.opponent = teams[game.opponentId];
    gameClone.opponent.abbreviation = game.opponentId;

    return <GameContainer key={index} index={index} game={gameClone} year={selectedYear} />;
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

          <NextYearLink className={selectedYear === LATEST_YEAR && 'hidden'} href={`/${nextYear}`}>
            <Media query="(min-width: 700px)">
              <React.Fragment>{nextYear}</React.Fragment>
            </Media>
            <span>&#x2192;</span>
          </NextYearLink>
        </Header>

        <ScheduleWrapper>
          <Media query="(max-width: 950px)">
            {(matches) =>
              matches ? (
                <Switch>
                  <Route path="/:year/:selectedGameIndex">
                    <GameSummaryContainer />
                  </Route>
                  <Route path="/">
                    <GamesWrapper>{gamesContent}</GamesWrapper>
                  </Route>
                </Switch>
              ) : (
                <React.Fragment>
                  <GamesWrapper>{gamesContent}</GamesWrapper>
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
