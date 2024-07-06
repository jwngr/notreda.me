import {connect} from 'react-redux';

import {NavMenu} from '../components/NavMenu';

const mapStateToProps = (state) => {
  return {
    selectedYear: state.selectedYear,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export const NavMenuContainer = connect(mapStateToProps, mapDispatchToProps)(NavMenu);
