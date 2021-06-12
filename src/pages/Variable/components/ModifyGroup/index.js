import React, { PureComponent } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'

import store from 'store'

import { addGroup } from 'api/variable/index'

import "./index.less"

class AddGroup extends PureComponent {

  componentDidMount() {
    console.log(this.props.node)
    store.subscribe(() => {
      this.setState({ euqList: store.getState() })
    })

  }

  onFinish = (val) => {
    console.log(this.props.node)
    if (this.props.node) {

    } else {
      addGroup(val).then(res => {
        console.log(res)
      })
    }
  }
  onFinishFailed = () => {
  }

  render() {
    return (
      <Modal width='fit-content' title="添加分组" footer={null} visible={this.props.visible}>
        <Form
          ref={this.formRef}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
          }}
        >
          <Form.Item label="设备类型" name="type" hidden initialValue={this.state.type}>
            <Input />
          </Form.Item>
          <Form.Item label="分组名称" name="name" rules={[
            {
              required: true,
              message: '请输入分组名称!',
            },
          ]}
          >
            <Input placeholder="请输入分组名称" />
          </Form.Item>
          <Form.Item className="form-footer">
            <Button type="default" className="login-form-button" onClick={this.props.cancel}>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default AddGroup