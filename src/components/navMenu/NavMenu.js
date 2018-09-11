import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import NavMenuDecade from './NavMenuDecade';

import './NavMenu.css';

const NavMenu = ({open, selectedYear, onClose}) => {
  const navMenuClassNames = classNames({
    'nav-menu': true,
    'nav-menu-open': open,
  });

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
    <nav className={navMenuClassNames}>
      <div className="nav-menu-decades">{navMenuDecadesContent}</div>
    </nav>
  );
};

NavMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedYear: PropTypes.number.isRequired,
};

export default NavMenu;
