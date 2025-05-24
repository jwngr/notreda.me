import {format} from 'date-fns/format';
import React from 'react';
import styled from 'styled-components';

import {assertNever, getTimeZoneString, getTvChannelUrl} from '../../lib/utils';
import {GameInfo, TVNetwork} from '../../models/games.models';
import {FlexColumn, FlexRow} from '../common/Flex';
import {StatsSection} from '../common/StatsSection';
import {TVNetworkLogo} from '../common/TVNetworkLogo';
import {Location} from './Location';

const CoverageInnerWrapper = styled(FlexRow).attrs({justify: 'center'})`
  width: 100%;
  height: 100%;

  p {
    font-size: 16px;
    font-family: 'Inter', serif;
    margin-bottom: 4px;
  }

  p:last-of-type {
    margin-bottom: 0;
  }
`;

interface DateAndTimeWrapperProps {
  readonly align: 'center' | 'start';
}

const DateAndTimeWrapper = styled(FlexColumn).attrs({justify: 'center'})<DateAndTimeWrapperProps>``;

interface ChannelLogoProps {
  readonly $network: TVNetwork;
}

const ChannelLogo = styled.div<ChannelLogoProps>`
  img {
    margin-right: 16px;
    width: ${({$network}) => {
      switch ($network) {
        case TVNetwork.ABC:
        case TVNetwork.CBS:
        case TVNetwork.NBC:
          return '32px';
        case TVNetwork.CBSSN:
        case TVNetwork.CSTV:
        case TVNetwork.ESPN2:
        case TVNetwork.Peacock:
          return '80px';
        case TVNetwork.ACCN:
          return '72px';
        case TVNetwork.ESPN:
        case TVNetwork.Pac12Network:
          return '60px';
        case TVNetwork.NBCSN:
        case TVNetwork.USA:
          return '44px';
        case TVNetwork.FOX:
        case TVNetwork.KATZ:
        case TVNetwork.SportsChannel:
        case TVNetwork.WGN_TV:
        case TVNetwork.ABC_ESPN:
        case TVNetwork.ABC_ESPN2:
        case TVNetwork.RAYCOM_WGN:
        case TVNetwork.USA_WGN_TV:
        case TVNetwork.Unknown:
          return '40px';
        case TVNetwork.TBS:
          return '28px';
        default:
          assertNever($network);
      }
    }};
  }
`;

const CanceledText = styled.p`
  color: ${({theme}) => theme.colors.red};
`;

const coverageLocationWrapperSmallerStyles = `
  flex-direction: column;
  align-items: initial;
  justify-content: initial;

  & > div {
    flex: 1;
    max-width: 100%;
  }

  & > div:first-of-type {
    margin-right: 0;
    margin-bottom: 32px;
  }

  & > div:last-of-type {
    margin-left: 0;
  }
`;

const GameCoverageWrapper = styled(FlexRow).attrs({justify: 'center'})`
  width: 100%;

  & > div {
    flex: 1;
    max-width: calc(50% - 6px);
  }

  & > div:first-of-type {
    margin-right: 6px;
    margin-bottom: 0;
  }

  & > div:last-of-type {
    margin-left: 6px;
  }

  @media (max-width: 1200px) and (min-width: 950px) {
    ${coverageLocationWrapperSmallerStyles}
  }

  @media (max-width: 600px) {
    ${coverageLocationWrapperSmallerStyles}
  }
`;

export const GameCoverage: React.FC<{readonly game: GameInfo; readonly season: number}> = (
  args
) => {
  const {game, season} = args;

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
        <ChannelLogo $network={TVNetwork.Unknown}>
          <TVNetworkLogo network={TVNetwork.Unknown} />
        </ChannelLogo>
      );
    } else if (game.coverage) {
      // Otherwise, display the TV channel icon, making it link to the streaming site for future
      // games.
      const channelLogo = (
        <ChannelLogo $network={game.coverage}>
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

    // TODO(feature): Add tooltip with game time info in both the user's local timezone and the
    // actual game time zone.
    mainContent = (
      <>
        {tvCoverageContent}
        <DateAndTimeWrapper align={tvCoverageContent ? 'center' : 'start'}>
          <p>{date}</p>
          {time ? <p>{time}</p> : null}
        </DateAndTimeWrapper>
      </>
    );
  }

  return (
    <GameCoverageWrapper>
      <StatsSection title={game.coverage || !game.result ? 'Coverage' : 'Date'}>
        <CoverageInnerWrapper>{mainContent}</CoverageInnerWrapper>
      </StatsSection>
      <Location game={game} season={season} />
    </GameCoverageWrapper>
  );
};
