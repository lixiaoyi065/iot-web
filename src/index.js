import React from 'react';
import ReactDOM from 'react-dom';
// import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom';

// import store from 'store'

import './index.less';
import BasicLayout from './layouts/BasicLayout';


ReactDOM.render(
  // <ConfigProvider store={store}>
    <BrowserRouter>
      <BasicLayout />
    </BrowserRouter>
  // </ConfigProvider >
  , document.getElementById('root'))

// store.subscribe(()=>{
//   ReactDOM.render(
//     <ConfigProvider store={store}>
//       <BrowserRouter>
//         <BasicLayout />
//       </BrowserRouter>
//     </ConfigProvider>,document.getElementById('root'))
// })