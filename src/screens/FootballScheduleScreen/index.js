import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import NavMenuContainer from '../../containers/NavMenuContainer';
import YearScheduleContainer from '../../containers/YearScheduleContainer';

import './index.css';

const FootballScheduleScreen = ({navMenuOpen, toggleNavMenu}) => {
  const scheduleContainerClasses = classNames({
    'football-schedule-container': true,
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

FootballScheduleScreen.propTypes = {
  children: PropTypes.any,
  navMenuOpen: PropTypes.bool.isRequired,
  toggleNavMenu: PropTypes.func.isRequired,
};

export default FootballScheduleScreen;
