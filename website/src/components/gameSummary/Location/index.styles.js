import styled from 'styled-components';

export const LocationWrapper = styled.div`
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

export const WeatherIcon = styled.i`
  font-size: 24px;
`;

export const Temperature = styled.p`
  margin-left: ${({isWeatherIconPresent}) => (isWeatherIconPresent ? '8px' : 0)};
  font-size: 20px !important;
  font-family: 'Inter UI', serif;
`;

export const StadiumLocationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({center}) => (center ? 'center' : 'start')};
  justify-content: center;
`;
