// Libraries
import React from 'react';

// Container components
import NavMenuContainer from '../containers/NavMenuContainer';
import NavMenuButtonContainer from '../containers/NavMenuButtonContainer';

class App extends React.Component {
  render() {
    return (
      <div>
        { this.props.children }

        <NavMenuContainer />
        <NavMenuButtonContainer />
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.any
};

export default App;
