import React, { Component } from 'react'
import { Form, Input, Popconfirm, Button, message } from "antd"
import { withRouter } from "react-router-dom";
import axios from 'utils/request'
import "./index.less"

import user from 'assets/img/login/user.png'
import password from 'assets/img/login/password.png'

class Login extends Component {
  state = {
    isLogin: document.cookie.includes('login=true')
  }

  setCookie = (key, value, day) => {
    let expires = day * 86400 * 1000  // 时间转化成 ms
    let date = new Date( + new Date() + expires) // 当前时间加上要存储的时间
    document.cookie = `${key}=${value};expires=${date.toUTCString()}`
  }
  jumpBack = () => {
    // 打哪儿来回哪去
    const { location } = this.props
    const from = location.state && location.state.from
    console.log(from)
    //  const article = location.state && location.state.article
    this.props.history.push({
      pathname: from || "/index",
      state: {
          // article
      }
    })
  }
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
        // this.props.history.replace("/index")

        
        let login = !this.state.isLogin
        this.setState({
            isLogin: login
        })
        if(login){
            // 设置cookie之后跳转回来时的页面
            this.setCookie('login', true, 15)
            this.jumpBack()
        } else {
            // 设置时间为负数, 取消设置的 cookie
            this.setCookie('login', '', -1)
        }

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