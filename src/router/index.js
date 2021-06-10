import React, {PureComponent} from 'react';
import {BrowserRouter,Switch,Route,Redirect} from "react-router-dom";//引入routerdom

import Login from 'pages/Login'//导入的组件
import BasicLayout from "@/layouts/BasicLayout";

class Router extends PureComponent {
    render() {
      return (
          <>
            <BrowserRouter>
              <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/index" component={BasicLayout}/>
                <Redirect to="/login"/>
              </Switch>
            </BrowserRouter>
          </>
        );
    }
}

export default Router;