import React, { PureComponent } from 'react'

import ZTree from './components/ztree'

import './index.less'

class RealTime extends PureComponent{
  render() {
    return (
      <div className="antProPageContainer">
        <div className="leftContent">
          <ZTree />
        </div>
      </div>
    )
  }
}

export default RealTime