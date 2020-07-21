import React from 'react';

import { baseComponent } from '../../components/hof/base';

import {
  BulbOutlined,
  ApiOutlined,
  SyncOutlined,
  SearchOutlined,
  DeleteOutlined,
  ReloadOutlined,
  RestOutlined,
  SettingOutlined,
  PlusOutlined,
  SendOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';

import Highlighter from 'react-highlight-words';

import * as collect from 'collect.js';

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
  Popconfirm,
  Spin,
  Progress,
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
    span: 24,
    style: { textAlign: 'right' },
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
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

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

  taskBuild = async (task = null, table = null) => {
    this.setState({
      buildPercent: 0,
      buildMsg: '加载中',
    });

    const p = this;
    this.setState({
      buildVisible: true,
    });
    const tablePrefix = this.formRef.current.getFieldValue('tablePrefix');
    const database = this.formRef.current.getFieldValue('database');
    const uri = this.formRef.current.getFieldValue('uri');

    const buildPercent = (index, len) => {
      if (index + 1 === len) {
        this.setState({
          buildPercent: 100,
        });
      } else {
        this.setState({
          buildPercent: this.state.buildPercent + Math.round(100 / len),
        });
      }
    };

    const build = (task, table, columns) => {
      try {
        const text = dorne_code_gen.appUtils.artTemplate().render(task.code, {
          table: table,
          columns: columns,
        });

        const saveName = dorne_code_gen.appUtils.artTemplate().render(task.saveName, {
          table: table,
          columns: columns,
        });

        if (!dorne_code_gen.fs.existsSync(task.savePath)) {
          dorne_code_gen.fs.mkdirSync(task.savePath, { recursive: true });
        }
        const path = dorne_code_gen.path.join(task.savePath, `/${saveName}`);

        dorne_code_gen.fs.writeFileSync(path, text, 'utf-8');
        return { code: 1, msg: '模版生成成功' };
      } catch (err) {
        console.error(err)
        return { code: 0, msg: err.message };
      }
    };

    console.log('taskBuild');

    if (!this.state.filterData || this.state.filterData.length < 1) {
      message.error(`无候选表可生成`);
      this.setState({
        buildVisible: false,
      });
      return false;
    }

    const _filterData = table ? [table] : this.state.filterData;

    for (let index in _filterData) {
      let table = _filterData[index];
      const db = dorne_code_gen.appUtils.databaseAddon(database);
      let columns = [];
      try {
        columns = await db.getColumns(uri, table.name);
      } catch (e) {
        message.error(`生成表[${table.name}]错误:${e.message}`);
        this.setState({
          buildVisible: false,
        });
        return false;
      }
      table.convertName = table.name;
      if (tablePrefix && table.name.startsWith(tablePrefix)) {
        table.convertName = table.name.substr(tablePrefix.length, table.name.length);
      }

      console.log('----------taskBuild---------');
      console.log(table);
      console.log(columns);
      console.log(tablePrefix);

      if (task) {
        const _build = build(task, table, columns);
        if (_build.code) {
          buildPercent(index, _filterData.length);
          this.setState({ buildMsg: `[${task.name}]任务正在生成[${table.name}]表` });
        } else {
          message.error(_build.msg);
          this.setState({
            buildVisible: false,
          });
          return false;
        }
      } else {
        if (!p.state.taskData || p.state.taskData.length < 1) {
          message.error(`无任务可生成`);
          this.setState({
            buildVisible: false,
          });
          return false;
        }
        for (let _index in p.state.taskData) {
          let _task = p.state.taskData[_index];
          if (_task.isRun) {
            const _build = build(_task, table, columns);
            if (_build.code) {
              setTimeout(() => {
                this.setState({ buildMsg: `[${_task.name}]任务正在生成[${table.name}]表` });
              }, 1000);
            } else {
              message.error(_build.msg);
              this.setState({
                buildVisible: false,
              });
              return false;
            }
          }
        }
        buildPercent(index, _filterData.length);
      }
    }

    setTimeout(() => {
      this.setState({
        buildVisible: false,
        buildMsg: '完成',
      });
      message.success(`生成成功`);
    }, 1000);
  };

  constructor(props) {
    super(props);
    this.state = {
      databaseList: dorne_code_gen.appUtils.databaseList(),
      collapseKeys: [],
      tablesReloadloading: false,
      tablesSelRowKeys: [],
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
      columnsLoading: true,
      taskSelRowKeys: [],
      taskData: [],
      taskColumns: [
        {
          title: '任务名',
          dataIndex: 'name',
          key: 'name',
          ...this.getColumnSearchProps('name'),
        },
        {
          title: '代码格式',
          dataIndex: 'codeLang',
          key: 'codeLang',
          ...this.getColumnSearchProps('codeLang'),
        },
        {
          title: '是否启用',
          dataIndex: 'isRun',
          key: 'isRun',
          ...this.getColumnSearchProps('isRun'),
          render: record => {
            return record ? '启用' : '关闭';
          },
        },
        {
          title: '生成路径',
          dataIndex: 'savePath',
          key: 'savePath',
          ...this.getColumnSearchProps('savePath'),
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          render: record => (
            <Space size="middle">
              <Tooltip title="生成">
                <Button
                  shape="circle"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={this.taskBuild.bind(this, record, null)}
                />
              </Tooltip>
              <Tooltip title="配置">
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => {
                    this.props.history.push(
                      `/project/edit/${this.state.folderName}/task/edit/${record.id}`,
                    );
                  }}
                />
              </Tooltip>
              <Popconfirm
                placement="bottomRight"
                title={`确定要删除[${record.name}]任务吗?`}
                onConfirm={this.onTaskDelSelectRow.bind(this, record)}
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
      filterSelRowKeys: [],
      filterData: [],
      filterColumns: [
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
              <Tooltip title="生成">
                <Button
                  shape="circle"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={this.taskBuild.bind(this, null, record)}
                />
              </Tooltip>
              <Popconfirm
                placement="bottomRight"
                title={`确定要删除[${record.name}]候选表吗?`}
                onConfirm={this.onFilterDelSelectRow.bind(this, record)}
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
      folderName: null,
      projectData: null,
      buildVisible: false,
      buildPercent: 100,
      buildMsg: '',
    };
  }

  columnsDrawerShow = async (record, e) => {
    const database = this.formRef.current.getFieldValue('database');
    const uri = this.formRef.current.getFieldValue('uri');

    this.setState({
      columnsDrawerVisible: true,
      columnsLoading: true,
    });

    try {
      const db = dorne_code_gen.appUtils.databaseAddon(database);
      let columns = await db.getColumns(uri, record.name);
      this.setState({
        columnsData: columns,
      });
    } catch (error) {}

    setTimeout(() => {
      this.setState({
        columnsLoading: false,
      });
    }, 200);
  };

  columnsDrawerClose = () => {
    this.setState({
      columnsDrawerVisible: false,
    });
    setTimeout(() => {
      this.setState({
        columnsLoading: true,
        columnsData: [],
      });
    }, 200);
  };

  getTables = async () => {
    const database = this.formRef.current.getFieldValue('database');
    const uri = this.formRef.current.getFieldValue('uri');
    this.setState({
      tablesReloadloading: true,
    });

    let errMsg = null;
    try {
      const db = dorne_code_gen.appUtils.databaseAddon(database);
      let tables = await db.getTables(uri);
      console.log(tables);
      this.setState({
        tablesData: tables,
      });
    } catch (error) {
      errMsg = error.message;
    }

    setTimeout(() => {
      errMsg ? message.error(errMsg) : message.success(`拉取成功`);
      this.setState({
        tablesReloadloading: false,
      });
    }, 500);
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
    if (this.state.editMode) {
      /*global dorne_code_gen*/
      /*eslint no-undef: "error"*/
      const obj = dorne_code_gen.appUtils.getProject(this.state.folderName);
      values.updateTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
      const project = Object.assign({}, obj, values);
      const res = dorne_code_gen.appUtils.saveProject(this.state.folderName, project);
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
    const folderName = this.props.match.params.folderName;
    this.setState({ editMode: folderName ? true : false });

    const projectData = folderName ? dorne_code_gen.appUtils.getProject(folderName) : {};
    const filterData = projectData.filterData ? projectData.filterData : [];
    const taskData = projectData.taskData ? projectData.taskData : [];
    const collapseKeys = projectData.collapseKeys ? projectData.collapseKeys : ['1'];
    this.setState({
      collapseKeys: collapseKeys,
      filterData: filterData,
      taskData: taskData,
      projectData: projectData,
      folderName: folderName,
    });
  }

  componentDidMount() {}

  onTablesSelectChange = selectedRowKeys => {
    this.setState({ tablesSelRowKeys: selectedRowKeys });
    console.log('onTablesSelectChange');
    console.log(selectedRowKeys);
  };

  onFilterSelectChange = selectedRowKeys => {
    this.setState({ filterSelRowKeys: selectedRowKeys });
  };

  onTaskSelectChange = selectedRowKeys => {
    this.setState({ taskSelRowKeys: selectedRowKeys });
  };

  onAddFilterTable = () => {
    const selectRow = this.state.tablesData.filter(item =>
      this.state.tablesSelRowKeys.includes(item.name),
    );

    let fieldsValue = dorne_code_gen.appUtils.getProject(this.state.folderName);

    let arr = collect(fieldsValue.filterData);
    for (var index in selectRow) {
      if (!(arr.where('name', selectRow[index].name).all().length > 0)) {
        fieldsValue.filterData.push(selectRow[index]);
      }
    }

    const res = dorne_code_gen.appUtils.saveProject(this.state.folderName, fieldsValue);
    if (res.code === 1) {
      this.setState({
        filterData: fieldsValue.filterData,
      });
      message.success(`${res.msg}`);
    } else {
      message.error(`${res.msg}`);
    }
  };

  onFilterDelSelectRow = (record = null) => {
    const filterSelRowKeys = record ? [record.name] : this.state.filterSelRowKeys;

    const filterData = this.state.filterData.filter(item => !filterSelRowKeys.includes(item.name));

    let fieldsValue = dorne_code_gen.appUtils.getProject(this.state.folderName);
    fieldsValue.filterData = filterData;

    const res = dorne_code_gen.appUtils.saveProject(this.state.folderName, fieldsValue);
    if (res.code === 1) {
      this.setState({
        filterData: fieldsValue.filterData,
      });
      message.success(`${res.msg}`);
    } else {
      message.error(`${res.msg}`);
    }
  };

  onTaskDelSelectRow = (record = null) => {
    const filterSelRowKeys = record ? [record.id] : this.state.taskSelRowKeys;

    const taskData = this.state.taskData.filter(item => !filterSelRowKeys.includes(item.id));

    let fieldsValue = dorne_code_gen.appUtils.getProject(this.state.folderName);
    fieldsValue.taskData = taskData;

    const res = dorne_code_gen.appUtils.saveProject(this.state.folderName, fieldsValue);
    if (res.code === 1) {
      this.setState({
        taskData: fieldsValue.taskData,
      });
      message.success(`${res.msg}`);
    } else {
      message.error(`${res.msg}`);
    }
  };

  filterTableReload = () => {
    let fieldsValue = dorne_code_gen.appUtils.getProject(this.state.folderName);
    this.setState({
      filterData: fieldsValue.filterData,
    });
  };

  taskTableReload = () => {
    let fieldsValue = dorne_code_gen.appUtils.getProject(this.state.folderName);
    this.setState({
      taskData: fieldsValue.taskData,
    });
  };

  oncollapseChange = keys => {
    if (this.state.editMode) {
      let fieldsValue = dorne_code_gen.appUtils.getProject(this.state.folderName);
      fieldsValue.collapseKeys = keys;
      dorne_code_gen.appUtils.saveProject(this.state.folderName, fieldsValue);
      this.setState({
        collapseKeys: keys,
      });
    }
  };

  onFilterClear = () => {
    let fieldsValue = dorne_code_gen.appUtils.getProject(this.state.folderName);
    fieldsValue.filterData = [];

    const res = dorne_code_gen.appUtils.saveProject(this.state.folderName, fieldsValue);
    if (res.code === 1) {
      this.setState({
        filterData: fieldsValue.filterData,
      });
      message.success(`${res.msg}`);
    } else {
      message.error(`${res.msg}`);
    }
  };

  onTaskClear = () => {
    let fieldsValue = dorne_code_gen.appUtils.getProject(this.state.folderName);
    fieldsValue.taskData = [];

    const res = dorne_code_gen.appUtils.saveProject(this.state.folderName, fieldsValue);
    if (res.code === 1) {
      this.setState({
        taskData: fieldsValue.taskData,
      });
      message.success(`${res.msg}`);
    } else {
      message.error(`${res.msg}`);
    }
  };

  render() {
    const btnText = this.state.editMode ? '编辑' : '添加';
    const databaseList = this.state.databaseList;
    console.log('databaseList render');
    console.log(databaseList);
    const disabled = this.state.editMode ? true : false;
    const formData = this.state.projectData ? this.state.projectData : undefined;
    const folderName = this.state.folderName ? this.state.folderName : '';

    const tablesRowSelection = {
      selectedRowKeys: this.state.tablesSelRowKeys,
      onChange: this.onTablesSelectChange,
    };

    const filterRowSelection = {
      selectedRowKeys: this.state.filterSelRowKeys,
      onChange: this.onFilterSelectChange,
    };

    const taskRowSelection = {
      selectedRowKeys: this.state.taskSelRowKeys,
      onChange: this.onTaskSelectChange,
    };

    return (
      <React.Fragment>
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
          initialValues={formData}
        >
          <Collapse onChange={this.oncollapseChange} defaultActiveKey={this.state.collapseKeys}>
            <Panel header="项目基础设置" forceRender={true} key="1">
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
              <Panel header="数据库配置" forceRender={true} key="2">
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
                <Form.Item name="tablePrefix" label="表前缀">
                  <Input />
                </Form.Item>
              </Panel>
            ) : null}
            {this.state.editMode ? (
              <Panel header="表" forceRender={true} key="3">
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    onClick={this.getTables}
                    icon={<SyncOutlined />}
                    loading={this.state.tablesReloadloading}
                  >
                    拉取表
                  </Button>
                  <Button
                    disabled={!(this.state.tablesSelRowKeys.length > 0)}
                    onClick={this.onAddFilterTable}
                  >
                    添加到候选
                  </Button>
                </Space>

                <Table
                  rowKey={record => {
                    return record.name;
                  }}
                  rowSelection={tablesRowSelection}
                  pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                    pageSizeOptions: [10, 20, 50, 100, 200, 500, 1000],
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
            {this.state.editMode ? (
              <Panel header="候选表" forceRender={true} key="4">
                <Space style={{ marginBottom: 16 }}>
                  <Button onClick={this.filterTableReload} icon={<ReloadOutlined />}>
                    刷新
                  </Button>
                  <Popconfirm
                    placement="bottomRight"
                    title={`确认要删除[${this.state.filterSelRowKeys.length}个]候选表吗?`}
                    onConfirm={this.onFilterDelSelectRow.bind(this, null)}
                    okText="删除"
                    cancelText="取消"
                    disabled={!(this.state.filterSelRowKeys.length > 0)}
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={!(this.state.filterSelRowKeys.length > 0)}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    placement="bottomRight"
                    title={`确认要清空候选表吗?`}
                    onConfirm={this.onFilterClear}
                    okText="删除"
                    cancelText="取消"
                  >
                    <Button type="primary" danger icon={<RestOutlined />}>
                      清空
                    </Button>
                  </Popconfirm>
                </Space>

                <Table
                  rowKey={record => {
                    return record.name;
                  }}
                  rowSelection={filterRowSelection}
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
                  columns={this.state.filterColumns}
                  dataSource={this.state.filterData}
                />
              </Panel>
            ) : null}
            {this.state.editMode ? (
              <Panel header="任务" forceRender={true} key="5">
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      this.props.history.push(`/project/edit/${this.state.folderName}/task/add`)
                    }
                  >
                    新建
                  </Button>
                  <Button onClick={this.taskTableReload} icon={<ReloadOutlined />}>
                    刷新
                  </Button>
                  <Popconfirm
                    placement="bottomRight"
                    title={`确认要删除[${this.state.taskSelRowKeys.length}个]任务吗?`}
                    onConfirm={this.onTaskDelSelectRow.bind(this, null)}
                    okText="删除"
                    cancelText="取消"
                    disabled={!(this.state.taskSelRowKeys.length > 0)}
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={!(this.state.taskSelRowKeys.length > 0)}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    placement="bottomRight"
                    title={`确认要清空任务吗?`}
                    onConfirm={this.onTaskClear}
                    okText="删除"
                    cancelText="取消"
                  >
                    <Button type="primary" danger icon={<RestOutlined />}>
                      清空
                    </Button>
                  </Popconfirm>
                  <Button
                    icon={<FieldTimeOutlined />}
                    onClick={this.taskBuild.bind(this, null, null)}
                  >
                    批量生成
                  </Button>
                </Space>

                <Table
                  rowKey={record => {
                    return record.id;
                  }}
                  rowSelection={taskRowSelection}
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
                  columns={this.state.taskColumns}
                  dataSource={this.state.taskData}
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
            loading={this.state.columnsLoading}
            pagination={false}
            bordered
            columns={this.state.columnsColumns}
            dataSource={this.state.columnsData}
          />
        </Drawer>
        <Modal
          title="生成中"
          closable={false}
          className="build-modal"
          visible={this.state.buildVisible}
          okButtonProps={{ style: { display: 'none' } }}
          cancelButtonProps={{ style: { display: 'none' } }}
          onOk={() => {
            this.setState({ buildVisible: false });
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Spin></Spin>
            <p style={{ marginTop: '15px' }}>{this.state.buildMsg}</p>
            <Progress percent={this.state.buildPercent} size="small" />
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default baseComponent(Edit);
