import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import {ScoreColumn, LinescoreWrapper, AbbreviationColumn} from './index.styles';

import {getDefaultTeamColor} from '../../../../utils';

const Linescore = ({linescore, homeTeam, awayTeam}) => {
  // TODO: remove once all games have a linescore
  if (linescore.home.length === 0) {
    return null;
  }

  const homeTeamColorStyles = {
    color: homeTeam.color || getDefaultTeamColor(),
  };

  const awayTeamColorStyles = {
    color: awayTeam.color || getDefaultTeamColor(),
  };

  let totalScores = {
    home: 0,
    away: 0,
  };

  const numQuarters = linescore.home.length;
  const quarterScoreColumns = _.map(_.range(0, numQuarters), (i) => {
    totalScores.home += linescore.home[i];
    totalScores.away += linescore.away[i];

    let header = i < 4 ? i + 1 : `OT ${i - 3}`;

    return (
      <ScoreColumn key={header}>
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
        <p style={awayTeamColorStyles}>{awayTeam.abbreviation}</p>
        <p style={homeTeamColorStyles}>{homeTeam.abbreviation}</p>
      </AbbreviationColumn>
      {quarterScoreColumns}
      <ScoreColumn>
        <p>T</p>
        <p style={awayTeamColorStyles}>{totalScores.away}</p>
        <p style={homeTeamColorStyles}>{totalScores.home}</p>
      </ScoreColumn>
    </LinescoreWrapper>
  );
};

Linescore.propTypes = {
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
  linescore: PropTypes.object.isRequired,
};

export default Linescore;
