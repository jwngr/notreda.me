import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import NavMenuDecade from './NavMenuDecade';

import {NavMenuWrapper, NavMenuDecadesWrapper} from './index.styles';

const NavMenu = ({open, selectedYear, onClose}) => {
  const navMenuDecadesContent = _.map(_.rangeRight(1880, 2030, 10), (decade) => {
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
      <NavMenuDecadesWrapper>{navMenuDecadesContent}</NavMenuDecadesWrapper>
    </NavMenuWrapper>
  );
};

NavMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedYear: PropTypes.number.isRequired,
};

export default NavMenu;
