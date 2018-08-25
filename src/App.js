import Loadable from 'react-loadable';
import React, {Component} from 'react';
import {Fragment} from 'redux-little-router';

// Async components
const AsyncFootballScheduleScreen = Loadable({
  loader: () => import('./screens/FootballScheduleScreen/container'),
  loading: () => null,
});

class App extends Component {
  render() {
    return (
      <Fragment forRoute="/">
        <div>
          <Fragment forRoute="/:year/:selectedGameIndex">
            <AsyncFootballScheduleScreen />
          </Fragment>
          <Fragment forRoute="/:year">
            <AsyncFootballScheduleScreen />
          </Fragment>
          <Fragment forNoMatch>
            <AsyncFootballScheduleScreen />
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

export default App;
