import { connect } from 'react-redux';

import { toggleNavMenu } from '../actions';

import NavMenuButton from '../components/navMenu/NavMenuButton';


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch(toggleNavMenu());
    },
  };
};


const NavMenuButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavMenuButton);

export default NavMenuButtonContainer;
