import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import {
  MetadataDate,
  MetadataWrapper,
  MetadataContent,
  MetadataCoverage,
  MetadataLocation,
  MetadataDateContainer,
} from './index.styles';

const Metadata = ({game}) => {
  let date;
  let time;
  if ('fullDate' in game) {
    date = format(new Date(game.fullDate), 'MMMM D, YYYY');
    time = game.isTimeTbd ? 'TBD' : format(new Date(game.fullDate), 'h:mm A');
  } else {
    date = format(game.timestamp || game.date, 'MMM. D, YYYY');
    if ('timestamp' in game) {
      time = format(game.timestamp || game.date, 'h:mm A');
    }
  }

  let tvCoverageContent;
  if (game.coverage) {
    try {
      tvCoverageContent = (
        <img
          alt={`${game.coverage} logo`}
          src={require(`../../../../images/tvLogos/${game.coverage.toLowerCase()}.png`)}
        />
      );
    } catch (error) {
      tvCoverageContent = <p>{game.coverage}</p>;
    }
  }

  let metadataCoverage;
  if (time && time !== 'TBD' && tvCoverageContent) {
    console.log('5');
    metadataCoverage = (
      <MetadataCoverage>
        {tvCoverageContent}
        <p>{time}</p>
      </MetadataCoverage>
    );
  } else if (time && time !== 'TBD') {
    console.log('6');
    metadataCoverage = (
      <MetadataCoverage>
        <p>{time}</p>
      </MetadataCoverage>
    );
  }

  let stadium = game.location.stadium || null;
  let location = game.location.state
    ? `${game.location.city}, ${game.location.state}`
    : `${game.location.city}, ${game.location.country}`;

  return (
    <MetadataWrapper>
      <MetadataDateContainer>
        <MetadataDate>{format(date, 'MMMM D, YYYY')}</MetadataDate>
      </MetadataDateContainer>
      <MetadataContent>
        <MetadataLocation>
          <p>{stadium}</p>
          <p>{location}</p>
        </MetadataLocation>
        {metadataCoverage}
      </MetadataContent>
    </MetadataWrapper>
  );
};

Metadata.propTypes = {
  game: PropTypes.object.isRequired,
};

export default Metadata;
