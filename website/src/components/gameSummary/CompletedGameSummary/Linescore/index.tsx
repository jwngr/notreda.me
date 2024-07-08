import range from 'lodash/range';
import React from 'react';

import {DEFAULT_TEAM_COLOR} from '../../../../lib/constants';
import {GameLinescore, Team, TeamId} from '../../../../models';
import teamsJson from '../../../../resources/teams.json';
import {YouTubeIcon} from '../../../common/YouTubeIcon';
import {AbbreviationColumn, LinescoreWrapper, ScoreColumn} from './index.styles';

const teams = teamsJson as Record<TeamId, Team>;

export const Linescore: React.FC<{
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
  readonly linescore: GameLinescore | null;
  readonly highlightsYouTubeVideoId: string | null;
}> = ({homeTeamId, awayTeamId, linescore, highlightsYouTubeVideoId}) => {
  const homeTeam = teams[homeTeamId];
  const awayTeam = teams[awayTeamId];

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
