import React from 'react';
import './App.css';
import conf from '../package.json';

import { Layout, Menu, Breadcrumb } from 'antd';

import { NavLink, Route, Switch as RouterSwitch, Redirect, Link } from 'react-router-dom';

import { baseComponent } from './components/hof/base';
import { mainRoutes } from './routes';

import SettingsWidget from './pages/SettingsWidget'

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    console.log('constructor');
    this.props.globalActions.routesActions.add(mainRoutes);
  }

  componentWillMount() {
    console.log('***************************************************************');
    /*global dorne_code_gen*/
    /*eslint no-undef: "error"*/
    dorne_code_gen.appUtils.initResources();
  }

  componentDidMount() {
    console.log('app componentDidMount');
    console.log(this.props);
    console.log('app end componentDidMount');
  }


  render() {
    let { component, routes = [] } = this.props;
    console.log(component, routes);
    const { location } = this.props;
    console.log('app render');
    console.log(this.props);
    console.log('app end render');

    const match = this.props.globalProps.match.hasOwnProperty('params')
      ? JSON.stringify(this.props.globalProps.match.params)
      : '无参数';

    const breadcrumb = this.props.globalProps.breadcrumb;
    const selectedKeys = breadcrumb.map(e => e.routeMateData.id.toString());

    console.log('导航 selectedKeys');
    console.log(selectedKeys);

    return (
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo logo-text">多恩代码生成器</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[1]}
            selectedKeys={selectedKeys}
          >
            {mainRoutes.map(route => {
              if (route.routeMateData.hasOwnProperty('isMenu') && route.routeMateData.isMenu) {
                return (
                  <Menu.Item key={route.routeMateData.id}>
                    <NavLink to={route.routeMateData.path ? route.routeMateData.path : route.path}>
                      {route.routeMateData.title}
                    </NavLink>
                  </Menu.Item>
                );
              } else {
                return '';
              }
            })}
          </Menu>
        </Header>
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>应用</Breadcrumb.Item>
            {breadcrumb.map(item => {
              return (
                <Breadcrumb.Item key={item.routeMateData.id}>
                  <Link to={item.routeMateData.match}>{item.routeMateData.title}</Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 790 }}>
            <RouterSwitch>
              {mainRoutes.map(route => {
                return <Route key={route.path} {...route} />;
              })}
              <Redirect path="/" to="/project/list"></Redirect>
            </RouterSwitch>
            {/* {match} */}
            <SettingsWidget />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Copyright © 2020 多恩云. All rights reserved. ver:{conf.version}
        </Footer>
      </Layout>
    );
  }
}

export default baseComponent(App);
