import {connect} from 'react-redux';

import {FootballScheduleScreen} from './index';

const mapStateToProps = (state) => {
  return {
    selectedYear: state.selectedYear,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export const FootballScheduleScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FootballScheduleScreen);
