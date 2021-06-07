import React, { PureComponent } from 'react'
import { Dropdown } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import equLogo from 'assets/img/index/equ.png'
import './index.less'

class PageHeader extends PureComponent {
  state = {
    collapsed: false,
    currentEqu: '定子线',
    userName: '工程师李子龙'
  }

  toggle = () => {

  }

  render() {
    return (
      <div className="pageHeader">
        <div className="logo">
          <img src={this.props.logo} alt="logo" />
          <span className="name">{this.props.name}</span>
        </div>
        <div className="flexContent">
          {/* {this.props.flexChildren} */}
          {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
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
          <div className="logout"></div>
        </div>}
      </div>
    )
  }
}

export default PageHeader