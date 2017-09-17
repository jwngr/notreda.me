import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import NavMenuDecade from './NavMenuDecade';

import './NavMenu.css';


const NavMenu = ({ open, selectedYear, onClose }) => {
  const menuClassNames = classNames('nav-menu', {
    'nav-menu-open': open
  });

  const navMenuDecadesContent = _.map(_.rangeRight(1880, 2020, 10), (decade) => {
    return <NavMenuDecade startingYear={ decade } selectedYear={ selectedYear } key={ decade } />;
  });

  return (
    <nav className={ menuClassNames }>
      <div className='nav-menu-header'>
        <Link to='/about'>About</Link>
        <div className='nav-menu-button nav-menu-close-button' onClick={ onClose }>
          <span></span>
        </div>
      </div>

      <div className='nav-menu-decades'>
        { navMenuDecadesContent }
      </div>
    </nav>
  );
};

NavMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedYear: PropTypes.number.isRequired
};

export default NavMenu;
