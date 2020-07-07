import React from 'react';

import { baseComponent } from '../../components/hof/base';

import { Form, Input, Button } from 'antd';

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
    this.state = {

    };
  }

  onFinish = values => {
    /*global dorne_code_gen*/
    /*eslint no-undef: "error"*/
    dorne_code_gen.appUtils.addProject(values);
  };

  onBack = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    
  }

  render() {
    const btnText = this.props.match.params.folderName ? '编辑' : '添加';
    return (
      <div>
        <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
          <Form.Item
            name="sortCode"
            label="排序"
            rules={[
              {
                required: true,
              },
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
              后退
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default baseComponent(Edit);
