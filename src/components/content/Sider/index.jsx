import React, { PureComponent } from 'react'
import { Layout } from 'antd'
import { withRouter } from "react-router-dom";

import store from 'store'
import {getCookie} from 'utils'

import MyNavLink from 'components/common/MyNavLink'

import './index.less'
import VariableImg from 'assets/img/index/variable.png'
import VariableActiveImg from 'assets/img/index/variable_active.png'
import RealTimeImg from 'assets/img/index/real-time.png'
import RealTimeActiveImg from 'assets/img/index/real-time_active.png'
import OperationsImg from 'assets/img/index/operations.png'
import OperationsActiveImg from 'assets/img/index/operations_active.png'
import AuthorizationImg from 'assets/img/index/authorization.png'
import AuthorizationActiveImg from 'assets/img/index/authorization_active.png'
import UserImg from 'assets/img/index/account.png'
import UserActiveImg from 'assets/img/index/account_active.png'

const { Sider } = Layout;

class PageSider extends PureComponent {
  state = {
    collapsed: store.getState()
  }

  componentDidMount() {
    console.log(store.getState())
    this.setState({ collapsed: store.getState().collapsed })
  }

  render() {
    return (
      <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
        <div className="page-sider">
          <MyNavLink to="/index/variable">
            <img className="activeImg" src={VariableActiveImg} alt="" />
            <img className="normalImg" src={VariableImg} alt="" />
            <span>变量管理</span>
          </MyNavLink>
          <MyNavLink to="/index/realTime">
            <img className="activeImg" src={RealTimeActiveImg} alt="" />
            <img className="normalImg" src={RealTimeImg} alt="" />
            <span>实时监测</span>
          </MyNavLink>
          <MyNavLink to="/index/operations">
            <img className="activeImg" src={OperationsActiveImg} alt="" />
            <img className="normalImg" src={OperationsImg} alt="" />
            <span>远程运维</span>
          </MyNavLink>
          <MyNavLink to="/index/authorization">
            <img className="activeImg" src={AuthorizationActiveImg} alt="" />
            <img className="normalImg" src={AuthorizationImg} alt="" />
            <span>授权管理</span>
          </MyNavLink>
          {
            getCookie("userName") === "SuperAdmin" ?
              <MyNavLink to="/index/user">
                <img className="activeImg" src={UserActiveImg} alt="" />
                <img className="normalImg" src={UserImg} alt="" />
                <span>用户管理</span>
              </MyNavLink> : <></>
          }
        </div>
      </Sider>
    )
  }
}

export default withRouter(PageSider)