import {darken, lighten} from 'polished';
import React, {useEffect, useMemo, useState} from 'react';
import Media from 'react-media';
import {Link, useParams} from 'react-router-dom';
import styled from 'styled-components';

import {FlexRow} from '../components/common/Flex';
import {Game} from '../components/Game';
import {GameSummary} from '../components/gameSummary/GameSummary';
import {NavMenu} from '../components/navMenu/NavMenu';
import {LATEST_SEASON} from '../lib/constants';
import {Schedules} from '../lib/schedules';
import {getSelectedGameIndexFromUrlParam, getSelectedSeasonFromUrlParam} from '../lib/urls';
import {GameInfo} from '../models/games.models';

const ScheduleScreenWrapper = styled.div`
  transition: transform 0.5s;
  margin: 28px;
  padding: 24px;
  border: solid 3px ${({theme}) => theme.colors.black};
  background-color: ${({theme}) => theme.colors.gold}66;

  @media (max-width: 768px) {
    margin: 39px 6px 6px 6px;
    padding: 40px 0px 0px 0px;
  }
`;

const ScheduleWrapper = styled(FlexRow).attrs({align: 'flex-start'})`
  margin-top: 8px;

  & > div:first-of-type {
    margin-right: 12px;
  }

  & > div:last-of-type {
    margin-left: 12px;
  }

  @media (max-width: 1023px and min-width: 801px) {
    & > div:first-of-type {
      width: 40%;
    }

    & > div:last-of-type {
      width: 60%;
    }
  }

  @media (max-width: 950px) {
    margin-top: 0;

    & > div:first-of-type,
    & > div:last-of-type {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
    }
  }
`;

const GamesWrapper = styled.div`
  flex: 1;
`;

const NavMenuButton = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  height: 47px;
  padding: 10px;
  cursor: pointer;
  z-index: 2;

  /* Middle line */
  & > span {
    display: inline-block;
    width: 2rem;
    height: calc(2rem / 7);
    background: ${({theme}) => theme.colors.green};
    border: solid 1px ${({theme}) => theme.colors.black};
    border-radius: calc(2rem / 14);
    position: relative;
  }

  /* Upper and lower lines (pseudo-elements of the middle line) */
  & > span:before,
  & > span:after {
    display: inline-block;
    width: 2rem;
    height: calc(2rem / 7);
    background: ${({theme}) => theme.colors.green};
    border: solid 1px ${({theme}) => theme.colors.black};
    border-radius: calc(2rem / 14);
    position: absolute;
    left: 0;
    content: '';
    margin-left: -1px;
    transform-origin: calc(2rem / 14) center;
  }

  & > span:before {
    top: calc(2rem / 4);
  }

  & > span:after {
    top: calc((-2rem / 4) - 2px);
  }

  @media (max-width: 768px) {
    top: -2px;
    right: 0;
  }

  @media (max-width: 400px) {
    top: -2px;
    right: 8px;
  }
`;

const Header = styled(FlexRow).attrs({justify: 'center'})`
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 56px;
  text-align: center;

  @media (max-width: 768px) {
    height: 80px;
  }
`;

const HeaderTitle = styled.div`
  font-family: 'Bungee';
  font-size: 32px;
  color: ${({theme}) => theme.colors.white};
  padding: 2px 6px;
  margin: 0 32px;
  background-color: ${({theme}) => theme.colors.green};
  border: solid 3px ${({theme}) => theme.colors.black};
  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.green)};
  text-shadow: ${({theme}) => theme.colors.black} 2px 2px;

  @media (max-width: 1200px) {
    font-size: 28px;
    margin: 0 20px;
  }

  @media (max-width: 950px) {
    font-size: 24px;
    margin: 0 12px;
  }

  @media (max-width: 768px) {
    width: 228px;
    font-size: 24px;
  }
`;

interface PreviousAndNextYearLinkProps {
  readonly $isVisible: boolean;
}

const PreviousAndNextYearLink = styled(Link)<PreviousAndNextYearLinkProps>`
  font-family: 'Bungee';
  font-size: 18px;
  text-decoration: none;
  -webkit-text-stroke: 1px;
  -webkit-text-stroke-color: ${({theme}) => theme.colors.black};
  text-shadow: ${({theme}) => theme.colors.black} 1px 1px;
  padding: 2px 4px;
  color: ${({theme}) => theme.colors.white};
  background-color: ${({theme}) => theme.colors.green};
  border: solid 3px ${({theme}) => theme.colors.black};

  &:hover {
    background-color: ${({theme}) => lighten(0.1, theme.colors.green)};
  }

  ${({$isVisible}) => ($isVisible ? null : 'visibility: hidden;')}

  @media (max-width: 1200px) {
    font-size: 16px;
  }

  @media (max-width: 1023px) {
    display: none;
  }
`;

const PreviousYearLink = styled(PreviousAndNextYearLink)`
  padding-left: 0;

  span {
    margin-right: 2px;
  }

  &:hover {
    animation: pullBackwards 0.8s infinite ease-in-out;
  }

  @keyframes pullBackwards {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(-4px, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 1024px) {
    padding-left: 4px;

    &:hover {
      animation: none;
    }

    span {
      display: none;
    }
  }
`;

const NextYearLink = styled(PreviousAndNextYearLink)`
  padding-right: 0;

  span {
    margin-left: 2px;
  }

  &:hover {
    animation: pushForwards 0.8s infinite ease-in-out;
  }

  @keyframes pushForwards {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(4px, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 1024px) {
    padding-right: 4px;

    &:hover {
      animation: none;
    }

    span {
      display: none;
    }
  }
`;

export const FootballScheduleScreen: React.FC = () => {
  const params = useParams<{
    readonly selectedYear?: string;
    readonly selectedGameIndex?: string;
  }>();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [seasonSchedule, setSeasonSchedule] = useState<readonly GameInfo[] | null>(null);

  // Get the selected season and game index from the URL.
  const {selectedSeason, selectedGameIndex} = useMemo(() => {
    const selectedSeasonInner = getSelectedSeasonFromUrlParam(params.selectedYear);
    return {
      selectedSeason: selectedSeasonInner,
      selectedGameIndex: getSelectedGameIndexFromUrlParam({
        year: selectedSeasonInner,
        maybeWeekString: params.selectedGameIndex,
        seasonSchedule,
      }),
    };
  }, [params.selectedYear, params.selectedGameIndex, seasonSchedule]);

  useEffect(() => {
    const fetchGames = async () => {
      const games = await Schedules.getForSeason(selectedSeason);
      setSeasonSchedule(games);
    };
    fetchGames();
  }, [selectedSeason]);

  if (!seasonSchedule) return null;

  const gamesContent = seasonSchedule.map((game, index) => {
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
          <PreviousYearLink to={`/${previousYear}`} $isVisible={selectedSeason !== 1887}>
            <span>&#x2190;</span>
            <Media query="(min-width: 700px)">
              <>{previousYear}</>
            </Media>
          </PreviousYearLink>

          <HeaderTitle>{`Notre Dame Football ${selectedSeason}`}</HeaderTitle>

          <NextYearLink to={`/${nextYear}`} $isVisible={selectedSeason !== LATEST_SEASON}>
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
