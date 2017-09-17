import { connect } from 'react-redux';

import YearSchedule from '../components/YearSchedule';


const mapStateToProps = (state) => {
  return {
    selectedYear: state.selectedYear,
  };
};


const YearScheduleContainer = connect(
  mapStateToProps,
)(YearSchedule);

export default YearScheduleContainer;
