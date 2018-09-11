import {darken} from 'polished';
import styled from 'styled-components';

export const CompletedGameWrapper = styled.div`
  width: 50%;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

export const LinescoreMetadataWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 36px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const Metadata = styled.div`
  min-width: 200px;
  border: solid 3px ${(props) => props.theme.colors.black};

  .game-metadata-content {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-family: 'Merriweather', serif;
    text-align: center;
  }

  .game-metadata-coverage {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .game-metadata-tv-coverage-icon {
    width: 40px;
    margin-right: 12px;
  }
`;

export const MetadataDateContainer = styled.div`
  margin: -7px 0 24px 0;
  text-align: center;
`;

export const MetadataDate = styled.p`
  display: inline;
  padding: 8px;
  font-size: 14px;
  font-family: 'Bungee';
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.green};
  border: solid 3px ${(props) => props.theme.colors.black};
  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
  text-shadow: ${(props) => props.theme.colors.black} 1px 1px;

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;
