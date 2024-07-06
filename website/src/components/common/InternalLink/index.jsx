import {push} from 'connected-react-router';
import React from 'react';
import {connect} from 'react-redux';

function asInternalLink(WrappedComponent) {
  return class extends React.Component {
    handleClick(e) {
      const {href, onClick, $navigateTo} = this.props;

      // Run the custom onClick method, if provided.
      onClick && onClick();

      // Navigate to the new route.
      $navigateTo(href);

      // Scroll back to the top of the page.
      window.scrollTo(0, 0);

      // Preven the default link behavior, which is a page reload.
      e.preventDefault();
    }

    render() {
      return <WrappedComponent onClick={this.handleClick.bind(this)} href={this.props.href} />;
    }
  };
}

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (path) => {
    dispatch(push(path));
  },
});

export const InternalLink = connect(null, mapDispatchToProps)(asInternalLink('a'));
