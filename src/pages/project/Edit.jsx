import React from 'react';

import { baseComponent } from '../../components/hof/base';

import { Form, Input, Button, message, Collapse, Select } from 'antd';
const { Panel } = Collapse;
const { Option } = Select;

const btnStyle = {
  marginTop: '8px',
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
      databaseList: dorne_code_gen.appUtils.databaseList(),
    };
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
      <div>
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
                  name="databse"
                  label="数据库"
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
      </div>
    );
  }
}

export default baseComponent(Edit);
