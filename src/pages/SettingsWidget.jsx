import React from 'react';

import { baseComponent } from '../components/hof/base';

import { Button, Drawer, Form, Switch, Select } from 'antd';

import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
  // layout: 'vertical',
  ayout: 'horizontal',
};

class SettingsWidget extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  selectChange = e => {
    dorne_code_gen.appUtils.switchTheme(`theme/${e}.css`, 'antd-theme');
  }

  onDevToolsChange = e => {
    /*global dorne_code_gen*/
    /*eslint no-undef: "error"*/
    const electron = dorne_code_gen.electron;
    const remote = electron.remote;
    const webContents = remote.getCurrentWindow().webContents;
    e ? webContents.openDevTools() : webContents.closeDevTools();
  };

  componentDidMount() {
    console.log('Demo componentDidMount');
    console.log(this.props);
    console.log('Demo end componentDidMount');
    this.setState({ visible: false });
  }

  render() {
    const formData = undefined;
    return (
      <React.Fragment>
        <div className="fixed-widgets" style={{ right: '0px', top: '118px' }}>
          <Button
            onClick={() => {
              this.setState({
                visible: true,
              });
            }}
            size="large"
            icon={<SettingOutlined />}
          />
        </div>
        <Drawer
          title="设置"
          placement="right"
          closable={true}
          onClose={() => {
            this.setState({
              visible: false,
            });
          }}
          visible={this.state.visible}
          width={300}
        >
          <Form
            {...layout}
            ref={this.formRef}
            name="control-ref"
            onFinish={this.onFinish}
            initialValues={formData}
          >
            <Form.Item name="showDevTools" label="调试器" valuePropName="checked">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={this.onDevToolsChange}
              />
            </Form.Item>
            <Form.Item name="theme" label="主题"  defaultValue="default">
              <Select style={{ width: 120 }} onChange={this.selectChange}>
                <Option value="default">默认</Option>
                <Option value="dark">暗黑</Option>
              </Select>
            </Form.Item>
          </Form>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default baseComponent(SettingsWidget);
