import React, { PureComponent } from 'react'
import { Dropdown } from 'antd'
import { withRouter } from "react-router-dom";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import DrowDownMenu from 'components/common/DrowDownMenu'
import { getCookie } from 'utils'
import PubSub from 'pubsub-js';

import equLogo from 'assets/img/index/equ.png'
import './index.less'

class PageHeader extends PureComponent {
  state = {
    currentEqu: '定子线',
    userName: getCookie("userName"),
    toggleMenu: false
  }

  toggle = () => {
    this.setState(state => {
      PubSub.publish("toggleMenu", !state.toggleMenu)
      return {
        toggleMenu: !state.toggleMenu
      }
    })
  }

  logout = () => {
    this.props.history.push('/')
  }

  menu = (
    <DrowDownMenu lists={[
      {
        name: "重新启动",
        key: "restart",
        onClick() {
          console.log("重新启动")
        }
      }, {
        name: "启动",
        key: "start",
        onClick() {
          console.log("启动")
        }
      }, {
        name: "停止",
        key: "stop",
        onClick() {
          console.log("停止")
        }
      }
    ]} />
  )

  render() {
    return (
      <div className="pageHeader">
        <div className="logo">
          <img src={this.props.logo} alt="logo" />
          <span className="name">{this.props.name}</span>
        </div>
        <div className="flexContent">
          {/* {this.props.flexChildren} */}
          {React.createElement(this.state.toggleMenu ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: this.toggle,
          })}
          <div className="divider"></div>
          <label className="equ-tags">
            <img src={equLogo} className="equ-logo" alt="equ-logo" />
            <span className="equ-name">{this.state.currentEqu}</span>
            {<Dropdown overlay={this.menu} trigger={['click']} placement="bottomCenter" arrow>
              <div className="equ-option"></div>
            </Dropdown>}
          </label>
        </div>
        {<div className="userComp">
          <span className="userName">{this.state.userName}</span>
          <span className="divider"></span>
          <div className="logout" onClick={ this.logout }></div>
        </div>}
      </div>
    )
  }
}

export default withRouter(PageHeader)