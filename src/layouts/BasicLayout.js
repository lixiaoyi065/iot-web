import React, { PureComponent } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import { Layout } from 'antd';

import Header from "./HeaderLayout"
import PageSider from "components/content/Sider";

import Variable from 'pages/Variable'
import RealTime from 'pages/RealTime'
import Operations from 'pages/Operations'
import Authorization from 'pages/Authorization'

const { Content } = Layout;

class BasicLayout extends PureComponent {

  render() {
    return (
      <Layout className="full-page">
        <Header/>
        <Layout className="site-layout">
          <PageSider/>
          <Content className="site-layout-background">
            <Switch>
              <Route path="/variable" component={Variable}/>
              <Route path="/realTime" component={RealTime}/>
              <Route path="/operations" component={Operations}/>
              <Route path="/authorization" component={Authorization}/>
              {/* <Route path="/realtime" component={RealTime}/> */}
              <Redirect to="/variable"/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
