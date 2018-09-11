import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import {
  MetadataDate,
  MetadataWrapper,
  MetadataContent,
  MetadataCoverage,
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

  let tvCoverageIcon;
  if (game.coverage && game.coverage !== 'TBD') {
    tvCoverageIcon = (
      <img
        alt={`${game.coverage} logo`}
        src={require(`../../../../images/tvLogos/${game.coverage.toLowerCase()}.png`)}
      />
    );
  }

  let stadium = game.location.stadium || null;
  let location = game.location.state
    ? `${game.location.city}, ${game.location.state}`
    : `${game.location.city}, ${game.location.country}`;

  // TODO: get correct stadium
  return (
    <MetadataWrapper>
      <MetadataDateContainer>
        <Media query="(max-width: 1200px)">
          {(matches) =>
            matches ? (
              <MetadataDate>{format(date, 'MMM D, YYYY')}</MetadataDate>
            ) : (
              <MetadataDate>{format(date, 'MMMM D, YYYY')}</MetadataDate>
            )
          }
        </Media>
      </MetadataDateContainer>
      <MetadataContent>
        <p>{stadium}</p>
        <p>{location}</p>
        <MetadataCoverage>
          {tvCoverageIcon}
          <p>{time}</p>
        </MetadataCoverage>
      </MetadataContent>
    </MetadataWrapper>
  );
};

Metadata.propTypes = {
  game: PropTypes.object.isRequired,
};

export default Metadata;
