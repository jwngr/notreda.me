import React from 'react';

import {GameInfo} from '../../../models';
import {StatsSection} from '../../common/StatsSection';
import {
  LocationInnerWrapper,
  StadiumLocationWrapper,
  Temperature,
  WeatherIcon,
  WeatherWrapper,
} from './index.styles';

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

export const Location: React.FC<{readonly game: GameInfo}> = ({game}) => {
  let location;
  if (game.location === 'TBD') {
    // Some future games actually don't have a location yet!
    location = 'Location to be determined';
  } else {
    // Otherwise, we are guaranteed to have the city and state / country combo for the game.
    location = game.location.state
      ? `${game.location.city}, ${game.location.state}`
      : `${game.location.city}, ${game.location.country}`;
  }

  let weatherContent;
  if (game.weather) {
    const weatherInfo = _getWeatherInfo(game.weather.icon);
    if (weatherInfo) {
      const {icon, text} = weatherInfo;
      weatherContent = (
        <WeatherWrapper>
          {icon && (
            <WeatherIcon
              className={`wi ${icon}`}
              title={`Weather forecast at kickoff: ${text}`}
            ></WeatherIcon>
          )}
          <Temperature isWeatherIconPresent={!!icon}>{game.weather.temperature}&deg;F</Temperature>
        </WeatherWrapper>
      );
    }
  }

  return (
    <StatsSection title="Location">
      <LocationInnerWrapper>
        {weatherContent}
        <StadiumLocationWrapper center={typeof weatherContent === 'undefined'}>
          {/* Nickname */}
          {game.nickname ? <p>{game.nickname}</p> : null}

          {/* Stadium */}
          {game.location !== 'TBD' && game.location.stadium ? <p>{game.location.stadium}</p> : null}

          {/* Location */}
          <p>{location}</p>
        </StadiumLocationWrapper>
      </LocationInnerWrapper>
    </StatsSection>
  );
};
