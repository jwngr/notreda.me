import Loadable from 'react-loadable';
import React, {Component} from 'react';
import {Fragment} from 'redux-little-router';

const AsyncFootballScheduleScreen = Loadable({
  loader: () => import('./screens/FootballScheduleScreen/container'),
  loading: () => null,
});

class App extends Component {
  render() {
    return (
      <Fragment forRoute="/">
        <div>
          <Fragment forRoute="/" forNoMatch>
            <AsyncFootballScheduleScreen />
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

export default App;
