import React, { Component } from 'react'
import { Form, Input, Popconfirm, Button, message } from "antd"
import { withRouter } from "react-router-dom";
import axios from 'utils/request'
import "./index.less"

import user from 'assets/img/login/user.png'
import password from 'assets/img/login/password.png'

class Login extends Component {
  text = (<div>
    <ul>
      <li><b>普通用户</b><span>请联系超级管理员重置密码</span></li>
      <li><b>超级管理员</b><span>请联系盛原成科技有限公司获取密码</span></li>
    </ul>
  </div>)

  onFinish = (e) => {
    axios.get(`/Login/Login?argUserAccount=${e.user}&argUserPassword=${e.password}`).then(res => {
      console.log(res)
      if (res.code === 0) {
        localStorage.setItem("accessToken", res.data)
        localStorage.setItem("userName", e.user)
        console.log(localStorage.getItem("userName"))
        this.props.history.replace("/index")
      } else {
        message.error(res.msg)
      }
    })
  }

  render() {
    return (
      <div className="login">
        <div className="login-pane">
          <Form className="card" onFinish={this.onFinish} initialValues={
            {
              user: "SuperAdmin",
              password: "SYC888888"
            }
          }>
            <div className="card-head">盛云圈IOT平台</div>
            <Form.Item name="user" className="card-item" rules={[{
              required: true,
              message: "请输入用户名称"
            }]}>
              <div>
                <img src={user} className="input-icon" alt=""/>
                <Input className="card-input" placeholder="请输入用户名称"/>
              </div>
            </Form.Item>
            <Form.Item name="password" className="card-item" rules={[{
              required: true,
              message: "请输入登录密码"
            }]}>
              <div>
                <img src={password} className="input-icon" alt=""/>
                <Input.Password className="card-input" placeholder="请输入登录密码"/>
              </div>
            </Form.Item>
            <div className="card-item">
              <Popconfirm placement="rightTop" title={this.text} icon={false} cancelText="确定" okType="hidden" cancelType="primary">
                <span className="item-tip">忘记密码</span>
              </Popconfirm>
            </div>
            <div className="card-item">
              <Button className="login-form-button" htmlType="submit">登录</Button>
            </div>
            <div>
              <span></span>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
export default withRouter(Login)