import React from 'react';

import * as counterActions from '../../actions/counter';
import * as matchActions from '../../actions/match';
import * as routesActions from '../../actions/routes';
import * as breadcrumbActions from '../../actions/breadcrumb';
import { bindActionCreators } from 'redux';
import { connect as reduxConnect } from 'react-redux';

import { withRouter } from 'react-router-dom';

const notNull = val => (val !== undefined && JSON.stringify(val) !== '{}' ? true : false);

//根据地址栏地址，返回按照顺序的面包屑值
const getBreadCrumbList = (routes, pathname, params, arr = []) => {
  //breadcrumbList 这里就是那个面包屑数据
  let data = routes.find(x => {
    if (typeof x.routeMateData.match === 'string') {
      return x.routeMateData.match === pathname;
    } else {
      return x.routeMateData.match(params) === pathname;
    }
  });
  if (!data) {
    return arr;
  }
  arr.unshift(data);
  if (data.routeMateData.pid === 0) {
    return arr;
  } else {
    let current = routes.find(x => x.routeMateData.id === data.routeMateData.pid);
    console.log('当前页路径');
    console.log(current);
    const path = typeof current.routeMateData.match === 'string' ? current.routeMateData.match : current.routeMateData.match(params);
    return getBreadCrumbList(routes, path, params, arr);
  }
};

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
      let params = {};
      //this.props.globalActions.matchActions.add({});
      if (notNull(this.props) && notNull(this.props.match) && notNull(this.props.match.params)) {
        this.props.globalActions.matchActions.add(this.props.match);
        params = this.props.match.params
      }

      if (notNull(this.props) && notNull(this.props.location) && notNull(this.props.location.pathname)) {
        const routes = this.props.globalProps.routes;
        const pathname = this.props.location.pathname;
        let breadcrumb = getBreadCrumbList(routes, pathname, params);

        let strBreadcrumb = breadcrumb.map(item => {
          if (typeof item.routeMateData.match === 'string') {
            return {...item};
          } else {
            return {
              ...item,
              routeMateData: { ...item.routeMateData, match: item.routeMateData.match(params) },
            };
          }
        });

        this.props.globalActions.breadcrumbActions.add(strBreadcrumb);

        // console.log('----xxxxxxxxxxxxxxxxxxx--')
        // console.log(strBreadcrumb);
        // let a  = strBreadcrumb.map(e => e.routeMateData.match);
        // console.log(a);
        // console.log('---xxxxxxxxxxxxxxxxxxxx---')
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
        routes: state.routes,
        breadcrumb: state.breadcrumb
      },
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      globalActions: {
        counterActions: bindActionCreators(counterActions, dispatch),
        matchActions: bindActionCreators(matchActions, dispatch),
        routesActions: bindActionCreators(routesActions, dispatch),
        breadcrumbActions:  bindActionCreators(breadcrumbActions, dispatch),
      },
    };
  };

  return reduxConnect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}

export function baseComponent(WrappedComponent) {
  return connect(base(withRouter(WrappedComponent)));
}
