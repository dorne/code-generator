import React from 'react';
import './App.css';

import sd from 'silly-datetime';

import { Layout, Menu, Breadcrumb, Table, Space, Popconfirm, message, Button, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined, SettingOutlined, ReloadOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      pk: 'folderName',
      selectedRowloading: false,
      tableReloadloading: false,
      selectedRowKeys: [],
      tableColumns: [
        {
          title: '排序',
          key: 'sortCode',
          width: 80,
          // defaultSortOrder: 'ascend',
          defaultSortOrder: 'descend',
          sorter: (a, b) => {
            return a.json.sortCode - b.json.sortCode;
          },
          render: record => {
            return record.json.sortCode;
          },
        },
        {
          title: '项目名',
          dataIndex: 'json',
          key: 'json',
          render: record => record.name,
        },
        {
          title: '文件夹',
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
          defaultSortOrder: '',
          sorter: (a, b) => {
            return a.json.createTime - b.json.createTime;
          },
          render: record => {
            return record.json.createTime;
          },
        },
        {
          title: '修改时间',
          key: 'updateTime',
          defaultSortOrder: '',
          sorter: (a, b) => {
            return a.json.updateTime - b.json.updateTime;
          },
          render: record => {
            return record.json.updateTime;
          },
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          width: 30,
          render: record => (
            <Space size="middle">
              <Tooltip title="配置">
                <Button type="primary" shape="circle" icon={<SettingOutlined />} size="small" />
              </Tooltip>
              <Popconfirm
                placement="topRight"
                title={`你确定要删除[${record.json.name}]项目吗?`}
                onConfirm={this.tableDelRow.bind(this, record)}
                okText="删除"
                cancelText="取消"
              >
                <Tooltip title="删除">
                  <Button
                    danger
                    type="primary"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          ),
        },
      ],
    };
  }

  /***
   * table删除单行
   */
  tableDelRow = (record, e) => {
    const p = this;
    dorne_code_gen.rmdir(record.folderPath, function (err, dirs, files) {
      console.log('all files are removed');
      message.success(`[${record.json.name}]删除成功`);
      p.setState({
        tableData: dorne_code_gen.appUtils.getProjectList(),
      });
    });
  };

  /***
   * table删除选中行
   */
  tableDelSelectRow = async () => {
    const p = this;
    p.setState({
      selectedRowloading: true,
    });
    const selectRow = this.state.tableData.filter(item =>
      this.state.selectedRowKeys.includes(item.folderName),
    );

    await selectRow.forEach(element => {
      dorne_code_gen.rmdir(element.folderPath, function (err, dirs, files) {
        p.setState({
          tableData: dorne_code_gen.appUtils.getProjectList(),
        });
      });
    });

    setTimeout(() => {
      message.success(`[${this.state.selectedRowKeys.length}个]项目已删除成功`);
      this.setState({
        selectedRowloading: false,
        selectedRowKeys: [],
      });
    }, 500);
  };

  /**
   * table选中行
   * @param {Array} selectedRowKeys
   */
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  /***
   * table刷新
   */
  tableReload = e => {
    this.setState({
      tableData: dorne_code_gen.appUtils.getProjectList(),
      tableReloadloading: true,
    });

    setTimeout(() => {
      message.success(`刷新成功`);
      this.setState({
        tableReloadloading: false,
      });
    }, 500);
   
  };

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
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo logo-text">code-generator</div>
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
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />}>
                添加
              </Button>
              <Button
                onClick={this.tableDelSelectRow}
                type="primary"
                danger
                icon={<DeleteOutlined />}
                disabled={!hasSelected}
                loading={this.state.selectedRowloading}
              >
                删除
              </Button>
              <Button onClick={this.tableReload} icon={<ReloadOutlined />} loading={this.state.tableReloadloading}>
                刷新
              </Button>
            </Space>
            <Table
              rowSelection={rowSelection}
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
