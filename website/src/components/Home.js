import React from 'react';
import PropTypes from 'prop-types';

import NavMenuContainer from '../containers/NavMenuContainer';
import YearScheduleContainer from '../containers/YearScheduleContainer';
import NavMenuButtonContainer from '../containers/NavMenuButtonContainer';


class Home extends React.Component {
  render() {
    return (
      <div>
        <YearScheduleContainer />
        <NavMenuContainer />
        <NavMenuButtonContainer />
      </div>
    );
  }
}

Home.propTypes = {
  children: PropTypes.any
};

export default Home;
