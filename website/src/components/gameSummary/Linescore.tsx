import range from 'lodash/range';
import {darken} from 'polished';
import React from 'react';
import styled, {css} from 'styled-components';

import {DEFAULT_TEAM_COLOR} from '../../lib/constants';
import {Teams} from '../../lib/teams';
import {GameLinescore} from '../../models/games.models';
import {TeamId} from '../../models/teams.models';
import {FlexColumn, FlexRow} from '../common/Flex';
import {YouTubeIcon} from '../common/YouTubeIcon';

const LinescoreWrapper = styled(FlexRow).attrs({
  justify: 'space-around',
})`
  width: 100%;
  padding-right: 8px;
  margin-top: 32px;
  text-align: center;
  font-family: 'Bungee';
  border: solid 3px ${({theme}) => theme.colors.black};
`;

const LinescoreColumn = styled(FlexColumn).attrs({justify: 'center'})`
  margin-top: -17px;

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    height: 28px;
    margin-bottom: 4px;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 950px) {
    p:not(:first-of-type) {
      height: 40px;
    }
  }
`;

const AbbreviationColumn = styled(LinescoreColumn)`
  flex: 1;
  min-width: 80px;
  max-width: 100px;
  margin-top: -17px;

  @media (max-width: 950px) {
    font-size: 20px;
    flex: initial;
    max-width: 80px;
    min-width: initial;
  }
`;

interface ScoreColumnProps {
  readonly $isOvertimePeriod: boolean;
  readonly $isThirdOrLaterOvertimePeriod: boolean;
}

const ScoreColumn = styled(LinescoreColumn)<ScoreColumnProps>`
  width: 40px;

  p:first-of-type {
    white-space: nowrap;
    font-size: 16px;
    text-align: center;
    padding: 0 8px;
    background-color: ${({theme}) => theme.colors.green};
    border: solid 3px ${({theme}) => theme.colors.black};
    color: ${({theme}) => theme.colors.white};
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.green)};
    text-shadow: ${({theme}) => theme.colors.black} 1px 1px;

    ${({$isOvertimePeriod}) =>
      $isOvertimePeriod
        ? css`
            font-size: 14px;
            padding: 0 2px;
          `
        : null}
  }

  @media (max-width: 600px) {
    p:first-of-type {
      ${({$isThirdOrLaterOvertimePeriod}) =>
        $isThirdOrLaterOvertimePeriod
          ? css`
              font-size: 12px;
              padding: 0;
            `
          : null}
    }
  }
`;

export const Linescore: React.FC<{
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
  readonly linescore: GameLinescore | null;
  readonly highlightsYouTubeVideoId: string | null;
}> = ({homeTeamId, awayTeamId, linescore, highlightsYouTubeVideoId}) => {
  const homeTeam = Teams.getTeam(homeTeamId);
  const awayTeam = Teams.getTeam(awayTeamId);

  if (!linescore || linescore.home.length === 0) {
    return null;
  }

  const homeTeamColorStyles = {
    color: homeTeam.color || DEFAULT_TEAM_COLOR,
  };

  const awayTeamColorStyles = {
    color: awayTeam.color || DEFAULT_TEAM_COLOR,
  };

  const totalScores = {
    home: 0,
    away: 0,
  };

  const numQuarters = linescore.home.length;
  const quarterScoreColumns = range(0, numQuarters).map((i) => {
    totalScores.home += linescore.home[i];
    totalScores.away += linescore.away[i];

    let header = String(i + 1);
    if (i >= 4) {
      if (numQuarters > 6) {
        header = `OT${i - 3}`;
      } else {
        header = `OT ${i - 3}`;
      }
    }

    return (
      <ScoreColumn
        key={header}
        $isOvertimePeriod={i >= 4}
        $isThirdOrLaterOvertimePeriod={i >= 4 && numQuarters > 6}
      >
        <p>{header}</p>
        <p>{linescore.away[i]}</p>
        <p>{linescore.home[i]}</p>
      </ScoreColumn>
    );
  });

  return (
    <LinescoreWrapper>
      <AbbreviationColumn>
        <p>&nbsp;</p>
        <p style={awayTeamColorStyles}>{awayTeamId}</p>
        <p style={homeTeamColorStyles}>{homeTeamId}</p>
      </AbbreviationColumn>
      {quarterScoreColumns}
      <ScoreColumn $isOvertimePeriod={false} $isThirdOrLaterOvertimePeriod={false}>
        <p>T</p>
        <p style={awayTeamColorStyles}>{totalScores.away}</p>
        <p style={homeTeamColorStyles}>{totalScores.home}</p>
      </ScoreColumn>
      {highlightsYouTubeVideoId ? (
        <YouTubeIcon title="Video highlights" highlightsYouTubeVideoId={highlightsYouTubeVideoId} />
      ) : null}
    </LinescoreWrapper>
  );
};
