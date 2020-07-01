import React from 'react';
import './App.css';

import sd from 'silly-datetime';

import { Layout, Menu, Breadcrumb, Table, Space, Popconfirm, message, Button } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      pk: 'folderName',
      tableColumns: [
        {
          title: '排序',
          key: 'sortCode',
          render: record => {return record.json.sortCode},
        },
        {
          title: '项目名',
          dataIndex: 'json',
          key: 'json',
          render: record => record.name,
        },
        {
          title: '文件',
          dataIndex: 'folderName',
          key: 'folderName',
        },
        {
          title: '路径',
          dataIndex: 'folderPath',
          key: 'folderPath',
        },
        {
          title: '创建时间',
          key: 'createTime',
          render: record => {return record.json.createTime},
        },
        {
          title: '修改时间',
          key: 'updateTime',
          render: record => {return record.json.updateTime},
        },
        {
          title: '操作',
          key: 'operation',
          render: record => (
            <Space size="middle">
              <Button type="link">查看</Button>
              <Popconfirm
                placement="topRight"
                title={'你确定要删除项目吗?'}
                onConfirm={this.confirm}
                okText="删除"
                cancelText="取消"
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          ),
        },
      ],
    };
  }

  confirm() {
    message.success('选择了删除');
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log(dorne_code_gen.appUtils.getProjectList());
    console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'));
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
              columns={this.state.tableColumns}
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
