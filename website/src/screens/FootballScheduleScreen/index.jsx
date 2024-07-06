import _ from 'lodash';
import React, {useMemo, useState} from 'react';
import Media from 'react-media';
import {Route, Switch, useLocation} from 'react-router-dom';

import {Game} from '../../components/Game';
import {GameSummary} from '../../components/gameSummary/GameSummary';
import {NavMenu} from '../../components/NavMenu';
import {LATEST_YEAR} from '../../lib/constants';
import {getSelectedGameIndexFromUrl, getYearFromUrl} from '../../reducers';
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

export const FootballScheduleScreen = () => {
  const location = useLocation();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // Initialize the source and target page titles from the URL.
  const selectedYear = useMemo(() => getYearFromUrl(location.pathname), [location]);
  const selectedGameIndex = useMemo(
    () => getSelectedGameIndexFromUrl(location.pathname),
    [location]
  );

  const gamesContent = _.map(schedule[selectedYear], (game, index) => {
    const gameClone = _.clone(game);

    gameClone.opponent = teams[game.opponentId];
    gameClone.opponent.abbreviation = game.opponentId;

    return (
      <Game
        key={index}
        index={index}
        game={gameClone}
        year={selectedYear}
        isSelected={index === selectedGameIndex}
      />
    );
  });

  const closeNavMenuIfOpen = () => {
    if (isNavMenuOpen) {
      setIsNavMenuOpen(false);
    }
  };

  let nextYear = selectedYear === 1889 ? 1892 : selectedYear + 1;
  let previousYear = selectedYear === 1892 ? 1889 : selectedYear - 1;

  return (
    <>
      <ScheduleScreenWrapper onClick={closeNavMenuIfOpen}>
        <Header>
          <PreviousYearLink className={selectedYear === 1887 && 'hidden'} to={`/${previousYear}`}>
            <span>&#x2190;</span>
            <Media query="(min-width: 700px)">
              <>{previousYear}</>
            </Media>
          </PreviousYearLink>

          <HeaderTitle>{`Notre Dame Football ${selectedYear}`}</HeaderTitle>

          <NextYearLink className={selectedYear === LATEST_YEAR && 'hidden'} to={`/${nextYear}`}>
            <Media query="(min-width: 700px)">
              <>{nextYear}</>
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
                    <GameSummary
                      selectedYear={selectedYear}
                      selectedGameIndex={selectedGameIndex}
                    />
                  </Route>
                  <Route path="/">
                    <GamesWrapper>{gamesContent}</GamesWrapper>
                  </Route>
                </Switch>
              ) : (
                <>
                  <GamesWrapper>{gamesContent}</GamesWrapper>
                  <GameSummary selectedYear={selectedYear} selectedGameIndex={selectedGameIndex} />
                </>
              )
            }
          </Media>
        </ScheduleWrapper>
      </ScheduleScreenWrapper>

      <NavMenuButton onClick={() => setIsNavMenuOpen(true)}>
        <span />
      </NavMenuButton>
      <NavMenu
        selectedYear={selectedYear}
        open={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
      />
    </>
  );
};

FootballScheduleScreen.propTypes = {};
