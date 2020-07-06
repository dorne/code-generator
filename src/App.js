import React from 'react';
import './App.css';

import { Layout, Menu, Breadcrumb } from 'antd';

import { NavLink, Route, Switch } from 'react-router-dom';

import { baseComponent } from './components/hof/base';
import { mainRoutes } from './routes';

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
    let { component, routes = [] } = this.props;
    console.log(component, routes);
    const { location } = this.props;
    console.log('app render');
    console.log(this.props);
    console.log('app end render');

    const match = this.props.globalProps.match.hasOwnProperty('params')
      ? JSON.stringify(this.props.globalProps.match.params)
      : '无参数';

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
            {mainRoutes.map(route => {
              if (
                route.mateData.hasOwnProperty('isMenu') &&
                route.mateData.isMenu
              ) {
                return (
                  <Menu.Item key={route.path}>
                    <NavLink to={route.path}>{route.mateData.name}</NavLink>
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
            <Breadcrumb.Item>项目</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 790 }}>
            <Switch>
              {mainRoutes.map(route => {
                return <Route key={route.path} {...route} />;
              })}
            </Switch>
            {match}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    );
  }
}

export default baseComponent(App);
