import React from 'react';

import { baseComponent } from '../../../components/hof/base';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-jsx';

/*eslint-disable no-alert, no-console */
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';

import { Form, Input, Button, Select } from 'antd';

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
    };
  }

  componentDidMount() {}

  onFinish = values => {
    console.log('this.onFinish');
    console.log(values);
  };

  onCodeLangChange = val => {
    console.log(val);
    this.setState({ codeLang: val });
  };

  onBack = () => {
    this.props.history.push('/project/list');
  };

  render() {
    return (
      <React.Fragment>
        <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
          <Form.Item
            name="memo"
            label="备注"
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
            label="编程语言"
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
            label="代码"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <AceEditor
              placeholder="请编写代码"
              mode={this.state.codeLang}
              value={this.state.code}
              theme="monokai"
              name="app_code_editor"
              onLoad={this.onLoad}
              onChange={this.onChange}
              fontSize={14}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              style={{ width: '100%', height: 300 }}
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
      </React.Fragment>
    );
  }
}

export default baseComponent(Edit);
