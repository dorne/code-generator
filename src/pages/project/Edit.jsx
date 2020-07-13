import React from 'react';

import { baseComponent } from '../../components/hof/base';

import { BulbOutlined, ApiOutlined, SyncOutlined, SearchOutlined } from '@ant-design/icons';

import Highlighter from 'react-highlight-words';

import * as sd from 'silly-datetime';

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

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  }

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  constructor(props) {
    super(props);
    this.state = {
      databaseList: dorne_code_gen.appUtils.databaseList(),
      tablesData: [],
      tablesColumns: [
        {
          title: '表名',
          dataIndex: 'name',
          key: 'name',
          ...this.getColumnSearchProps('name'),
        },
        {
          title: '备注',
          dataIndex: 'comment',
          key: 'comment',
          ...this.getColumnSearchProps('comment'),
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
      folderName: null,
      projectData: null,
    };
  }

  columnsDrawerShow = async (record, e) => {
    const database = this.formRef.current.getFieldValue('database');
    const uri = this.formRef.current.getFieldValue('uri');

    this.setState({
      columnsDrawerVisible: true,
    });

    try {
      const db = dorne_code_gen.appUtils.databaseAddon(database);
      let columns = await db.getColumns(uri, record.name);
      this.setState({
        columnsData: columns,
      });
    } catch (error) {}
  };

  columnsDrawerClose = () => {
    this.setState({
      columnsDrawerVisible: false,
      columnsData: [],
    });
  };

  getTables = async () => {
    const database = this.formRef.current.getFieldValue('database');
    const uri = this.formRef.current.getFieldValue('uri');
    try {
      const db = dorne_code_gen.appUtils.databaseAddon(database);
      let tables = await db.getTables(uri);
      console.log(tables);
      this.setState({
        tablesData: tables,
      });
    } catch (error) {}
  };

  testConnect = async () => {
    const database = this.formRef.current.getFieldValue('database');
    const uri = this.formRef.current.getFieldValue('uri');
    if (!database) {
      message.error(`请先选中数据库类型`);
      return false;
    }

    try {
      const db = dorne_code_gen.appUtils.databaseAddon(database);
      let msg = await db.testConnection(uri);
      if (!msg) {
        message.success(`连接成功`);
      } else {
        Modal.info({
          width: 700,
          title: '数据库连接错误',
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
      const val = { ...values, updateTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') };
      const res = dorne_code_gen.appUtils.saveProject(this.state.folderName, val);
      if (res.code === 1) {
        message.success(`${res.msg}`);
      } else {
        message.error(`${res.msg}`);
      }
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

  componentWillMount() {
    console.log('``````````````render```````````0000');
    const folderName = this.props.match.params.folderName;
    this.setState({ editMode: folderName ? true : false });

    if (folderName) {
      this.setState({
        projectData: dorne_code_gen.appUtils.getProject(folderName),
        folderName: folderName,
      });
    }
  }

  componentDidMount() {}

  render() {
    const btnText = this.state.editMode ? '编辑' : '添加';
    const databaseList = this.state.databaseList;
    console.log('databaseList render');
    console.log(databaseList);
    const disabled = this.state.editMode ? true : false;
    const formData = this.state.projectData ? this.state.projectData : undefined;
    const folderName = this.state.folderName ? this.state.folderName : '';

    return (
      <React.Fragment>
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
          initialValues={formData}
        >
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="项目基础设置" key="1">
              <Form.Item style={{ display: 'none' }} name="createTime" label="创建时间">
                <Input />
              </Form.Item>
              <Form.Item style={{ display: 'none' }} name="updateTime" label="修改时间">
                <Input />
              </Form.Item>
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
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={!disabled ? 'folderName' : undefined}
                label="文件夹名"
                rules={
                  !disabled
                    ? [
                        {
                          required: true,
                        },
                        {
                          pattern: /^[A-Za-z0-9/_/-]+$/,
                          message: '只允许英文字符和数字',
                        },
                      ]
                    : undefined
                }
              >
                <Input value={folderName} disabled={disabled} />
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
                  <Select placeholder="请选择数据驱动" allowClear>
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
            pagination={false}
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
