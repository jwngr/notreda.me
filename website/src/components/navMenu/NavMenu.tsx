import rangeRight from 'lodash/rangeRight';
import React from 'react';
import {Link} from 'react-router-dom';
import styled, {css} from 'styled-components';

import backgroundImage from '../../images/background.png';
import {FlexColumn, FlexRow} from '../common/Flex';
import {MavMenuDecadeHeader, NavMenuDecade} from './NavMenuDecade';

interface NavMenuWrapperProps {
  readonly $isOpen: boolean;
}

const NavMenuWrapper = styled(FlexColumn)<NavMenuWrapperProps>`
  min-width: 0;
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
  overflow: auto;
  z-index: 10;
  padding: 0 0 12px 12px;
  overflow-y: scroll;
  border: solid 3px ${({theme}) => theme.colors.black};
  background-color: ${({theme}) => theme.colors.lightGray};
  background-image: url(${backgroundImage});
  overscroll-behavior: contain;

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

const NavMenuLinksSectionWrapper = styled.div`
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

const NavMenuLink = styled(Link)`
  flex: 1;
  color: ${({theme}) => theme.colors.black};
  font-size: 16px;
  font-family: 'Inter', serif;
  text-decoration: none;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

const NavMenuLinksDivider = styled.p`
  width: 24px;
  font-size: 4px;
  text-align: center;
  font-family: 'Inter', serif;

  @media (max-width: 350px) {
    display: none;
  }
`;

const NavMenuLinksWrapper = styled(FlexRow).attrs({justify: 'center'})`
  padding: 8px 12px 0 12px;

  @media (max-width: 480px) {
    padding: 8px 4px 0 4px;
  }

  @media (max-width: 350px) {
    flex-direction: column;
  }
`;

export const NavMenu: React.FC<{
  readonly open: boolean;
  readonly selectedSeason: number;
  readonly onClose: () => void;
}> = ({open, selectedSeason, onClose}) => {
  const navMenuDecadesContent = rangeRight(1880, 2040, 10).map((decade) => {
    return (
      <NavMenuDecade
        key={decade}
        startingYear={decade}
        selectedSeason={selectedSeason}
        onClick={onClose}
      />
    );
  });

  return (
    <NavMenuWrapper $isOpen={open}>
      <NavMenuLinksSectionWrapper>
        <MavMenuDecadeHeader>
          <p>Links</p>
        </MavMenuDecadeHeader>
        <NavMenuLinksWrapper>
          <NavMenuLink to="/explorables">Explorables</NavMenuLink>
          <NavMenuLinksDivider>&#9679;</NavMenuLinksDivider>
          <NavMenuLink to="https://www.github.com/jwngr/notreda.me/">GitHub</NavMenuLink>
          <NavMenuLinksDivider>&#9679;</NavMenuLinksDivider>
          <NavMenuLink to="https://jwn.gr/">@jwngr</NavMenuLink>
        </NavMenuLinksWrapper>
      </NavMenuLinksSectionWrapper>

      <FlexRow wrap="wrap">
        {navMenuDecadesContent}
        <p>&nbsp;</p>
      </FlexRow>
    </NavMenuWrapper>
  );
};
