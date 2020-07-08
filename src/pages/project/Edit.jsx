import React from 'react';

import { baseComponent } from '../../components/hof/base';

import { Form, Input, Button, message } from 'antd';

const btnStyle = {
  marginRight: '8px',
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
    this.state = {};
  }

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
    this.setState({ editMode: this.props.match.params.folderName ? true : false });
  }

  render() {
    const btnText = this.state.editMode ? '编辑' : '添加';
    return (
      <div>
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
          initialValues={{ sortCode: 0 }}
        >
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
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button style={btnStyle} type="primary" htmlType="submit">
              {btnText}
            </Button>
            <Button style={btnStyle} htmlType="button" onClick={this.onBack}>
              返回
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default baseComponent(Edit);
