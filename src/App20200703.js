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
                placement="bottomRight"
                title={`确定要删除[${record.json.name}]项目吗?`}
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

    const breadcrumbList = [
      { path: '/evaluation', title: '风险评估决策', id: 300, pid: 0 },
      { path: '/evaluation/userTargeting', title: '用户定位检索', id: 301, pid: 300 },
      { path: '/evaluation/lyrical', title: '舆情评估', id: 302, pid: 300 },
      { path: '/evaluation/batch', title: '批量评估', id: 303, pid: 300 },
      { path: '/evaluation/expand', title: '拓展评估', id: 304, pid: 300 },
      { path: '/evaluation/history', title: '评估历史', id: 305, pid: 300 },

      { path: '/riskDisposal', title: '风险处置', id: 400, pid: 0 },
      { path: '/riskDisposal/domesticEvents', title: '国内事件处置', id: 401, pid: 400 },
      {
        path: '/riskDisposal/internationalRiskEvent',
        title: '国际风险事件处置',
        id: 402,
        pid: 400,
      },
      { path: '/riskDisposal/earlyWarningLibrary', title: '国内事件预警', id: 403, pid: 400 },
      { path: '/riskDisposal/collaborativeTeam', title: '协同团队处置事件', id: 404, pid: 400 },
      { path: '/riskDisposal/eventGeneration', title: '事件新增', id: 405, pid: 400 },
      //这块是动态的路由，参数是id,根据需求配置对应的路由参数
      {
        path: ({ id, name }) => `/riskDisposal/eventContent/details/${id}/${name}`,
        title: '事件详情',
        id: 406,
        pid: 400,
      },
      {
        path: ({ id }) => `/riskDisposal/eventContent/dealWith/${id}`,
        title: '事件处理',
        id: 407,
        pid: 400,
      },
      {
        path: ({ id }) => `/riskDisposal/eventContent/evaluation/${id}`,
        title: '事件评估',
        id: 408,
        pid: 400,
      },
      {
        path: ({ id, name }) => `/riskDisposal/eventContent/plan/${id}/${name}`,
        title: '事件预案',
        id: 409,
        pid: 400,
      },
    ];

    //根据地址栏地址，返回按照顺序的面包屑值
    const getBreadCrumbList = (pathname, params, arr = []) => {
      //breadcrumbList 这里就是那个面包屑数据
      let data = breadcrumbList.find(x => {
        if (typeof x.path === 'string') {
          return x.path === pathname;
        } else {
          return x.path(params) === pathname;
        }
      });
      if (!data) {
        return arr;
      }
      arr.unshift(data);
      if (data.pid === 0) {
        return arr;
      } else {
        let current = breadcrumbList.find(x => x.id === data.pid);
        return getBreadCrumbList(current.path, params, arr);
      }
    };

    let pathname = '/riskDisposal/eventContent/details/1555/wangdun';
    let params = {
      id: 1555,
      name: 'wangdun',
    };

    let breadcrumb = getBreadCrumbList(pathname, params);
    let strBreadcrumb = breadcrumb.map(item => {
      if (typeof item.path === 'string') {
        return item;
      } else {
        return { ...item, path: item.path(params) };
      }
    });
    console.log(strBreadcrumb);
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

              <Popconfirm
                placement="bottomRight"
                title={`确认要删除[${this.state.selectedRowKeys.length}个]项目吗?`}
                onConfirm={this.tableDelSelectRow.bind(this)}
                okText="删除"
                cancelText="取消"
              >
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!hasSelected}
                  loading={this.state.selectedRowloading}
                >
                  删除
                </Button>
              </Popconfirm>
              <Button
                onClick={this.tableReload}
                icon={<ReloadOutlined />}
                loading={this.state.tableReloadloading}
              >
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
