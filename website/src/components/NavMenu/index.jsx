import _ from 'lodash';
import PropTypes from 'prop-types';
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

export const NavMenu = ({open, selectedYear, onClose}) => {
  const navMenuDecadesContent = _.map(_.rangeRight(1880, 2040, 10), (decade) => {
    return (
      <NavMenuDecade
        key={decade}
        startingYear={decade}
        selectedYear={selectedYear}
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
          <NavMenuLink href="/explorables">Explorables</NavMenuLink>
          <NavMenuLinksDivider>&#9679;</NavMenuLinksDivider>
          <NavMenuLink href="https://www.github.com/jwngr/notreda.me/">GitHub</NavMenuLink>
          <NavMenuLinksDivider>&#9679;</NavMenuLinksDivider>
          <NavMenuLink href="https://jwn.gr/">@jwngr</NavMenuLink>
        </NavMenuLinksWrapper>
      </NavMenuLinksSectionWrapper>

      <NavMenuDecadesWrapper>
        {navMenuDecadesContent}
        <p>&nbsp;</p>
      </NavMenuDecadesWrapper>
    </NavMenuWrapper>
  );
};

NavMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedYear: PropTypes.number.isRequired,
};
