import React, { Component } from 'react'
import { Input } from "antd"
import "./index.less"

import user from 'assets/img/login/user.png'
import password from 'assets/img/login/password.png'

export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <div className="login-pane">
          <form className="card">
            <div className="card-head">盛云圈IOT平台</div>
            <div className="card-item">
              <img src={user} className="input-icon"/>
              <Input className="card-input" name="user" placeholder="请输入用户名称"/>
            </div>
            <div className="card-item">
              <img src={password} className="input-icon"/>
              <Input.Password className="card-input" name="password" placeholder="请输入登录密码"/>
            </div>
            <div className="card-item">
              <span className="item-tip">忘记密码</span>
            </div>
            <div className="card-item">
              <button className="login-form-button">登录</button>
            </div>
            <div>
              <span></span>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
