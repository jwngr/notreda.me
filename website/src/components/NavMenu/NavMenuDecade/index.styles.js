import {darken} from 'polished';
import styled from 'styled-components';

import InternalLink from '../../common/InternalLink';

export const NavMenuDecadeWrapper = styled.div`
  flex: 1;
  padding: 8px;
  margin: 32px 12px 0 0;
  border: solid 3px ${(props) => props.theme.colors.black};
  background-color: ${(props) => props.theme.colors.gold}66;

  @media (max-width: 480px) {
    margin-left: 12px;
    margin-right: 24px;

    &:last-of-type {
      margin-bottom: 24px;
    }
  }
`;

export const MavMenuDecadeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: -28px;

  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.black)};
  text-shadow: ${(props) => props.theme.colors.black} 2px 2px;

  p {
    font-family: 'Bungee';
    font-size: 20px;
    color: ${(props) => props.theme.colors.white};
    display: inline-block;
    padding: 4px 8px;
    background-color: ${(props) => props.theme.colors.green}; /* $primary-blue */
    border: solid 3px ${(props) => props.theme.colors.black};
  }

  p span {
    font-size: 16px;
  }
`;

export const NavMenuDecadeYearsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 2px;
  margin-top: 4px;
`;

export const NavMenuDecadeYear = styled(InternalLink)`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-self: center;
  justify-content: center;
  text-decoration: none;
  font-size: 16px;
  font-family: 'Inter UI', serif;
  color: ${(props) => props.theme.colors.black};

  &:hover {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.colors.black}20;
  }

  &.national-championship-year {
    background-image: repeating-linear-gradient(
      135deg,
      ${(props) => darken(0.2, props.theme.colors.green)}40,
      ${(props) => darken(0.2, props.theme.colors.green)}40 1px,
      transparent 2px,
      transparent 2px,
      ${(props) => darken(0.2, props.theme.colors.green)}40 3px
    );

    &:hover {
      color: ${(props) => props.theme.colors.white};
    }
  }

  &.current-year {
    background-image: repeating-linear-gradient(
      -135deg,
      ${(props) => darken(0.2, props.theme.colors.blue)}40,
      ${(props) => darken(0.2, props.theme.colors.blue)}40 1px,
      transparent 2px,
      transparent 2px,
      ${(props) => darken(0.2, props.theme.colors.blue)}40 3px
    );
  }

  &.selected-year {
    font-weight: bold;
    background-color: ${(props) => props.theme.colors.gold};
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
  }
`;
