import {darken} from 'polished';
import styled from 'styled-components';

export const MetadataWrapper = styled.div`
  border: solid 3px ${(props) => props.theme.colors.black};
  width: 100%;
  max-width: 520px;

  @media (max-width: 950px) {
    max-width: 420px;
  }
`;

export const MetadataDateContainer = styled.div`
  margin: -11px 8px 24px 8px;
  text-align: center;
`;

export const MetadataDate = styled.p`
  display: inline;
  padding: 4px 8px;
  font-size: 16px;
  font-family: 'Bungee';
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.green};
  border: solid 3px ${(props) => props.theme.colors.black};
  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
  text-shadow: ${(props) => props.theme.colors.black} 1px 1px;
`;

export const MetadataContent = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -20px;
  text-align: center;
  padding: 8px;
  max-width: 200px;

  p {
    font-size: 14px;
    font-family: 'Merriweather', serif;
    margin-bottom: 8px;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  max-width: initial;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const MetadataLocation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

export const MetadataCoverage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 4px;

  img {
    width: 40px;
    margin-right: 12px;
  }
`;
