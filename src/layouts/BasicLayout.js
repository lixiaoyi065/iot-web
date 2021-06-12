import React, { PureComponent } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import { Layout } from 'antd';

import store from 'store'

import Header from "./HeaderLayout"
import PageSider from "components/content/Sider";

import Variable from 'pages/Variable'
import RealTime from 'pages/RealTime'
import Operations from 'pages/Operations'
import Authorization from 'pages/Authorization'

import './index.less'

const { Content } = Layout;

class BasicLayout extends PureComponent {
  componentDidMount() {
    store.subscribe(() => {
      // this.setState({equLength: store.getState().length})
    })
  }

  state = {
    collapsed: false
  }

  render() {
    return (
      <Layout className="full-page">
        <Header collapsed={this.state.collapsed}/>
        <Layout className="site-layout">
          <PageSider collapsed={ this.state.collapsed }/>
          <Content className="site-layout-background">
            <Switch>
              <Route path="/index/variable" component={Variable}/>
              <Route path="/index/realTime" component={RealTime}/>
              <Route path="/index/operations" component={Operations}/>
              <Route path="/index/authorization" component={Authorization}/>
              {/* <Route path="/realtime" component={RealTime}/> */}
              <Redirect to="/index/variable"/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
