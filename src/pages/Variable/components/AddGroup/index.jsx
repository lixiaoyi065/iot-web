import React, { PureComponent } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'

import store from 'store'

import { addGroup } from 'api/variable/index'

import "./index.less"

const { Option } = Select;
const storeState = store.getState()
class AddGroup extends PureComponent {
  state = {
    euqList: storeState.zNodes,
  }

  componentDidMount() {
    console.log(store.getState())
  }


  onFinish = (val) => {
    // console.log(val)
  }
  onFinishFailed = () => {
    
  }

  
  render() {
    // console.log(this.state.euqList)

    return (
      <Modal width='fit-content' title="添加分组" footer={null} visible={ this.props.visible }>
        <Form
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
            Type: "2"
          }}
        >
          <Form.Item label="所属设备ID" name="DeviceId" hidden>
            <Input value="1"/>
          </Form.Item>
          <Form.Item label="所属设备" name="Type">
            <Select>
              <Option value="2">内部变量</Option>
              <Option value="4">系统变量</Option>
            </Select>
          </Form.Item>
          <Form.Item label="分组名称" name="Name" rules={[
              {
                required: true,
                message: '请输入分组名称!',
              },
            ]}
          >
            <Input placeholder="请输入设备描述"/>
          </Form.Item>
          <Form.Item className="form-footer">
            <Button type="default" className="login-form-button" onClick={ this.props.cancel }>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default AddGroup