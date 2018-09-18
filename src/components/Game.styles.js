import {darken} from 'polished';
import styled from 'styled-components';

import TeamLogo from './TeamLogo';
import InternalLink from './common/InternalLink';
// import {Link} from 'redux-little-router';

// const gameTypeBackgroundColors = {
//   home: 'none',
//   away: 'rgba(84, 82, 82, 0.1)',
//   // away: `repeating-linear-gradient(
//   //   45deg,
//   //   #002B5B1A,
//   //   #002B5B1A 5px,
//   //   #DCB4391A 5px,
//   //   #DCB4391A 10px
//   // );`,
//   selected: 'rgba(220, 180, 63, 0.5)',
// };

// const gameTypeBackgroundColorsOnHover = {
//   home: 'rgba(84, 82, 82, 0.2)',
//   away: 'rgba(84, 82, 82, 0.2)',
//   selected: 'rgba(220, 180, 63, 0.6)',
// };

const GameWrapper = styled(InternalLink)`
  display: flex;
  height: 52px;
  text-decoration: none;
  align-items: center;
  justify-content: space-between;
  color: #302205;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 0 4px;
    justify-content: space-between;

    &:hover {
      transform: none;
    }
  }
`;

export const HomeGameWrapper = styled(GameWrapper)`
  &.selected {
    background: rgba(220, 180, 63, 0.5);
  }

  ${'' /* &:hover {
    background: #55555580;
  } */} &:hover {
    background: rgba(220, 180, 63, 0.3);
  }
`;

// export const SelectedGameWrapper = styled(Wrapper)`
//   background: repeating-linear-gradient(
//     -135deg,
//     #dcb43980,
//     #dcb43980 1px,
//     transparent 2px,
//     #dcb43980 3px
//   );

//   &:hover {
//     background: repeating-linear-gradient(
//       -135deg,
//       #55555580,
//       #55555580 1px,
//       transparent 2px,
//       #55555580 3px
//     );
//   }
// `;

export const AwayGameWrapper = styled(GameWrapper)`
  background-image: repeating-linear-gradient(
    135deg,
    #002b5b40,
    #002b5b40 1px,
    transparent 2px,
    transparent 2px,
    #002b5b40 3px
  );

  &.selected {
    background-image: repeating-linear-gradient(
      135deg,
      rgba(220, 180, 63, 0.8),
      rgba(220, 180, 63, 0.8) 1px,
      transparent 2px,
      transparent 2px,
      rgba(220, 180, 63, 0.8) 3px
    );
  }

  &:hover {
    background: repeating-linear-gradient(
      135deg,
      rgba(220, 180, 63, 0.3),
      rgba(220, 180, 63, 0.3) 1px,
      transparent 2px,
      rgba(220, 180, 63, 0.3) 3px
    );
  }
  ${'' /* &:hover {
    background: rgba(220, 180, 63, 0.3);
  } */} background-size: 4px 4px;

  ${'' /* background-image: -webkit-repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2) 1px,
    transparent 1px,
    transparent 100%
  );
  background-image: -moz-repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2) 1px,
    transparent 1px,
    transparent 100%
  );
  background-image: -ms-repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2) 1px,
    transparent 1px,
    transparent 100%
  );
  background-image: repeating-radial-gradient(
    center center,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2) 1px
  );
  background-size: 3px 3px; */};
`;

export const OpponentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const OpponentLogo = styled(TeamLogo)`
  height: 40px;
  width: 40px;

  @media (max-width: 600px) {
    height: 28px;
    width: 28px;
  }
`;

export const DateOpponentDetailsWrapper = styled.div`
  margin-left: 10px;
`;

export const GameDate = styled.p`
  font-size: 14px;
  font-family: 'Merriweather', serif;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export const OpponentDetailsWrapper = styled.div`
  width: 250px;
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    width: initial;
  }
`;

export const AwayGamePrefix = styled.span`
  font-size: 16px;
  font-family: 'Bungee';
  margin-right: 4px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const OpponentRanking = styled.span`
  font-size: 16px;
  font-family: 'Bungee';
  margin-right: 4px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const OpponentName = styled.span`
  font-size: 20px;
  font-family: 'Bungee';

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

export const Location = styled.p`
  font-family: 'Merriweather', serif;
  font-size: 14px;
  width: 200px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1200px) {
    display: none;
  }
`;

export const Score = styled.div`
  display: flex;
  min-width: 112px;
  font-size: 22px;
  font-family: 'Bungee';
  text-align: center;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    font-size: 18px;
    margin-right: 0;
    min-width: 100px;
  }
`;

export const ScoreResult = styled.p`
  width: 20px;
  margin-right: 4px;

  &.win {
    color: ${(props) => props.theme.colors.green};
    margin-right: 5px;
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
  }

  &.loss {
    color: ${(props) => props.theme.colors.red};
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.red)};
  }

  &.tie {
    color: ${(props) => props.theme.colors.mustard};
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.mustard)};
  }
`;

export const ScoreTotals = styled.div`
  flex: 1;
`;

export const TelevisionCoverage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;

  p {
    width: auto;
    font-family: 'Merriweather', serif;
    font-size: 16px;
    font-weight: bold;
  }

  img {
    height: 32px;
    margin-left: 10px;
  }

  @media (max-width: 600px) {
    min-width: 100px;

    p {
      font-size: 14px;
    }

    img {
      height: 24px;
    }
  }
`;

export const ShamrockSeriesLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 4px;
`;
