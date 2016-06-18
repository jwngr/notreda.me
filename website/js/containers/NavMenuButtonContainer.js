// Libraries
import { connect } from 'react-redux';

// Actions
import { toggleNavMenu } from '../actions';

// Presentational components
import NavMenuButton from '../components/NavMenuButton';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch(toggleNavMenu());
    }
  };
};

const NavMenuButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavMenuButton);

export default NavMenuButtonContainer;
