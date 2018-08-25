import React from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-little-router';

function asInternalLink(WrappedComponent) {
  return class extends React.Component {
    handleClick(e) {
      e.preventDefault();
      this.props.navigateTo(this.props.href);
    }

    render() {
      const {navigateTo, ...otherProps} = this.props;
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
