import React from 'react';

import { baseComponent } from '../../components/hof/base';

import { BulbOutlined, ApiOutlined, SyncOutlined } from '@ant-design/icons';

import {
  Form,
  Input,
  Button,
  message,
  Collapse,
  Select,
  Modal,
  Alert,
  Table,
  Space,
  Drawer,
  Tooltip,
} from 'antd';
const { Panel } = Collapse;
const { Option } = Select;

const btnStyle = {
  marginTop: 16,
  marginRight: 16,
};

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 14,
  },
};

class Edit extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      databaseList: dorne_code_gen.appUtils.databaseList(),
      uri: '',
      database: '',
      tablesData: [],
      tablesColumns: [
        {
          title: '表名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '备注',
          dataIndex: 'comment',
          key: 'comment',
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          render: record => (
            <Space size="middle">
              <Tooltip title="配置">
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<SyncOutlined />}
                  onClick={this.columnsDrawerShow.bind(this, record)}
                />
              </Tooltip>
            </Space>
          ),
        },
      ],
      columnsDrawerVisible: false,
      columnsData: [],
      columnsColumns: [
        {
          title: '字段',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '备注',
          dataIndex: 'comment',
          key: 'comment',
        },
      ],
    };
  }

  columnsDrawerShow = async (record, e) => {
    this.setState({
      columnsDrawerVisible: true,
    });

    try {
      const db = dorne_code_gen.appUtils.databaseAddon(this.state.database);
      let columns = await db.getColumns(this.state.uri, record.name);
      this.setState({
        columnsData: columns,
      });
    } catch (error) {}
  };

  columnsDrawerClose = () => {
    this.setState({
      columnsDrawerVisible: false,
      columnsData: []
    });
  };

  handleURIValue = event => {
    this.setState({
      uri: event.target.value,
    });
  };

  handleDatabaseValue = value => {
    this.setState({
      database: value,
    });
  };

  getTables = async () => {
    try {
      const db = dorne_code_gen.appUtils.databaseAddon(this.state.database);
      let tables = await db.getTables(this.state.uri);
      console.log(tables);
      this.setState({
        tablesData: tables,
      });
    } catch (error) {}
  };

  testConnect = async () => {
    if (!this.state.database) {
      message.error(`请先选中数据库类型`);
      return false;
    }

    try {
      const db = dorne_code_gen.appUtils.databaseAddon(this.state.database);
      let msg = await db.testConnection(this.state.uri);
      if (!msg) {
        message.success(`连接成功`);
      } else {
        Modal.info({
          width: 700,
          title: '如何配置数据库uri',
          content: (
            <div>
              <p style={{ color: '#ff4d4f' }}>{msg}</p>
            </div>
          ),
          onOk() {},
        });
      }
    } catch (error) {
      Modal.error({
        width: 700,
        title: '数据库uri配置错误',
        content: (
          <div>
            <p style={{ color: '#ff4d4f' }}>{error.message}</p>
          </div>
        ),
        onOk() {},
      });
    }
  };

  howtoURI = () => {
    Modal.info({
      width: 700,
      title: '如何配置数据库uri',
      content: (
        <div>
          <Input
            style={{ marginTop: 16 }}
            addonBefore="sqlite"
            defaultValue="sqlite:c:/db.sqlite"
          />
          <Input
            style={{ marginTop: 16 }}
            addonBefore="mysql"
            defaultValue="mysql://user:pass@example.com:5432/dbname"
          />
        </div>
      ),
      onOk() {},
    });
  };

  onFinish = values => {
    /*global dorne_code_gen*/
    /*eslint no-undef: "error"*/
    if (this.state.editMode) {
      message.success(`编辑模式`);
    } else {
      const res = dorne_code_gen.appUtils.addProject(values);
      if (res.code === 1) {
        message.success(`${res.msg}`);
        this.props.history.push(`/project/list`);
      } else {
        message.error(`${res.msg}`);
      }
    }
  };

  onBack = () => {
    this.props.history.push('/project/list');
  };

  componentDidMount() {
    this.setState({
      editMode: this.props.match.params.folderName ? true : false,
    });
  }

  render() {
    const btnText = this.state.editMode ? '编辑' : '添加';
    const databaseList = this.state.databaseList;
    console.log('databaseList render');
    console.log(databaseList);
    return (
      <React.Fragment>
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
          initialValues={{ sortCode: 0 }}
        >
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="项目基础设置" key="1">
              <Form.Item
                name="sortCode"
                label="排序"
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (value > -1 && value < 999999999999) {
                        return Promise.resolve();
                      }
                      return Promise.reject('请填写大于0的数字');
                    },
                  }),
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="项目名"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: /^[A-Za-z0-9/_/-]+$/,
                    message: '只允许英文字符和数字',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="folderName"
                label="文件夹名"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: /^[A-Za-z0-9/_/-]+$/,
                    message: '只允许英文字符和数字',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Panel>
            {this.state.editMode ? (
              <Panel header="数据库配置" key="2">
                <Form.Item
                  name="database"
                  label="数据库类型"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择数据驱动"
                    allowClear
                    onChange={this.handleDatabaseValue}
                  >
                    {this.state.databaseList.map(data => {
                      return (
                        <Option key={data} value={data}>
                          {data}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="uri"
                  label="数据库连接uri"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  onChange={this.handleURIValue}
                >
                  <Input
                    addonAfter={
                      <>
                        <Button icon={<BulbOutlined />} size="small" onClick={this.howtoURI}>
                          如何配置
                        </Button>
                        <Button
                          style={{ marginLeft: 10 }}
                          icon={<ApiOutlined />}
                          onClick={this.testConnect}
                          size="small"
                        >
                          测试连接
                        </Button>
                      </>
                    }
                  />
                </Form.Item>
              </Panel>
            ) : null}
            {this.state.editMode ? (
              <Panel header="表" key="3">
                <Space style={{ marginBottom: 16 }}>
                  <Button onClick={this.getTables} icon={<SyncOutlined />}>
                    拉取表
                  </Button>
                </Space>

                <Table
                  rowKey={record => {
                    return record.name;
                  }}
                  pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                    showTotal: total => {
                      return `共 ${total} 条`;
                    },
                  }}
                  bordered
                  columns={this.state.tablesColumns}
                  dataSource={this.state.tablesData}
                />
              </Panel>
            ) : null}
          </Collapse>
          <Form.Item {...tailLayout}>
            <Button style={btnStyle} type="primary" htmlType="submit">
              {btnText}
            </Button>
            <Button style={btnStyle} htmlType="button" onClick={this.onBack}>
              返回
            </Button>
          </Form.Item>
        </Form>
        <Drawer
          afterVisibleChange={console.log('afterVisibleChange')}
          title="字段管理"
          placement="right"
          closable={false}
          width={520}
          onClose={this.columnsDrawerClose}
          visible={this.state.columnsDrawerVisible}
        >
          <Table
            rowKey={record => {
              return record.name;
            }}
            pagination={ false }
            bordered
            columns={this.state.columnsColumns}
            dataSource={this.state.columnsData}
          />
        </Drawer>
      </React.Fragment>
    );
  }
}

export default baseComponent(Edit);
