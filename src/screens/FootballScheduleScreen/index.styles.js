import styled from 'styled-components';
import {darken, lighten} from 'polished';

import InternalLink from '../../components/common/InternalLink';

export const ScheduleScreenWrapper = styled.div`
  transition: transform 0.5s;
  margin: 28px;
  padding: 24px;
  border: solid 3px #302205;
  background-color: rgba(220, 180, 57, 0.4);

  @media (max-width: 600px) {
    margin: 39px 6px 6px 6px;
    padding: 40px 0px 0px 0px;
  }

  &.nav-menu-open {
    transform: scale(0.8);
  }
`;

export const ScheduleWrapper = styled.div`
  display: flex;

  & > div {
    width: 50%;
  }

  & > div:first-of-type {
    margin-right: 12px;
  }

  & > div:last-of-type {
    margin-left: 12px;
  }

  @media (max-width: 1000px and min-width: 801px) {
    & > div:first-of-type {
      width: 40%;
    }

    & > div:last-of-type {
      width: 60%;
    }
  }

  @media (max-width: 800px) {
    & > div:first-of-type,
    & > div:last-of-type {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
    }
  }
`;

export const NavMenuButton = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  height: 47px;
  padding: 10px;
  cursor: pointer;
  z-index: 2;

  /* Middle line */
  & > span {
    display: inline-block;
    width: 2rem;
    height: calc(2rem / 7);
    background: ${(props) => props.theme.colors.green};
    border: solid 1px ${(props) => props.theme.colors.black};
    border-radius: calc(2rem / 14);
    position: relative;
  }

  /* Upper and lower lines (pseudo-elements of the middle line) */
  & > span:before,
  & > span:after {
    display: inline-block;
    width: 2rem;
    height: calc(2rem / 7);
    background: ${(props) => props.theme.colors.green};
    border: solid 1px ${(props) => props.theme.colors.black};
    border-radius: calc(2rem / 14);
    position: absolute;
    left: 0;
    content: '';
    margin-left: -1px;
    transform-origin: calc(2rem / 14) center;
  }

  & > span:before {
    top: calc(2rem / 4);
  }

  & > span:after {
    top: calc((-2rem / 4) - 2px);
  }

  @media (max-width: 600px) {
    top: -2px;
    right: 0;
  }

  @media (max-width: 400px) {
    top: -2px;
    right: 8px;
  }
`;

export const Header = styled.div`
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 56px;
  min-width: 400px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    height: 80px;
  }
`;

export const HeaderTitle = styled.div`
  font-family: 'Bungee';
  font-size: 32px;
  color: ${(props) => props.theme.colors.white};
  padding: 2px 6px;
  margin: 0 32px;
  background-color: ${(props) => props.theme.colors.green};
  border: solid 3px ${(props) => props.theme.colors.black};
  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
  text-shadow: ${(props) => props.theme.colors.black} 2px 2px;

  @media (max-width: 1200px) {
    font-size: 28px;
    margin: 0 20px;
  }

  @media (max-width: 800px) {
    font-size: 24px;
    margin: 0 12px;
  }

  @media (max-width: 600px) {
    width: 228px;
    font-size: 24px;
  }
`;

const PreviousAndNextYearLink = styled(InternalLink)`
  font-family: 'Bungee';
  font-size: 18px;
  text-decoration: none;
  ${'' /* -webkit-text-stroke: 1px;
  -webkit-text-stroke-color: ${(props) => props.theme.colors.black};
  text-shadow: ${(props) => props.theme.colors.black} 1px 1px; */} padding: 2px 4px;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.green};
  border: solid 3px #302205;

  &:hover {
    background-color: ${(props) => lighten(0.1, props.theme.colors.green)};
  }

  &.hidden {
    visibility: hidden;
  }

  @media (max-width: 1200px) {
    font-size: 16px;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

export const PreviousYearLink = styled(PreviousAndNextYearLink)`
  padding-left: 0;

  span {
    margin-right: 2px;
  }

  &:hover {
    animation: pullBackwards 0.8s infinite ease-in-out;
  }

  @keyframes pullBackwards {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(-4px, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 700px) {
    &:hover {
      animation: none;
    }

    span {
      font-size: 20px;
      margin-right: 0;
      margin-left: 4px;
    }
  }
`;

export const NextYearLink = styled(PreviousAndNextYearLink)`
  padding-right: 0;

  span {
    margin-left: 2px;
  }

  &:hover {
    animation: pushForwards 0.8s infinite ease-in-out;
  }

  @keyframes pushForwards {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(4px, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 700px) {
    &:hover {
      animation: none;
    }

    span {
      font-size: 20px;
      margin-left: 0;
      margin-right: 4px;
    }
  }
`;
