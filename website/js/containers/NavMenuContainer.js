// Libraries
import _ from 'lodash';
import { connect } from 'react-redux';

// Actions
import { toggleNavMenu } from '../actions';

// Presentational components
import NavMenu from '../components/navMenu/NavMenu';

const DEFAULT_YEAR = 2014;

const mapStateToProps = (state) => {
  const currentPath = _.get(state.routing, 'locationBeforeTransitions.pathname');
  const selectedYear = (currentPath === '/') ? DEFAULT_YEAR : Number(currentPath.slice(1));

  return {
    open: state.navMenu.open,
    selectedYear: selectedYear
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
