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
    date = format(new Date(game.timestamp || game.date), 'MMMM D, YYYY');
    if ('timestamp' in game) {
      time = format(new Date(game.timestamp || game.date), 'h:mm A');
    }
  }

  let tvCoverageContent;
  if (game.coverage && game.coverage !== 'TBD') {
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
  if (time && tvCoverageContent) {
    metadataCoverage = (
      <MetadataCoverage>
        {tvCoverageContent}
        <p>{time === 'TBD' ? 'Time TBD' : time}</p>
      </MetadataCoverage>
    );
  } else if (time) {
    metadataCoverage = (
      <MetadataCoverage>
        <p>{time === 'TBD' ? 'Time TBD' : time}</p>
      </MetadataCoverage>
    );
  } else if (tvCoverageContent) {
    metadataCoverage = <MetadataCoverage>{tvCoverageContent}</MetadataCoverage>;
  }

  let stadium = game.location.stadium || null;
  let location = game.location.state
    ? `${game.location.city}, ${game.location.state}`
    : `${game.location.city}, ${game.location.country}`;

  return (
    <MetadataWrapper>
      <MetadataDateContainer>
        <MetadataDate>{date}</MetadataDate>
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
