import {connect} from 'react-redux';

import {toggleNavMenu} from '../actions';

import Home from '../components/Home';

const mapStateToProps = (state) => {
  return {
    navMenuOpen: state.navMenu.open,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNavMenu: () => {
      dispatch(toggleNavMenu());
    },
  };
};

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeContainer;
