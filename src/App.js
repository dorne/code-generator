import React from 'react';
import './App.css';

import { Layout, Menu, Breadcrumb, Table, Space, Button } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      pk: 'folderName',
    };
  }

  tableColumns() {
    return [
      {
        title: 'folderName',
        dataIndex: 'folderName',
        key: 'folderName',
      },

      {
        title: 'Address',
        dataIndex: 'json',
        key: 'json',
        render: record => record.name,
      },
      {
        title: 'Action',
        key: 'operation',
        render: record => (
          <Space size="middle">
            <a>Invite {record.folderName}</a>
            <a>Delete</a>
          </Space>
        ),
      },
    ];
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log(dorne_code_gen.appUtils.getProjectList());
    this.setState({
      /*global dorne_code_gen*/
    /*eslint no-undef: "error"*/
      tableData: dorne_code_gen.appUtils.getProjectList(),
    });
  }

  render() {
    return (
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo logo-text">多恩代码生成器</div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">项目</Menu.Item>
            <Menu.Item key="2">设置</Menu.Item>
            <Menu.Item key="3">关于</Menu.Item>
          </Menu>
        </Header>
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>应用</Breadcrumb.Item>
            <Breadcrumb.Item>项目</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 790 }}>
            <Table
              rowKey={record => {
                return record[this.state.pk];
              }}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                defaultPageSize: 10,
                defaultCurrent: 1,
              }}
              bordered
              columns={this.tableColumns()}
              dataSource={this.state.tableData}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    );
  }
}

export default App;
