import capitalize from 'lodash/capitalize';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {useMediaQuery} from '../../hooks/useMediaQuery';
import {
  ExpandedGameInfo,
  getFilteredMatchupsAgainstTeam,
  getMatchupsAgainstTeam,
} from '../../lib/matchupHistory';
import {useWindowSize} from '../../lib/useWindowSize';
import {GameInfo} from '../../models/games.models';
import {FlexColumn, FlexRow} from '../common/Flex';
import {StatsSection} from '../common/StatsSection';
import {HistoricalMatchup} from './HistoricalMatchup';

const MatchupHistoryWrapper = styled(FlexColumn).attrs({justify: 'center'})``;

const Records = styled(FlexRow).attrs({justify: 'center'})`
  width: 100%;
  margin-bottom: 20px;

  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & > p:first-of-type {
      font-size: 16px;
      font-family: 'Inter', serif;
    }

    & > p:last-of-type {
      font-size: 20px;
      font-family: 'Bungee';
    }
  }
`;

interface RecentMatchupsProps {
  readonly $matchupsCount: number;
}

const RecentMatchups = styled(FlexRow).attrs({justify: 'center'})<RecentMatchupsProps>`
  width: 100%;
  margin-top: ${({$matchupsCount}) => ($matchupsCount > 1 ? '-60px' : 0)};
`;

const _getMaxMatchupsCountFromWindowWidth = (width: number): number => {
  if (width > 1420) {
    return 15;
  } else if (width > 1326) {
    return 13;
  } else if (width > 1250) {
    return 11;
  } else if (width > 1200) {
    return 9;
  } else if (width > 1110) {
    return 11;
  } else if (width > 970) {
    return 9;
  } else if (width > 950) {
    return 7;
  } else if (width > 680) {
    return 15;
  } else if (width > 600) {
    return 13;
  } else if (width > 520) {
    return 11;
  } else if (width > 440) {
    return 9;
  } else if (width > 360) {
    return 7;
  } else {
    return 5;
  }
};

export const MatchupHistory: React.FC<{
  readonly selectedGame: GameInfo;
  readonly selectedSeason: number;
}> = ({selectedGame, selectedSeason}) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const {width} = useWindowSize();
  const maxMatchupsCount = _getMaxMatchupsCountFromWindowWidth(width);

  const [matchupInfo, setMatchupInfo] = useState<{
    readonly pastMatchupsAgainstTeam: readonly ExpandedGameInfo[] | null;
    readonly futureMatchupsAgainstTeam: readonly ExpandedGameInfo[] | null;
    readonly matchupsToShow: readonly ExpandedGameInfo[] | null;
  }>({pastMatchupsAgainstTeam: null, futureMatchupsAgainstTeam: null, matchupsToShow: null});

  useEffect(() => {
    const fetchMatchupsToShow = async () => {
      const {past: pastMatchupsAgainstTeam, future: futureMatchupsAgainstTeam} =
        await getMatchupsAgainstTeam(selectedGame.opponentId);

      const matchupsToShow = await getFilteredMatchupsAgainstTeam({
        opponentId: selectedGame.opponentId,
        selectedSeason,
        maxMatchupsCount,
        pastMatchupsAgainstTeam,
        futureMatchupsAgainstTeam,
      });
      setMatchupInfo({pastMatchupsAgainstTeam, futureMatchupsAgainstTeam, matchupsToShow});
    };
    fetchMatchupsToShow();
  }, [selectedGame.opponentId, selectedSeason, maxMatchupsCount]);

  const recordAgainstTeam = {
    overall: {W: 0, L: 0, T: 0},
    home: {W: 0, L: 0, T: 0},
    away: {W: 0, L: 0, T: 0},
  };

  if (
    !matchupInfo.pastMatchupsAgainstTeam ||
    !matchupInfo.futureMatchupsAgainstTeam ||
    !matchupInfo.matchupsToShow
  ) {
    return null;
  }

  matchupInfo.pastMatchupsAgainstTeam.forEach(({result, isHomeGame}) => {
    if (!result) return;
    recordAgainstTeam.overall[result] += 1;
    recordAgainstTeam[isHomeGame ? 'home' : 'away'][result] += 1;
  });

  const selectedGameHomeOrAway = selectedGame.isHomeGame ? 'home' : 'away';
  const allSeasonsWithMatchupsAgainstTeam = [
    ...matchupInfo.pastMatchupsAgainstTeam,
    ...matchupInfo.futureMatchupsAgainstTeam,
  ].map(({season}) => season);

  const shownMatchupsCount = matchupInfo.matchupsToShow.length;

  return (
    <StatsSection title="Matchup History" style={{marginTop: '32px'}}>
      <MatchupHistoryWrapper>
        <Records>
          <div>
            <p>Meetings</p>
            <p>
              {recordAgainstTeam.overall.W +
                recordAgainstTeam.overall.L +
                recordAgainstTeam.overall.T}
            </p>
          </div>
          <div>
            <p>{isMobile ? 'Overall' : 'Overall Record'}</p>
            <p>
              {recordAgainstTeam.overall.W}-{recordAgainstTeam.overall.L}-
              {recordAgainstTeam.overall.T}
            </p>
          </div>
          <div>
            <p>
              {isMobile
                ? capitalize(selectedGameHomeOrAway)
                : `${capitalize(selectedGameHomeOrAway)} Record`}
            </p>
            <p>
              {recordAgainstTeam[selectedGameHomeOrAway].W}-
              {recordAgainstTeam[selectedGameHomeOrAway].L}-
              {recordAgainstTeam[selectedGameHomeOrAway].T}
            </p>
          </div>
        </Records>
        <RecentMatchups $matchupsCount={shownMatchupsCount}>
          {matchupInfo.matchupsToShow.map((historicalGame, i) => {
            if (!historicalGame) return null;

            const specialPositions = {first: i === 0, last: i === shownMatchupsCount - 1};

            const isFirst = i === 0;
            const isLast = i === shownMatchupsCount - 1;
            const previousHistoricalGame = matchupInfo?.matchupsToShow?.[i - 1];
            const nextHistoricalGame = matchupInfo?.matchupsToShow?.[i + 1];

            return (
              <HistoricalMatchup
                key={`historical-matchup-${historicalGame.season}-${historicalGame.weekIndex}`}
                score={historicalGame.score ?? null}
                result={historicalGame.result ?? null}
                season={historicalGame.season}
                weekIndex={historicalGame.weekIndex}
                isHomeGame={historicalGame.isHomeGame}
                isSelected={
                  // TODO: Introduce `Games.equals`
                  selectedGame.opponentId === historicalGame.opponentId &&
                  selectedGame.date === historicalGame.date &&
                  selectedGame.fullDate === historicalGame.fullDate
                }
                isSeasonOnTop={i % 2 === 0}
                // Show gap indicators on either side if the previous / next displayed season is
                // not actually the next / previous season due to list truncation.
                // TODO: Properly handle seasons with multiple games against the same team (e.g.
                // Clemson 2020).
                gaps={{
                  left: Boolean(
                    !isFirst &&
                      previousHistoricalGame &&
                      allSeasonsWithMatchupsAgainstTeam.indexOf(historicalGame.season) !==
                        allSeasonsWithMatchupsAgainstTeam.indexOf(previousHistoricalGame.season) + 1
                  ),
                  right: Boolean(
                    !isLast &&
                      nextHistoricalGame &&
                      allSeasonsWithMatchupsAgainstTeam.indexOf(historicalGame.season) !==
                        allSeasonsWithMatchupsAgainstTeam.indexOf(nextHistoricalGame.season) - 1
                  ),
                }}
                specialPositions={specialPositions}
              />
            );
          })}
        </RecentMatchups>
      </MatchupHistoryWrapper>
    </StatsSection>
  );
};
