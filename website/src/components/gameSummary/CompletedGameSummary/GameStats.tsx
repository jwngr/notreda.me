import {darken} from 'polished';
import React from 'react';
import styled from 'styled-components';

import {DEFAULT_TEAM_COLOR} from '../../../lib/constants';
import {Teams} from '../../../lib/teams';
import {GameStats, TeamId} from '../../../models';
import {GameStatsRow} from './GameStatsRow';
import {
  STATS_HEADER_COLUMN_STYLES,
  STATS_HEADER_SPACER_STYLES,
  STATS_SECTION_BREAKPOINTS,
} from './index.styles';

const GameStatsWrapper = styled.div`
  width: 100%;
  margin-top: 32px;
  border: solid 3px ${({theme}) => theme.colors.black};
`;

const GameStatsHeaderRow = styled.div`
  width: 100%;
  padding: 0;
  display: flex;
  margin-top: -17px;
`;

interface GameStatsHeaderProps {
  readonly $longestHeaderTextLength: number;
}

const GameStatsHeader = styled.div<GameStatsHeaderProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;

  p {
    flex: 1;
    min-width: 132px;
    max-width: 200px;
    display: flex;
    padding: 4px 0;
    text-align: center;
    align-items: center;
    justify-content: center;
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.green)};
    text-shadow: ${({theme}) => theme.colors.black} 1px 1px;
    font-family: 'Bungee';
    font-size: ${({$longestHeaderTextLength}) => ($longestHeaderTextLength > 14 ? '12px' : '14px')};
    color: ${({theme}) => theme.colors.white};
    border: solid 3px ${({theme}) => theme.colors.black};
  }

  @media (min-width: ${STATS_SECTION_BREAKPOINTS[0] + 1}px) {
    ${STATS_HEADER_COLUMN_STYLES.leftLarge}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[0]}px) {
    ${STATS_HEADER_COLUMN_STYLES.leftSmall}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[1]}px) {
    ${STATS_HEADER_COLUMN_STYLES.middle}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[2]}px) {
    ${STATS_HEADER_COLUMN_STYLES.leftLarge}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[3]}px) {
    ${STATS_HEADER_COLUMN_STYLES.middle}
  }
`;

const GameStatsHeaderSpacer = styled.div`
  ${STATS_HEADER_SPACER_STYLES.left}

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[1]}px) {
    ${STATS_HEADER_SPACER_STYLES.middle}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[2]}px) {
    ${STATS_HEADER_SPACER_STYLES.left}
  }

  @media (max-width: ${STATS_SECTION_BREAKPOINTS[3]}px) {
    ${STATS_HEADER_SPACER_STYLES.middle}
  }
`;

export const CompletedGameStats: React.FC<{
  readonly stats: GameStats | null;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
}> = ({stats, homeTeamId, awayTeamId}) => {
  const homeTeam = Teams.getTeam(homeTeamId);
  const awayTeam = Teams.getTeam(awayTeamId);

  // Return early for games which do not have any stats (such as older or future games).
  // TODO: Make this not required.
  if (!stats) return null;

  const homeTeamColorStyles = {
    backgroundColor: homeTeam.color || DEFAULT_TEAM_COLOR,
  };

  const awayTeamColorStyles = {
    backgroundColor: awayTeam.color || DEFAULT_TEAM_COLOR,
  };

  const fumblesRow = stats.away.fumbles ? (
    <GameStatsRow
      statName="Fumbles - Lost"
      reverseComparison={true}
      awayTeam={awayTeam}
      homeTeam={homeTeam}
      awayValue={`${stats.away.fumbles} - ${stats.away.fumblesLost}`}
      homeValue={`${stats.home.fumbles} - ${stats.home.fumblesLost}`}
    />
  ) : (
    <GameStatsRow
      statName="Fumbles Lost"
      reverseComparison={true}
      awayTeam={awayTeam}
      homeTeam={homeTeam}
      awayValue={`${stats.away.fumblesLost}`}
      homeValue={`${stats.home.fumblesLost}`}
    />
  );

  // Some historical teams do not have a nickname, so display their short name or full name instead.
  const awayTeamHeaderText = awayTeam.nickname || awayTeam.shortName || awayTeam.name;
  const homeTeamHeaderText = homeTeam.nickname || homeTeam.shortName || homeTeam.name;

  const longestHeaderTextLength = Math.max(awayTeamHeaderText.length, homeTeamHeaderText.length);

  return (
    <GameStatsWrapper>
      <GameStatsHeaderRow>
        <GameStatsHeaderSpacer />
        <GameStatsHeader $longestHeaderTextLength={longestHeaderTextLength}>
          <p style={awayTeamColorStyles}>{awayTeamHeaderText}</p>
        </GameStatsHeader>
        <GameStatsHeader $longestHeaderTextLength={longestHeaderTextLength}>
          <p style={homeTeamColorStyles}>{homeTeamHeaderText}</p>
        </GameStatsHeader>
      </GameStatsHeaderRow>

      <GameStatsRow
        isStatsGroupRow={true}
        statName="1st Downs"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['firstDowns']}
        homeValue={stats.home['firstDowns']}
      />

      <GameStatsRow
        statName="3rd Down Efficiency"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={`${stats.away['thirdDownConversions']} / ${stats.away['thirdDownAttempts']}`}
        homeValue={`${stats.home['thirdDownConversions']} / ${stats.home['thirdDownAttempts']}`}
      />

      <GameStatsRow
        statName="4th Down Efficiency"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={`${stats.away['fourthDownConversions']} / ${stats.away['fourthDownAttempts']}`}
        homeValue={`${stats.home['fourthDownConversions']} / ${stats.home['fourthDownAttempts']}`}
      />

      <GameStatsRow
        isStatsGroupRow={true}
        statName="Total Yards"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['passYards'] + stats.away['rushYards']}
        homeValue={stats.home['passYards'] + stats.home['rushYards']}
      />

      <GameStatsRow
        isStatsGroupRow={true}
        statName="Pass Yards"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['passYards']}
        homeValue={stats.home['passYards']}
      />

      <GameStatsRow
        statName="Completions / Attempts"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={`${stats.away['passCompletions']} / ${stats.away['passAttempts']}`}
        homeValue={`${stats.home['passCompletions']} / ${stats.home['passAttempts']}`}
      />

      <GameStatsRow
        statName="Yards Per Pass"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={Number(stats.away['yardsPerPass']).toFixed(1)}
        homeValue={Number(stats.home['yardsPerPass']).toFixed(1)}
      />

      <GameStatsRow
        isStatsGroupRow={true}
        statName="Rush Yards"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['rushYards']}
        homeValue={stats.home['rushYards']}
      />

      <GameStatsRow
        statName="Rush Attempts"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['rushAttempts']}
        homeValue={stats.home['rushAttempts']}
      />

      <GameStatsRow
        statName="Yards Per Rush"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={Number(stats.away['yardsPerRush']).toFixed(1)}
        homeValue={Number(stats.home['yardsPerRush']).toFixed(1)}
      />

      <GameStatsRow
        isStatsGroupRow={true}
        reverseComparison={true}
        statName="Turnovers"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['interceptionsThrown'] + stats.away['fumblesLost']}
        homeValue={stats.home['interceptionsThrown'] + stats.home['fumblesLost']}
      />

      {fumblesRow}

      <GameStatsRow
        statName="Interceptions Thrown"
        reverseComparison={true}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['interceptionsThrown']}
        homeValue={stats.home['interceptionsThrown']}
      />

      <GameStatsRow
        isStatsGroupRow={true}
        reverseComparison={true}
        statName="Penalties"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={`${stats.away['penalties']} - ${stats.away['penaltyYards']}`}
        homeValue={`${stats.home['penalties']} - ${stats.home['penaltyYards']}`}
      />

      <GameStatsRow
        isStatsGroupRow={true}
        statName="Possession"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['possession']}
        homeValue={stats.home['possession']}
      />
    </GameStatsWrapper>
  );
};
