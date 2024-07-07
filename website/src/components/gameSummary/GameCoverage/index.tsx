import format from 'date-fns/format';
import React from 'react';

import {getTimeZoneString, getTvChannelUrl} from '../../../lib/utils';
import {GameInfo, TVNetwork} from '../../../models';
import {StatsSection} from '../../common/StatsSection';
import {TVNetworkLogo} from '../../TVNetworkLogo';
import {CanceledText, ChannelLogo, CoverageInnerWrapper, DateAndTimeWrapper} from './index.styles';

export const GameCoverage: React.FC<{
  readonly game: GameInfo;
}> = ({game}) => {
  const isGameOver = !!game.result;

  let mainContent: React.ReactNode;
  if (game.date === 'TBD') {
    mainContent = <p>Date and time to be determined</p>;
  } else if (game.isCanceled) {
    mainContent = <CanceledText>Canceled</CanceledText>;
  } else if (game.isPostponed) {
    mainContent = <p>Postponed</p>;
  } else {
    let date: string;
    let time: string | null;
    const dateFormatString = 'E, MMMM d, yyyy';
    if (game.fullDate) {
      const d = new Date(game.fullDate);
      date = format(d, dateFormatString);
      time = `${format(d, 'h:mm a')} ${getTimeZoneString(d)}`;
    } else if (game.date) {
      // TODO(cleanup): Convert all dates to fullDate and be done with this nonesense.
      date = format(new Date(game.date), dateFormatString);
      // No year that is in this format has any time information, so we can ignore the time here.
      time = game.result ? null : 'Time to be determined';
    } else {
      date = 'No date';
      time = 'No time';
    }

    // Display the TV channel information for games which have it as well as all future games (if no
    // channel is set yet, a default icon will be used).
    let tvCoverageContent: React.ReactNode = null;
    const isFutureGameWithoutCoverage = !isGameOver && !game.coverage;
    if (game.coverage === 'TBD' || isFutureGameWithoutCoverage) {
      tvCoverageContent = (
        <ChannelLogo network={TVNetwork.Unknown}>
          <TVNetworkLogo network={TVNetwork.Unknown} />
        </ChannelLogo>
      );
    } else if (game.coverage) {
      // Otherwise, display the TV channel icon, making it link to the streaming site for future
      // games.
      const channelLogo = (
        <ChannelLogo network={game.coverage}>
          <TVNetworkLogo network={game.coverage} />
        </ChannelLogo>
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

    // TODO(feature): add tooltip which has shows game time info in the user's local timezone as
    // well as the time zone the game is actually being played in.
    mainContent = (
      <>
        {tvCoverageContent}
        <DateAndTimeWrapper center={!!tvCoverageContent}>
          <p>{date}</p>
          {time ? <p>{time}</p> : null}
        </DateAndTimeWrapper>
      </>
    );
  }

  return (
    <StatsSection title={game.coverage || !game.result ? 'Coverage' : 'Date'}>
      <CoverageInnerWrapper>{mainContent}</CoverageInnerWrapper>
    </StatsSection>
  );
};
