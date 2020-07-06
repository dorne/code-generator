import React from 'react';

import * as counterActions from '../../actions/counter';
import * as matchActions from '../../actions/match';
import { bindActionCreators } from 'redux';
import { connect as reduxConnect } from 'react-redux';

export function Base(WrappedComponent) {
  return class Base extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        newProps: {},
      };
    }

    componentDidMount() {
      this.props.globalActions.matchActions.add({});

      if (this.props !== undefined && JSON.stringify(this.props) !== '{}') {
        if (this.props.match !== undefined && JSON.stringify(this.props.match) !== '{}') {
          if (
            this.props.match.params !== undefined &&
            JSON.stringify(this.props.match.params) !== '{}'
          ) {
            this.props.globalActions.matchActions.add(this.props.match);
          }
        }
      }
    }

    render() {
      return (
        <div>
          <WrappedComponent {...this.props} {...this.state.newProps} />
        </div>
      );
    }
  };
}

export function connect(WrappedComponent) {
  const mapStateToProps = state => {
    return {
      globalProps: {
        counter: state.counter,
        match: state.match,
      },
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      globalActions: {
        counterActions: bindActionCreators(counterActions, dispatch),
        matchActions: bindActionCreators(matchActions, dispatch),
      },
    };
  };

  return reduxConnect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
