import {connect} from 'react-redux';

import {toggleNavMenu} from '../actions';

import NavMenu from '../components/navMenu/NavMenu';

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

const NavMenuContainer = connect(mapStateToProps, mapDispatchToProps)(NavMenu);

export default NavMenuContainer;
