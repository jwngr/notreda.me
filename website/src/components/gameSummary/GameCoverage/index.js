import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import StatsSection from '../../common/StatsSection';

import {getTvChannelUrl, getTimeZoneString} from '../../../utils';

import {
  ChannelLogo,
  ChannelName,
  DateAndTimeWrapper,
  CoverageInnerWrapper,
  CanceledText,
} from './index.styles';

const GameCoverage = ({game}) => {
  const isGameOver = typeof game.result !== 'undefined';

  let mainContent;
  if (game.date === 'TBD') {
    mainContent = <p>Date and time to be determined</p>;
  } else if (game.isCanceled) {
    mainContent = <CanceledText>Canceled</CanceledText>;
  } else {
    let date;
    let time;
    const dateFormatString = 'E, MMMM d, yyyy';
    if ('fullDate' in game) {
      const d = new Date(game.fullDate);
      date = format(d, dateFormatString);
      time = `${format(d, 'h:mm a')} ${getTimeZoneString(d)}`;
    } else {
      // TODO(cleanup): Convert all dates to fullDate and be done with this nonesense.
      // No year that is in this format has any time information, so we can ignore the time here.
      date = format(new Date(game.date), dateFormatString);
      if (!game.result) {
        time = 'Time to be determined';
      }
    }

    // Display the TV channel information for games which have it as well as all future games (if no
    // channel is set yet, a default icon will be used).
    let tvCoverageContent;
    if (game.coverage || !isGameOver) {
      let tvChannelIcon;
      game.coverage = game.coverage || 'unknown';

      // Try to load the icon. If it fails to load, ignore the error as it will be handled below.
      try {
        tvChannelIcon = require(`../../../images/tvLogos/${game.coverage.toLowerCase()}.png`);
      } catch (error) {}

      if (typeof tvChannelIcon === 'undefined') {
        // If the TV channel icon could not be loaded, display the TV channel name.
        tvCoverageContent = <ChannelName>{game.coverage}</ChannelName>;
      } else {
        // Otherwise, display the TV channel icon, making it link to the streaming site for future
        // games.
        const channelLogo = (
          <ChannelLogo
            alt={game.coverage ? `${game.coverage} logo` : 'TV channel to be determined'}
            src={tvChannelIcon}
            channel={game.coverage.toLowerCase()}
          />
        );
        const channelUrl = getTvChannelUrl(game.coverage);
        tvCoverageContent =
          isGameOver || !channelUrl ? (
            channelLogo
          ) : (
            <a href={channelUrl} target="_blank" rel="noopener noreferrer">
              {channelLogo}
            </a>
          );
      }
    }

    // TODO(feature): add tooltip which has shows game time info in the user's local timezone as
    // well as the time zone the game is actually being played in.
    mainContent = (
      <>
        {tvCoverageContent}
        <DateAndTimeWrapper center={typeof tvCoverageContent === 'undefined'}>
          <p>{date}</p>
          {time && <p>{time}</p>}
        </DateAndTimeWrapper>
      </>
    );
  }

  return (
    <StatsSection title={game.coverage || typeof game.result === 'undefined' ? 'Coverage' : 'Date'}>
      <CoverageInnerWrapper>{mainContent}</CoverageInnerWrapper>
    </StatsSection>
  );
};

GameCoverage.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameCoverage;
