// Libraries
import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

// Components
import NavMenuDecade from './NavMenuDecade';


class NavMenu extends React.Component {
  render() {
    const menuClassNames = classNames('nav-menu', {
      'nav-menu-open': this.props.open
    });

    const navButtonClasses = classNames('drawer-toggle-button', {
      'close': this.props.open
    });

    return (
      <nav className={ menuClassNames }>
        <div className='nav-menu-header'>
          <button className={ navButtonClasses } onClick={ this.props.toggleNavMenuOpen }>
            <span className='drawer-toggle-button-lines'></span>
          </button>
          <Link to='/about'>About</Link>
        </div>

        <div className='nav-menu-decades'>
          <NavMenuDecade startingYear={ 2010 } key={ 2010 } />
          <NavMenuDecade startingYear={ 2000 } key={ 2000 } />
          <NavMenuDecade startingYear={ 1990 } key={ 1990 } />
          <NavMenuDecade startingYear={ 1980 } key={ 1980 } />
          <NavMenuDecade startingYear={ 1970 } key={ 1970 } />
        </div>
      </nav>
    );
  }
}

NavMenu.propTypes = {
  open: React.PropTypes.bool.isRequired,
  toggleNavMenuOpen: React.PropTypes.func.isRequired  // TODO: replace with Redux
};

export default NavMenu;
