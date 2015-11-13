// Libraries
import React from 'react';
import { render } from 'react-dom';
import { Route, Router, Link } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Components
import About from './About';
import Inbox from './Inbox';
import NavMenu from './navMenu/NavMenu';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navMenuOpen: false
    };
  }

  handleShowHideMenuClick() {
    this.setState({
      navMenuOpen: !this.state.navMenuOpen
    });
  }

  render() {
    return (
      <div>
        <h1>Go Irish!</h1>
        <ul>
          <li><Link to='/about'>About</Link></li>
          <li><Link to='/inbox'>Inbox</Link></li>
        </ul>

        { this.props.children }

        <span className='nav-menu-open-button' onClick={ this.handleShowHideMenuClick.bind(this) }>O</span>

        <NavMenu open={ this.state.navMenuOpen } toggleNavMenuOpen={ this.handleShowHideMenuClick.bind(this) } />
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.any
};

const routes = (
  <Route path='/' component={ App }>
    <Route path='about' component={ About } />
    <Route path='inbox' component={ Inbox } />
  </Route>
);

const history = createBrowserHistory();

render(<Router history={ history }>{ routes }</Router>, document.getElementById('app'));
