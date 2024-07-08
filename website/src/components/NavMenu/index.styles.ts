import {Link} from 'react-router-dom';
import styled, {css} from 'styled-components';

import backgroundImage from '../../images/background.png';

interface NavMenuWrapperProps {
  readonly $isOpen: boolean;
}

export const NavMenuWrapper = styled.div<NavMenuWrapperProps>`
  position: fixed;
  width: 720px;
  max-width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  visibility: hidden;
  transform: translateX(600px);
  transition:
    transform 0.5s,
    visibility 0s 0.5s;
  overflow: scroll;
  z-index: 10;
  padding: 0 0 12px 12px;
  overflow-y: scroll;
  border: solid 3px ${({theme}) => theme.colors.black};
  background-color: ${({theme}) => theme.colors.lightGray};
  background-image: url(${backgroundImage});
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;

  ${({$isOpen}) =>
    $isOpen
      ? css`
          visibility: visible;
          transform: translateX(0px);
          transition: transform 0.5s;
        `
      : null}

  @media (max-width: 480px) {
    padding-bottom: 0;
    border: none;
  }
`;

export const NavMenuDecadesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const NavMenuLinksSectionWrapper = styled.div`
  margin: 32px auto 0 auto;
  position: relative;
  left: -12px;
  padding: 8px;
  border: solid 3px ${({theme}) => theme.colors.black};
  background-color: ${({theme}) => theme.colors.gold}66;

  @media (max-width: 480px) {
    margin-left: 12px;
    margin-right: 24px;
    left: 0;
  }
`;

export const NavMenuLink = styled(Link)`
  flex: 1;
  color: ${({theme}) => theme.colors.black};
  font-size: 16px;
  font-family: 'Inter UI', serif;
  text-decoration: none;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

export const NavMenuLinksDivider = styled.p`
  width: 24px;
  font-size: 4px;
  text-align: center;
  font-family: 'Inter UI', serif;

  @media (max-width: 350px) {
    display: none;
  }
`;

export const NavMenuLinksWrapper = styled.div`
  display: flex;
  padding: 8px 12px 0 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    padding: 8px 4px 0 4px;
  }

  @media (max-width: 350px) {
    flex-direction: column;
  }
`;
