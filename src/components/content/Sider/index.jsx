import React, { PureComponent } from 'react'
import { Layout } from 'antd'

import MyNavLink from 'components/common/MyNavLink'

import './index.less'
import VariableImg from 'assets/img/index/variable.png'
import RealTimeImg from 'assets/img/index/real-time.png'
import OperationsImg from 'assets/img/index/operations.png'
import AuthorizationImg from 'assets/img/index/authorization.png'
// import UserImg from 'assets/img/index/user.png'

const { Sider } = Layout;

export default class PageSider extends PureComponent {
  state = {
    collapsed: false
  }

  render() {
    return (
      <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
        <div className="page-sider">
          <MyNavLink to="/variable">
            <img src={VariableImg} alt="" />
            <span>变量管理</span>
          </MyNavLink>
          <MyNavLink to="/realTime">
            <img src={RealTimeImg} alt="" />
            <span>实时监测</span>
          </MyNavLink>
          <MyNavLink to="/operations">
            <img src={OperationsImg} alt="" />
            <span>远程运维</span>
          </MyNavLink>
          <MyNavLink to="/authorization">
            <img src={AuthorizationImg} alt="" />
            <span>授权管理</span>
          </MyNavLink>
          <MyNavLink to="/user">
            <img src={AuthorizationImg} alt="" />
            <span>用户管理</span>
          </MyNavLink>
        </div>
      </Sider>
    )
  }
}
