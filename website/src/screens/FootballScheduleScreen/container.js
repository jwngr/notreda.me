import {connect} from 'react-redux';

import {toggleNavMenu} from '../../actions';

import FootballScheduleScreen from './index';

const mapStateToProps = (state) => {
  return {
    navMenuOpen: state.navMenu.open,
    selectedYear: state.selectedYear,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNavMenu: () => {
      dispatch(toggleNavMenu());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FootballScheduleScreen);
