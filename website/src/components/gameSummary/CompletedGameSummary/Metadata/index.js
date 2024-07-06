import format from 'date-fns/format';
import PropTypes from 'prop-types';
import React from 'react';

import {TVNetworkLogo} from '../../../TVNetworkLogo';
import {
  MetadataContent,
  MetadataCoverage,
  MetadataDate,
  MetadataDateContainer,
  MetadataLocation,
  MetadataWrapper,
} from './index.styles';

export const Metadata = ({game}) => {
  let date;
  let time;
  if ('fullDate' in game) {
    date = format(new Date(game.fullDate), 'MMMM d, yyyy');
    // TODO(cleanup): remove isTimeTbd logic.
    time = game.isTimeTbd ? 'TBD' : format(new Date(game.fullDate), 'h:mm a');
  } else if (game.date === 'TBD') {
    date = 'Date To Be Determined';
  } else {
    date = format(new Date(game.date), 'MMMM d, yyyy');
  }

  let tvCoverageContent;
  if (game.coverage && game.coverage !== 'TBD') {
    try {
      tvCoverageContent = <TVNetworkLogo coverage={game.coverage} />;
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

  let stadium = game.location.stadium ? <p>{game.location.stadium}</p> : null;
  let location;
  if (game.location === 'TBD') {
    location = 'Location To Be Determined';
  } else {
    location = game.location.state
      ? `${game.location.city}, ${game.location.state}`
      : `${game.location.city}, ${game.location.country}`;
  }

  return (
    <MetadataWrapper>
      <MetadataDateContainer>
        <MetadataDate>{date}</MetadataDate>
      </MetadataDateContainer>
      <MetadataContent>
        <MetadataLocation>
          {stadium}
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
