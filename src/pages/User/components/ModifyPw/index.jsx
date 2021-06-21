import React, { PureComponent } from 'react'
import { Form, Input, Button, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { ModifyPw } from 'api/user'

export default class ModifyPassWord extends PureComponent{
  state = {
    loading: false
  }

  render() {
    return (
      <Form onFinish={this.props.onFinish}>
        <Form.Item label="新密码" name="userPassword">
          <Input.Password placeholder="请输入新密码"/>
        </Form.Item>
        <Form.Item className="form-footer">
          <Button type="default" className="login-form-button" onClick={this.props.onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" className="login-form-button" ref="submit" disabled={this.state.loading ? true : false}>
            {
              this.state.loading ? <LoadingOutlined /> : <></>
            }
            确认
          </Button>
        </Form.Item>
      </Form>
    )
  }
}