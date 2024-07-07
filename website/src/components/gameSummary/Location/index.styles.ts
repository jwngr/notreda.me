import styled from 'styled-components';

export const LocationInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 100%;

  p {
    font-size: 16px;
    font-family: 'Inter UI', serif;
    margin-bottom: 4px;
  }

  p:last-of-type {
    margin-bottom: 0;
  }
`;

export const WeatherWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

export const WeatherIcon = styled.i`
  font-size: 24px;
`;

interface TemperatureProps {
  readonly isWeatherIconPresent: boolean;
}

export const Temperature = styled.p<TemperatureProps>`
  /* margin-left: ${({isWeatherIconPresent}) => (isWeatherIconPresent ? '8px' : 0)}; */
  margin-top: 4px;
  font-size: 18px !important;
  font-family: 'Inter UI', serif;
`;

interface StadiumLocationWrapperProps {
  readonly center: boolean;
}

export const StadiumLocationWrapper = styled.div<StadiumLocationWrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: ${({center}) => (center ? 'center' : 'start')};
  justify-content: center;
  text-align: center;
`;
