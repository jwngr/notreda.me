import styled from 'styled-components';
import {Link} from 'react-router-dom';

const gameTypeBackgroundColors = {
  home: 'none',
  away: 'rgba(84, 82, 82, 0.1)',
  selected: 'rgba(220, 180, 63, 0.5)',
};

const gameTypeBackgroundColorsOnHover = {
  home: 'rgba(84, 82, 82, 0.2)',
  away: 'rgba(84, 82, 82, 0.2)',
  selected: 'rgba(220, 180, 63, 0.6)',
};

export const Wrapper = styled(Link)`
  display: flex;
  height: 52px;
  text-decoration: none;
  align-items: center;
  justify-content: space-around;
  color: #302205;

  background-color: ${(props) => gameTypeBackgroundColors[props.type]};

  &:hover {
    background-color: ${(props) => gameTypeBackgroundColorsOnHover[props.type]};
  }
`;

export const OpponentLogo = styled.img`
  height: 40px;
  width: 40px;

  @media (max-width: 600px) {
    height: 28px;
    width: 28px;
  }
`;

export const DateOpponentWrapper = styled.div`
  margin-left: 10px;
`;

export const GameDate = styled.p`
  font-size: 14px;
  font-family: 'Merriweather', serif;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export const OpponentWrapper = styled.div`
  font-size: 20px;
  font-family: 'Bungee';
  width: 250px;
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

export const AwayGamePrefix = styled.span`
  margin-right: 5px;
`;

export const OpponentRanking = styled.span`
  font-size: 14px;
  margin-right: 5px;
  /*color: #444;*/

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export const OpponentName = styled.span``;

export const Location = styled.p`
  font-family: 'Merriweather', serif;
  font-size: 14px;
  width: 200px;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export const Score = styled.p`
  font-size: 22px;
  font-family: 'Bungee';
  width: 120px;
  text-align: center;

  .win {
    color: #465510; /* $secondary-green */
    margin-right: 5px;
  }

  .loss {
    color: #5f1709; /* $secondary-red */
    margin-right: 8px;
  }

  .tie {
    color: #302205; /* $secondary-black */
    margin-right: 8px;
  }
`;

export const TelevisionCoverage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;

  p {
    width: auto;
    font-family: 'Merriweather', serif;
    font-size: 14px;
    margin-right: 10px;
  }

  img {
    height: 32px;
  }
`;
