import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.less';
import BasicLayout from './layouts/BasicLayout';

ReactDOM.render(
  <BrowserRouter>
    <BasicLayout />
  </BrowserRouter>,
  document.getElementById('root')
);
