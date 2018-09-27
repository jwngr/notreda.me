import React from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-little-router';

function asInternalLink(WrappedComponent) {
  return class extends React.Component {
    handleClick(e) {
      const {href, onClick, navigateTo} = this.props;

      // Run the custom onClick method, if provided.
      onClick && onClick();

      // Navigate to the new route.
      navigateTo(href);

      // Scroll back to the top of the page.
      window.scrollTo(0, 0);

      // Preven the default link behavior, which is a page reload.
      e.preventDefault();
    }

    render() {
      const {navigateTo, onClick, ...otherProps} = this.props;

      return <WrappedComponent onClick={this.handleClick.bind(this)} {...otherProps} />;
    }
  };
}

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (path) => {
    dispatch(push(path));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(asInternalLink('a'));
