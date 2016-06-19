// Libraries
import { connect } from 'react-redux';

// Actions
import { toggleNavMenu } from '../actions';

// Presentational components
import NavMenu from '../components/navMenu/NavMenu';


const mapStateToProps = (state) => {
  return {
    open: state.navMenu.open,
    selectedYear: state.selectedYear
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => {
      dispatch(toggleNavMenu());
    }
  };
};

const NavMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavMenu);

export default NavMenuContainer;
