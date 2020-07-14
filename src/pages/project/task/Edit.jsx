import React from 'react';

import { baseComponent } from '../../../components/hof/base';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-jsx';

/*eslint-disable no-alert, no-console */
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';

import { Form, Input, Button, Select, Tooltip, Drawer, message } from 'antd';

import * as sd from 'silly-datetime';

import * as collect from 'collect.js';

import { FullscreenOutlined } from '@ant-design/icons';

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
    offset: 10,
    span: 14,
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
    };
  }

  componentDidMount() {}

  componentWillMount() {
    const folderName = this.props.match.params.folderName;
    const taskId = this.props.match.params.taskId;
    this.setState({ editMode: taskId ? true : false });

    let formData = {
      id: new Date().getTime() + '',
      folderName: folderName,
    };
    if (taskId) {
      const projectData = folderName ? dorne_code_gen.appUtils.getProject(folderName) : {};
      const taskData = projectData.taskData ? projectData.taskData : [];

      const taskDataCollect = collect(taskData);
      formData = taskDataCollect.where('id', taskId).first();
      formData = formData ? formData : {};
      this.setState({ code: formData.code ? formData.code : '' });
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

  onBack = () => {
    const list = this.props.globalProps.breadcrumb;
    this.props.history.push(list[list.length - 2].routeMateData.match);
  };

  drawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
    this.refs.reactAceComponent.editor.resize();
  };

  drawerOpen = () => {
    this.setState({
      drawerVisible: true,
    });
    this.refs.reactAceComponent.editor.resize();
  };

  drawerAceEditorFixHeight = () => {
    this.refs.reactAceComponent.editor.resize();
  };

  onAceEditorChange = v => {
    this.setState({
      code: v,
    });
  };

  onDrawerAceEditorChange = v => {
    this.formRef.current.setFieldsValue({
      code: v,
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
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
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
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </Drawer>
      </React.Fragment>
    );
  }
}

export default baseComponent(Edit);
