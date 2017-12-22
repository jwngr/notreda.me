import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import NavMenuContainer from '../containers/NavMenuContainer';
import YearScheduleContainer from '../containers/YearScheduleContainer';

import './Home.css';

const Home = ({navMenuOpen, toggleNavMenu}) => {
  const scheduleContainerClasses = classNames({
    'home-container': true,
    'nav-menu-open': navMenuOpen,
  });

  const closeNavMenuIfOpen = () => {
    if (navMenuOpen) {
      toggleNavMenu();
    }
  };

  return (
    <div>
      <div className={scheduleContainerClasses} onClick={closeNavMenuIfOpen}>
        <YearScheduleContainer />
      </div>
      <div>
        <div className="nav-menu-button" onClick={toggleNavMenu}>
          <span />
        </div>
        <NavMenuContainer />
      </div>
    </div>
  );
};

Home.propTypes = {
  children: PropTypes.any,
  navMenuOpen: PropTypes.bool.isRequired,
  toggleNavMenu: PropTypes.func.isRequired,
};

export default Home;
