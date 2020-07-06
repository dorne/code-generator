import React from 'react';

import * as counterActions from '../../actions/counter';
import * as matchActions from '../../actions/match';
import { bindActionCreators } from 'redux';
import { connect as reduxConnect } from 'react-redux';

import { withRouter } from 'react-router-dom';

const notNull = (val) => val !== undefined && JSON.stringify(val) !== '{}' ? true : false

export function base(WrappedComponent) {
  return class Base extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        newProps: {},
      };
    }

    componentDidMount() {
      //设置路由匹配的参数
      this.props.globalActions.matchActions.add({});
      if(notNull(this.props) && notNull(this.props.match) && notNull(this.props.match.params)){
        this.props.globalActions.matchActions.add(this.props.match)
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

export function baseComponent(WrappedComponent) {
    return connect(base(withRouter(WrappedComponent)));
  }

 