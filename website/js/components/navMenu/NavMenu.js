// Libraries
import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

// Presentational components
import NavMenuDecade from './NavMenuDecade';

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
  open: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired,
  selectedYear: React.PropTypes.number.isRequired
};

export default NavMenu;
