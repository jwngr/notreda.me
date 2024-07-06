import {connect} from 'react-redux';

import {toggleNavMenu} from '../actions';
import {NavMenu} from '../components/NavMenu';

const mapStateToProps = (state) => {
  return {
    open: state.navMenu.open,
    selectedYear: state.selectedYear,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch(toggleNavMenu());
    },
  };
};

export const NavMenuContainer = connect(mapStateToProps, mapDispatchToProps)(NavMenu);
