import React from 'react';

import * as counterActions from '../actions/counter';
import * as locationActions from '../actions/location';
import { bindActionCreators } from 'redux';
import { connect as reduxConnect } from 'react-redux';

export function HOC(WrappedComponent) {
  return class HOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        newProps: {},
      };
    }

    componentDidMount() {
      let newProps = {};

      console.log('---------');
      console.log(this.props);
      console.log('---------');

      this.setState({ newProps: newProps });
      this.props.globaActions.locationActions.add({});

      if (this.props !== undefined && JSON.stringify(this.props) !== '{}') {
        if (this.props.match !== undefined && JSON.stringify(this.props.match) !== '{}') {
          if (
            this.props.match.params !== undefined &&
            JSON.stringify(this.props.match.params) !== '{}'
          ) {
            newProps = {
              wangdun: this.props.match,
            };
            this.setState({ newProps: newProps });
            this.props.globaActions.locationActions.add(this.props.match);
            console.log('-----1----');
            console.log(this.props);
            console.log('-----1----');
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
      globalProps : {
        ___counter: state.counter,
        ___location: state.location,
      }
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      globaActions:{
        counterActions: bindActionCreators(counterActions, dispatch),
        locationActions: bindActionCreators(locationActions, dispatch),
      }
    };
  };

  return reduxConnect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
