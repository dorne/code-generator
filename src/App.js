import React from 'react';
import './App.css';

import { Layout, Menu, Breadcrumb } from 'antd';

import Project from './pages/Project';
import Settings from './pages/Settings';
import About from './pages/About';

import { NavLink, Route, Switch, withRouter } from 'react-router-dom';




import {HOC, connect} from './components/tools'

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    console.log('constructor');
  }

  componentDidMount() {
    console.log('app componentDidMount');
    console.log(this.props);
    console.log('app end componentDidMount');
  }

  render() {
    let { component, routes = [] } = this.props
    console.log(component, routes)
    const { location } = this.props;
    console.log('app render');
    console.log(this.props);
    console.log('app end render');
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
            {this.props.globalProps.___location.path}
            {this.props.globalProps.___counter}
            <button
              onClick={() => {
                this.props.globaActions.counterActions.increment(20);
              }}
            >
              +
            </button>
            <button
              onClick={() => {
                this.props.globaActions.counterActions.decrement(10);
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



const _withRouter = withRouter(App);


export default connect(HOC(_withRouter));
