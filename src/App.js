import React from 'react';
import './App.css';

import { Layout, Menu, Breadcrumb } from 'antd';

import Project from './pages/Project';
import Settings from './pages/Settings';
import About from './pages/About';

import { NavLink, Route, Switch, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import * as counterActions from './actions/counter';
import { bindActionCreators } from 'redux';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    console.log('constructor');
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log(this.props);
    console.log('end componentDidMount');
  }

  render() {
    const { location } = this.props;
    console.log('app');
    console.log(this.props);
    console.log('app end');
    return (
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo logo-text">code-generator</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['/']}
            selectedKeys={[location.pathname]}
          >
            <Menu.Item key="/">
              <NavLink to="/">项目</NavLink>
            </Menu.Item>
            <Menu.Item key="/settings/1">
              <NavLink to="/settings/1">设置</NavLink>
            </Menu.Item>
            <Menu.Item key="/about">
              <NavLink to="/about">关于</NavLink>
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>应用</Breadcrumb.Item>
            <Breadcrumb.Item>项目</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 790 }}>
            <Switch>
              <Route path="/" component={Project} exact></Route>
              <Route path="/settings/:id" component={Settings}></Route>
              <Route path="/about" component={About}></Route>
            </Switch>
            {this.props.counter}
            <button
              onClick={() => {
                this.props.counterActions.increment(20);
              }}
            >
              +
            </button>
            <button
              onClick={() => {
                this.props.counterActions.decrement(10);
              }}
            >
              -
            </button>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    counter: state.counter,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    counterActions: bindActionCreators(counterActions, dispatch),
  };
};

const _withRouter = withRouter(App);

export default connect(mapStateToProps, mapDispatchToProps)(_withRouter);
