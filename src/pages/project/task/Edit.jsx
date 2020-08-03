import React from 'react';

import { baseComponent } from '../../../components/hof/base';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-jsx';

/*eslint-disable no-alert, no-console */
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Tooltip,
  Drawer,
  message,
  Switch,
  Space,
} from 'antd';

import * as sd from 'silly-datetime';

import * as collect from 'collect.js';

import {
  FullscreenOutlined,
  FolderOpenOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import uuid from 'node-uuid';

const languages = [
  'javascript',
  'java',
  'python',
  'xml',
  'ruby',
  'sass',
  'markdown',
  'mysql',
  'json',
  'html',
  'handlebars',
  'golang',
  'csharp',
  'elixir',
  'typescript',
  'css',
  'php',
  'sql',
];

const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal',
];

languages.forEach(lang => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});

themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));

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

  constructor(props) {
    super(props);
    this.state = {
      langList: languages,
      codeLang: 'java',
      drawerVisible: false,
      code: '',
      tabSize: '2',
      codePreview: '',
      columnsCache: null,
      projectDataCache: null,
    };
  }

  componentDidMount() {}

  componentWillMount() {
    const folderName = this.props.match.params.folderName;
    const taskId = this.props.match.params.taskId;
    this.setState({ editMode: taskId ? true : false });

    let formData = {
      id: uuid.v1(),
      folderName: folderName,
      saveName: '{{table.convertName}}',
      isRun: true,
      code: dorne_code_gen.appUtils.defaultTemplate(),
      tabSize: 2,
    };
    if (taskId) {
      const projectData = folderName ? dorne_code_gen.appUtils.getProject(folderName) : {};
      const taskData = projectData.taskData ? projectData.taskData : [];

      const taskDataCollect = collect(taskData);
      formData = taskDataCollect.where('id', taskId).first();
      formData = formData ? formData : {};
      this.setState({ code: formData.code ? formData.code : '' });
      this.setState({ tabSize: formData.tabSize ? formData.tabSize : '' });
    }

    this.setState({
      formData: formData,
      folderName: folderName,
    });
  }

  onFinish = values => {
    /*global dorne_code_gen*/
    /*eslint no-undef: "error"*/
    const obj = dorne_code_gen.appUtils.getProject(this.props.match.params.folderName);

    const taskDataCollect = collect(obj.taskData);
    console.log('---------````````values');
    console.log(values);

    const id = values.id;
    const data = values;
    data.createTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    data.updateTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

    if (taskDataCollect.where('id', id).all().length > 0) {
      taskDataCollect.map(item => {
        if (item.id === id) {
          delete data['folderName'];
          delete data['id'];
          delete data['createTime'];
          return Object.assign(item, data);
        }
        return item;
      });
      console.log('---------edit');
      obj.taskData = taskDataCollect.all();
    } else {
      console.log('---------add');
      delete data['folderName'];
      obj.taskData.push(data);
    }

    const res = dorne_code_gen.appUtils.saveProject(this.props.match.params.folderName, obj);
    if (res.code === 1) {
      message.success(`${res.msg}`);
      const list = this.props.globalProps.breadcrumb;
      this.props.history.push(list[list.length - 2].routeMateData.match);
    } else {
      message.error(`${res.msg}`);
    }
  };

  onCodeLangChange = val => {
    console.log(val);
    this.setState({ codeLang: val });
  };

  tabSizeChange = e => {
    this.setState({ tabSize: e.target.value });
  };

  onBack = () => {
    const list = this.props.globalProps.breadcrumb;
    this.props.history.push(list[list.length - 2].routeMateData.match);
  };

  drawerClose = () => {
    this.setState({
      drawerVisible: false,
      columnsCache: null,
      projectDataCache: null,
    });
  };

  drawerOpen = () => {
    this.setState({
      drawerVisible: true,
    });
    this.refs.reactAceComponent.editor.focus();
    this.onDrawerAceEditorChange(this.formRef.current.getFieldValue('code'));
  };

  drawerAceEditorFixHeight = () => {
    this.refs.reactAceComponent.editor.resize();
    this.refs.reactAcePreviewComponent.editor.resize();
  };

  onAceEditorChange = v => {
    this.setState({
      code: v,
    });
  };

  onDrawerAceEditorChange = async v => {
    this.setState({
      code: v,
    });
    this.formRef.current.setFieldsValue({
      code: v,
    });

    const folderName = this.props.match.params.folderName;

    let projectData = this.state.projectDataCache;
    if (!this.state.projectDataCache) {
      projectData = folderName ? dorne_code_gen.appUtils.getProject(folderName) : {};
    }

    const filterData = projectData.filterData ? projectData.filterData : [];
    const tablePrefix = projectData.tablePrefix;

    const db = dorne_code_gen.appUtils.databaseAddon(projectData.database);

    if (!filterData || filterData.length < 1) {
      this.setState({
        codePreview: '请配置候选表',
      });
    } else {
      let table = filterData[0];
      table.convertName = table.name;
      if (tablePrefix && table.name.startsWith(tablePrefix)) {
        table.convertName = table.name.substr(tablePrefix.length, table.name.length);
      }

      let columns = [];
      let _retainCode = {};
      try {
        columns = this.state.columnsCache;
        if (!this.state.columnsCache) {
          columns = await db.getColumns(projectData.uri, table.name);
        }

        const saveName = dorne_code_gen.appUtils.artTemplate().render(this.formRef.current.getFieldValue('saveName'), {
          table: table,
          columns: columns,
        });
        const path = dorne_code_gen.path.join(this.formRef.current.getFieldValue('savePath'), `/${saveName}`);
        if (dorne_code_gen.fs.existsSync(path)) {
          //找到已经生成过的文件
          const retainCode = this.formRef.current.getFieldValue('retainCode');
          retainCode.forEach(function(element) {
            let b = element.begin;
            let e = element.end;

            var matchReg = new RegExp( `(?<=${b})[\\s\\S]*?(?=${e})`, "g");

            let oldCode = dorne_code_gen.appUtils.readFile(path);
            const _txt = oldCode.match(matchReg);
            //获取要保留的代码

            _retainCode[element.var] = (_txt && _txt.length > 0 ? _txt[0] : '').replace(/(^\s*)/g, "").replace(/(\s*$)/g, "");
          });
        }

        const text = dorne_code_gen.appUtils.artTemplate().render(v, {
          table: table,
          columns: columns,
          retainCode: _retainCode
        });

        this.setState({
          codePreview: text,
          columnsCache: columns,
          projectDataCache: projectData,
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  browserFolder = () => {
    dorne_code_gen.dialog
      .showOpenDialog({
        properties: ['openDirectory'],
      })
      .then(data => {
        if (data.filePaths.length > 0)
          this.formRef.current.setFieldsValue({
            savePath: data.filePaths[0],
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const formData = this.state.formData;
    return (
      <React.Fragment>
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
          initialValues={formData}
        >
          <Form.Item style={{ display: 'none' }} name="folderName" label="项目文件">
            <Input />
          </Form.Item>
          <Form.Item style={{ display: 'none' }} name="id" label="id">
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="任务名"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isRun"
            label="是否启用"
            rules={[
              {
                required: true,
              },
            ]}
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="关闭" />
          </Form.Item>
          <Form.Item
            name="tabSize"
            label="tab字符长度"
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
            <Input onChange={this.tabSizeChange} />
          </Form.Item>
          <Form.Item
            name="codeLang"
            label="代码格式"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="请选择编程语言" onChange={this.onCodeLangChange} allowClear>
              {this.state.langList.map(data => {
                return (
                  <Option key={data} value={data}>
                    {data}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="代码保护"
          >
            <Form.List name="retainCode">
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map(field => (
                      <Space
                        key={field.key}
                        style={{ display: 'flex', marginBottom: 0}}
                        align="start"
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, 'begin']}
                          fieldKey={[field.fieldKey, 'begin']}
                          rules={[{ required: true, message: 'Missing begin' }]}
                        >
                          <Input placeholder="begin code" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'end']}
                          fieldKey={[field.fieldKey, 'end']}
                          rules={[{ required: true, message: 'Missing end' }]}
                        >
                          <Input placeholder="end code" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'var']}
                          fieldKey={[field.fieldKey, 'var']}
                          rules={[{ required: true, message: 'Missing var' }]}
                        >
                          <Input placeholder="var code" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'memo']}
                          fieldKey={[field.fieldKey, 'memo']}
                          rules={[{ required: true, message: 'Missing memo' }]}
                        >
                          <Input placeholder="memo text" />
                        </Form.Item>

                        <MinusCircleOutlined
                          style={{marginTop:10}}
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      </Space>
                    ))}

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        block
                      >
                        <PlusOutlined /> Add field
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
          </Form.Item>

          <Form.Item
            name="savePath"
            label="模版生成路径"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              addonAfter={
                <>
                  <Button
                    icon={<FolderOpenOutlined />}
                    size="small"
                    onClick={this.browserFolder}
                  ></Button>
                </>
              }
            />
          </Form.Item>
          <Form.Item
            name="saveName"
            label="生成文件名"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label={
              <React.Fragment>
                代码
                <Tooltip title="全屏">
                  <FullscreenOutlined style={{ color: '##ff4d4f' }} onClick={this.drawerOpen} />
                </Tooltip>
              </React.Fragment>
            }
            rules={[
              {
                required: true,
                message: '请输入代码',
              },
            ]}
          >
            <AceEditor
              placeholder="请编写代码"
              mode={this.state.codeLang}
              value={this.state.code}
              theme="monokai"
              name="from_code_editor"
              onChange={this.onAceEditorChange}
              fontSize={14}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              style={{ width: '100%', height: 600 }}
              tabSize={parseInt(this.state.tabSize)}
              useSoftTabs={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
              }}
            />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button style={btnStyle} type="primary" htmlType="submit">
              提交
            </Button>
            <Button style={btnStyle} htmlType="button" onClick={this.onBack}>
              返回
            </Button>
          </Form.Item>
        </Form>
        <Drawer
          title="代码编辑"
          width={'100%'}
          height={'100%'}
          closable={true}
          forceRender={true}
          placement="top"
          visible={this.state.drawerVisible}
          onClose={this.drawerClose}
        >
          <>
            <Row>
              <Col span={12} className="code-edit-col">
                <AceEditor
                  placeholder="请编写代码"
                  mode={this.state.codeLang}
                  value={this.state.code}
                  theme="monokai"
                  name="drawer_code_editor"
                  onChange={this.onDrawerAceEditorChange}
                  onBlur={this.drawerAceEditorFixHeight}
                  onFocus={this.drawerAceEditorFixHeight}
                  fontSize={14}
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  style={{ width: '100%', height: '100%' }}
                  ref="reactAceComponent"
                  tabSize={parseInt(this.state.tabSize)}
                  useSoftTabs={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                  }}
                />
              </Col>
              <Col span={12} className="code-edit-col">
                <AceEditor
                  placeholder="请编写代码"
                  mode={this.state.codeLang}
                  value={this.state.codePreview}
                  theme="monokai"
                  name="drawer_code_preview"
                  onBlur={this.drawerAceEditorFixHeight}
                  onFocus={this.drawerAceEditorFixHeight}
                  fontSize={14}
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  style={{ width: '100%', height: '100%' }}
                  ref="reactAcePreviewComponent"
                  tabSize={parseInt(this.state.tabSize)}
                  useSoftTabs={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                  }}
                />
              </Col>
            </Row>
          </>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default baseComponent(Edit);
