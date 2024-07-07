import _ from 'lodash';
import React, {useMemo, useState} from 'react';
import Media from 'react-media';
import {useParams} from 'react-router-dom';

import {Game} from '../../components/Game';
import {GameSummary} from '../../components/gameSummary/GameSummary';
import {NavMenu} from '../../components/NavMenu';
import {LATEST_YEAR} from '../../lib/constants';
import {getSelectedGameIndexFromUrlParam, getSelectedSeasonFromUrlParam} from '../../lib/urls';
import {FullSchedule} from '../../models';
import scheduleJson from '../../resources/schedule.json';
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

const schedule = scheduleJson as FullSchedule;

export const FootballScheduleScreen: React.FC = () => {
  const params = useParams<{
    readonly selectedYear?: string;
    readonly selectedGameIndex?: string;
  }>();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // Get the selected season and game index from the URL.
  const {selectedSeason, selectedGameIndex} = useMemo(() => {
    const selectedSeasonInner = getSelectedSeasonFromUrlParam(params.selectedYear);
    return {
      selectedSeason: selectedSeasonInner,
      selectedGameIndex: getSelectedGameIndexFromUrlParam(
        selectedSeasonInner,
        params.selectedGameIndex
      ),
    };
  }, [params.selectedYear, params.selectedGameIndex]);

  const gamesContent = _.map(schedule[selectedSeason], (game, index) => {
    return (
      <Game
        key={index}
        index={index}
        game={game}
        season={selectedSeason}
        isSelected={index === selectedGameIndex}
      />
    );
  });

  const closeNavMenuIfOpen = () => {
    if (isNavMenuOpen) {
      setIsNavMenuOpen(false);
    }
  };

  const nextYear = selectedSeason === 1889 ? 1892 : selectedSeason + 1;
  const previousYear = selectedSeason === 1892 ? 1889 : selectedSeason - 1;

  return (
    <>
      <ScheduleScreenWrapper onClick={closeNavMenuIfOpen}>
        <Header>
          <PreviousYearLink
            className={selectedSeason === 1887 ? 'hidden' : undefined}
            to={`/${previousYear}`}
          >
            <span>&#x2190;</span>
            <Media query="(min-width: 700px)">
              <>{previousYear}</>
            </Media>
          </PreviousYearLink>

          <HeaderTitle>{`Notre Dame Football ${selectedSeason}`}</HeaderTitle>

          <NextYearLink
            className={selectedSeason === LATEST_YEAR ? 'hidden' : undefined}
            to={`/${nextYear}`}
          >
            <Media query="(min-width: 700px)">
              <>{nextYear}</>
            </Media>
            <span>&#x2192;</span>
          </NextYearLink>
        </Header>

        <ScheduleWrapper>
          <Media query="(max-width: 950px)">
            {(isSmallerScreen) =>
              isSmallerScreen ? (
                params.selectedGameIndex ? (
                  <GameSummary
                    selectedSeason={selectedSeason}
                    selectedGameIndex={selectedGameIndex}
                  />
                ) : (
                  <GamesWrapper>{gamesContent}</GamesWrapper>
                )
              ) : (
                <>
                  <GamesWrapper>{gamesContent}</GamesWrapper>
                  <GameSummary
                    selectedSeason={selectedSeason}
                    selectedGameIndex={selectedGameIndex}
                  />
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
        selectedSeason={selectedSeason}
        open={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
      />
    </>
  );
};
