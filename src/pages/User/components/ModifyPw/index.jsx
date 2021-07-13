import React, { PureComponent } from 'react'
import { Form, Input, Button } from 'antd'
import { debounce } from "lodash"

export default class ModifyPassWord extends PureComponent{
 
  render() {
    return (
      <Form onFinish={debounce(this.props.onFinish,500)}>
        <Form.Item label="新密码" name="userPassword">
          <Input.Password placeholder="请输入新密码"/>
        </Form.Item>
        <Form.Item className="form-footer">
          <Button type="default" className="login-form-button" onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" className="login-form-button" ref="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    )
  }
}