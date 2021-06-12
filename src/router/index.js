import React, {PureComponent} from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";//引入routerdom
// import asyncComponent from 'utils/asyncComponent'
import PrivateRoute from './PrivateRoute'

import Login from 'pages/Login'//导入的组件
import Index from "@/layouts/BasicLayout";
//按需导入
// const Login = asyncComponent(() => import("pages/Login"))
// const BasicLayout = asyncComponent(()=>import("@/layouts/BasicLayout"))

class Router extends PureComponent {
  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/index" component={Index}/>
            <Redirect to="/login"/>
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}

export default Router;