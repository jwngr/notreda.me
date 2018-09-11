import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import TotalScore from './TotalScore';
import GameStats from '../GameStats';
import LineScore from './Linescore';

import {
  Metadata,
  MetadataDate,
  CompletedGameWrapper,
  MetadataDateContainer,
  LinescoreMetadataWrapper,
} from './index.styles';

const CompletedGameSummary = ({game, homeTeam, awayTeam}) => {
  let date;
  let time;
  if ('fullDate' in game) {
    date = format(new Date(game.fullDate), 'MMMM D, YYYY');
    time = game.isTimeTbd ? 'TBD' : format(new Date(game.fullDate), 'h:mm A');
  } else {
    date = format(game.timestamp || game.date, 'MMMM D, YYYY');
    let time;
    if ('timestamp' in game) {
      time = format(game.timestamp || game.date, 'h:mm A');
    }
  }

  let tvCoverageIcon;
  if (game.coverage && game.coverage !== 'TBD') {
    tvCoverageIcon = (
      <img
        className="game-metadata-tv-coverage-icon"
        alt={`${game.coverage} logo`}
        src={require(`../../../images/tvLogos/${game.coverage.toLowerCase()}.png`)}
      />
    );
  }

  // TODO: get correct stadium
  return (
    <CompletedGameWrapper>
      <TotalScore game={game} homeTeam={homeTeam} awayTeam={awayTeam} />

      <LinescoreMetadataWrapper>
        <LineScore linescore={game.linescore} homeTeam={homeTeam} awayTeam={awayTeam} />
        <Metadata>
          <MetadataDateContainer>
            <MetadataDate>{date}</MetadataDate>
          </MetadataDateContainer>
          <div className="game-metadata-content">
            <p className="game-metadata-stadium">Notre Dame Stadium</p>
            <p className="game-metadata-location">{game.location}</p>
            <div className="game-metadata-coverage">
              {tvCoverageIcon}
              <p>{time}</p>
            </div>
          </div>
        </Metadata>
      </LinescoreMetadataWrapper>

      <GameStats stats={game.stats} awayTeam={awayTeam} homeTeam={homeTeam} />
    </CompletedGameWrapper>
  );
};

CompletedGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default CompletedGameSummary;
