import React from 'react';
import PropTypes from 'prop-types';

import GameStatsRow from '../GameStatsRow';

import {GameStatsHeader, GameStatsWrapper, StatsUnavailable} from './index.styles';

import {getDefaultTeamColor} from '../../../../utils';

const GameStats = ({stats, homeTeam, awayTeam}) => {
  // TODO: remove once all games has stats
  if (stats.home.totalYards === -1) {
    // TODO: have plan for this before launch.
    return (
      <StatsUnavailable>
        Stats for this game are not yet available.{' '}
        <a href="https://github.com/jwngr/notreda.me/issues/1">I'm looking for help</a> collecting
        historical Notre Dame game stats.
      </StatsUnavailable>
    );
  }

  const homeTeamColorStyles = {
    backgroundColor: homeTeam.color || getDefaultTeamColor(),
  };

  const awayTeamColorStyles = {
    backgroundColor: awayTeam.color || getDefaultTeamColor(),
  };

  return (
    <GameStatsWrapper>
      <GameStatsHeader>
        <p />
        <p style={awayTeamColorStyles}>{awayTeam.nickname}</p>
        <p style={homeTeamColorStyles}>{homeTeam.nickname}</p>
      </GameStatsHeader>

      <GameStatsRow
        isHeaderRow={true}
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
        awayValue={`${stats.away['thirdDownAttempts']} / ${stats.away['thirdDownConversions']}`}
        homeValue={`${stats.home['thirdDownAttempts']} / ${stats.home['thirdDownConversions']}`}
      />

      <GameStatsRow
        statName="4th Down Efficiency"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={`${stats.away['fourthDownAttempts']} / ${stats.away['fourthDownConversions']}`}
        homeValue={`${stats.home['fourthDownAttempts']} / ${stats.home['fourthDownConversions']}`}
      />

      <GameStatsRow
        isHeaderRow={true}
        statName="Total Yards"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['passYards'] + stats.away['rushYards']}
        homeValue={stats.home['passYards'] + stats.home['rushYards']}
      />

      <GameStatsRow
        isHeaderRow={true}
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
        isHeaderRow={true}
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
        isHeaderRow={true}
        reverseComparison={true}
        statName="Turnovers"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['interceptionsThrown'] + stats.away['fumblesLost']}
        homeValue={stats.home['interceptionsThrown'] + stats.home['fumblesLost']}
      />

      <GameStatsRow
        statName="Fumbles - Lost"
        reverseComparison={true}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={`${stats.away['fumbles']} - ${stats.away['fumblesLost']}`}
        homeValue={`${stats.home['fumbles']} - ${stats.home['fumblesLost']}`}
      />

      <GameStatsRow
        statName="Interceptions Thrown"
        reverseComparison={true}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['interceptionsThrown']}
        homeValue={stats.home['interceptionsThrown']}
      />

      <GameStatsRow
        isHeaderRow={true}
        reverseComparison={true}
        statName="Penalties"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={`${stats.away['penalties']} - ${stats.away['penaltyYards']}`}
        homeValue={`${stats.home['penalties']} - ${stats.home['penaltyYards']}`}
      />

      <GameStatsRow
        isHeaderRow={true}
        statName="Possession"
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        awayValue={stats.away['possession']}
        homeValue={stats.home['possession']}
      />
    </GameStatsWrapper>
  );
};

GameStats.propTypes = {
  stats: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default GameStats;
