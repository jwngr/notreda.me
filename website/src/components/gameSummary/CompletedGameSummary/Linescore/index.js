import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import YouTubeIcon from '../../../common/YouTubeIcon';

import {ScoreColumn, LinescoreWrapper, AbbreviationColumn} from './index.styles';

import {DEFAULT_TEAM_COLOR} from '../../../../lib/constants';

const Linescore = ({homeTeam, awayTeam, linescore, highlightsYouTubeVideoId}) => {
  // TODO: remove once all games have a linescore
  if (linescore.home.length === 0) {
    return null;
  }

  const homeTeamColorStyles = {
    color: homeTeam.color || DEFAULT_TEAM_COLOR,
  };

  const awayTeamColorStyles = {
    color: awayTeam.color || DEFAULT_TEAM_COLOR,
  };

  let totalScores = {
    home: 0,
    away: 0,
  };

  const numQuarters = linescore.home.length;
  const quarterScoreColumns = _.map(_.range(0, numQuarters), (i) => {
    totalScores.home += linescore.home[i];
    totalScores.away += linescore.away[i];

    let header = i + 1;
    if (i >= 4) {
      if (numQuarters > 6) {
        header = `OT${i - 3}`;
      } else {
        header = `OT ${i - 3}`;
      }
    }
    const classes = classNames({
      'overtime-header': i >= 4,
      'three-plus-overtime-header': i >= 4 && numQuarters > 6,
    });

    return (
      <ScoreColumn key={header}>
        <p className={classes}>{header}</p>
        <p>{linescore.away[i]}</p>
        <p>{linescore.home[i]}</p>
      </ScoreColumn>
    );
  });

  return (
    <LinescoreWrapper>
      <AbbreviationColumn>
        <p>&nbsp;</p>
        <p style={awayTeamColorStyles}>{awayTeam.abbreviation}</p>
        <p style={homeTeamColorStyles}>{homeTeam.abbreviation}</p>
      </AbbreviationColumn>
      {quarterScoreColumns}
      <ScoreColumn>
        <p>T</p>
        <p style={awayTeamColorStyles}>{totalScores.away}</p>
        <p style={homeTeamColorStyles}>{totalScores.home}</p>
      </ScoreColumn>
      {highlightsYouTubeVideoId && (
        <YouTubeIcon
          title="Video highlights"
          style={{width: '40px', marginTop: '16px'}}
          highlightsYouTubeVideoId={highlightsYouTubeVideoId}
        />
      )}
    </LinescoreWrapper>
  );
};

Linescore.propTypes = {
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
  linescore: PropTypes.object.isRequired,
  highlightsYouTubeVideoId: PropTypes.string,
};

export default Linescore;
