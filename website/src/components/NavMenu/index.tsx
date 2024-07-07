import _ from 'lodash';
import React from 'react';

import {
  NavMenuDecadesWrapper,
  NavMenuLink,
  NavMenuLinksDivider,
  NavMenuLinksSectionWrapper,
  NavMenuLinksWrapper,
  NavMenuWrapper,
} from './index.styles';
import {NavMenuDecade} from './NavMenuDecade';
import {MavMenuDecadeHeader} from './NavMenuDecade/index.styles';

export const NavMenu: React.FC<{
  readonly open: boolean;
  readonly selectedSeason: number;
  readonly onClose: () => void;
}> = ({open, selectedSeason, onClose}) => {
  const navMenuDecadesContent = _.map(_.rangeRight(1880, 2040, 10), (decade) => {
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
    <NavMenuWrapper className={open ? 'open' : ''}>
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

      <NavMenuDecadesWrapper>
        {navMenuDecadesContent}
        <p>&nbsp;</p>
      </NavMenuDecadesWrapper>
    </NavMenuWrapper>
  );
};
