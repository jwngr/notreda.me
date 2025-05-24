import React from 'react';
import styled from 'styled-components';

import {formatGameLocationAsString, getGameLocation} from '../../lib/locations';
import {GameInfo} from '../../models/games.models';
import {FlexColumn, FlexRow} from '../common/Flex';
import {StatsSection} from '../common/StatsSection';

const LocationInnerWrapper = styled(FlexRow).attrs({justify: 'center'})`
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

const WeatherWrapper = styled(FlexColumn).attrs({align: 'center'})`
  margin-right: 16px;
`;

const WeatherIcon = styled.i`
  font-size: 24px;
`;

interface TemperatureProps {
  readonly $isWeatherIconPresent: boolean;
}

const Temperature = styled.p<TemperatureProps>`
  /* margin-left: ${({$isWeatherIconPresent}) => ($isWeatherIconPresent ? '8px' : 0)}; */
  margin-top: 4px;
  font-size: 18px !important;
  font-family: 'Inter', serif;
`;

interface StadiumLocationWrapperProps {
  readonly center: boolean;
}

const StadiumLocationWrapper = styled(FlexColumn).attrs({
  justify: 'center',
})<StadiumLocationWrapperProps>`
  align-items: ${({center}) => (center ? 'center' : 'start')};
  text-align: center;
`;

const _getWeatherInfo = (
  weatherIcon: string
): {readonly icon: string; readonly text: string} | null => {
  let icon;
  let text;
  // TODO: Introduce a proper `WeatherType` enum.
  switch (weatherIcon) {
    case 'clear-day':
      icon = 'wi-day-sunny';
      text = 'Clear, day';
      break;
    case 'clear-night':
      icon = 'wi-night-clear';
      text = 'Clear, night';
      break;
    case 'partly-cloudy-day':
      icon = 'wi-day-cloudy';
      text = 'Clear, night';
      break;
    case 'partly-cloudy-night':
      icon = 'wi-night-cloudy';
      text = 'Partly cloudy';
      break;
    case 'cloudy':
      icon = 'wi-cloudy';
      text = 'Cloudy';
      break;
    case 'fog':
      icon = 'wi-fog';
      text = 'Fog';
      break;
    case 'rain':
      icon = 'wi-rain';
      text = 'Rain';
      break;
    case 'snow':
      icon = 'wi-snow';
      text = 'Snow';
      break;
    case 'unknown':
    default:
      return null;
  }

  return {icon, text};
};

export const Location: React.FC<{readonly game: GameInfo; readonly season: number}> = (props) => {
  const {game, season} = props;

  const computedLocation = getGameLocation({game, season});
  const locationString = formatGameLocationAsString({
    location: computedLocation,
    tbdText: 'Location to be determined',
  });

  const stadiumString = computedLocation === 'TBD' ? null : computedLocation?.stadium;

  let weatherContent: React.ReactNode | null = null;
  if (game.weather) {
    const weatherInfo = _getWeatherInfo(game.weather.icon);
    if (weatherInfo) {
      const {icon, text} = weatherInfo;
      weatherContent = (
        <WeatherWrapper>
          {icon ? (
            <WeatherIcon
              className={`wi ${icon}`}
              title={`Weather forecast at kickoff: ${text}`}
            ></WeatherIcon>
          ) : null}
          <Temperature $isWeatherIconPresent={!!icon}>{game.weather.temperature}&deg;F</Temperature>
        </WeatherWrapper>
      );
    }
  }

  return (
    <StatsSection title="Location">
      <LocationInnerWrapper>
        {weatherContent}
        <StadiumLocationWrapper center={typeof weatherContent === 'undefined'}>
          {game.nickname ? <p>{game.nickname}</p> : null}
          {stadiumString ? <p>{stadiumString}</p> : null}
          <p>{locationString}</p>
        </StadiumLocationWrapper>
      </LocationInnerWrapper>
    </StatsSection>
  );
};
