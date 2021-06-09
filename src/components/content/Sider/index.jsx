import React, { PureComponent } from 'react'
import { Layout } from 'antd'
import { withRouter } from "react-router-dom";

import MyNavLink from 'components/common/MyNavLink'

import './index.less'
import VariableImg from 'assets/img/index/variable.png'
import RealTimeImg from 'assets/img/index/real-time.png'
import OperationsImg from 'assets/img/index/operations.png'
import AuthorizationImg from 'assets/img/index/authorization.png'
import VariableActiveImg from 'assets/img/index/variable_active.png'
import RealTimeActiveImg from 'assets/img/index/real-time.png'
import OperationsActiveImg from 'assets/img/index/operations_active.png'
import AuthorizationActiveImg from 'assets/img/index/authorization_active.png'
// import UserImg from 'assets/img/index/user.png'

const { Sider } = Layout;

class PageSider extends PureComponent {
  state = {
    collapsed: false,
    activeRoute: "/variable"
  }

  componentDidMount() {
    this.setState({ activeRoute: this.props.location.pathname })
  }
 
  render() {

    return (
      <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
        <div className="page-sider">
          <MyNavLink to="/variable">
            <img src={ this.state.activeRoute === "/variable" || "/" ? VariableActiveImg : VariableImg} alt="" />
            <span>变量管理</span>
          </MyNavLink>
          <MyNavLink to="/realTime">
            <img src={ this.state.activeRoute === "/realTime" ? RealTimeActiveImg : RealTimeImg} alt="" />
            <span>实时监测</span>
          </MyNavLink>
          <MyNavLink to="/operations">
            <img src={ this.state.activeRoute === "/operations" ? OperationsActiveImg : OperationsImg} alt="" />
            <span>远程运维</span>
          </MyNavLink>
          <MyNavLink to="/authorization">
            <img src={ this.state.activeRoute === "/authorization" ? VariableActiveImg : AuthorizationImg} alt="" />
            <span>授权管理</span>
          </MyNavLink>
          <MyNavLink to="/user">
            <img src={ this.state.activeRoute === "/user" ? AuthorizationActiveImg : AuthorizationImg} alt="" />
            <span>用户管理</span>
          </MyNavLink>
        </div>     
      </Sider>
    )
  }
}

export default withRouter(PageSider)