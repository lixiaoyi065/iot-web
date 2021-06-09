import React, { PureComponent } from 'react'
import { Dropdown, message } from 'antd'

import Ztree from 'components/common/Ztree'
import DrowDownMenu from 'components/common/DrowDownMenu'
import DataTable from 'components/common/DataTable'

import Search from './components/Search'
import AddEqu from './components/AddEqu'
import AddGroup from './components/AddGroup'

import store from 'store'

import { getEquList, addGroup } from 'api/variable/index'

import './index.less'

const storeState = store.getState()

class Variable extends PureComponent{
  state = {
    zNodes: storeState.zNodes,
    loading: true,
    toogle: false,
    visible: "false",
    isShowGroup: false,
    isShowEqu: false,
  }
  
  componentDidMount() {
    //获取设备列表
    getEquList().then(res => {
      store.dispatch({
        type: "zNodes",
        data: res.data
      });
    });
  }

  menuClick = (e) => {
    this.setState({ visible: "false" })
    console.log(e.key,e.key === "addEqu")
    if (e.key === "addEqu") {
      this.setState({isShowEqu: true})
    } else {
      this.setState({isShowGroup: true})
    }
  }

  onCancel = (type) => {
    this.setState({
      [type]: !this.state[type]
    })
  }
  //提交表单
  onFinish = (values) => {
    //关闭弹窗
    this.setState({isShowGroup: !this.state.isShowGroup})
    // addGroup(values).then(res => {
      
    // })
    console.log('Success:', values);
    message.info('提交成功！');
  }
  onFinishFailed = () => {
    message.error('提交失败！');
  }
  onFinishEqu = (val) => {
    console.log('Success:', val);
    message.info('提交成功！');
  }
  onFinishFailedEqu = () => {
    message.error('提交失败！');
  }
  
  equMenu = (
    <DrowDownMenu lists={[
      {
        key: "addEqu",
        name: "添加设备",
      },
      {
        key: "addGroup",
        name: "添加分组",
      }
    ]}
      visible={this.state.visible}
      onClick={(key) => { this.menuClick(key) }}
    >
    </DrowDownMenu>
  )

  opt = (
    <Dropdown overlay={this.equMenu} trigger={['click']} placement="bottomCenter" arrow>
      <div className="optAdd"></div>
    </Dropdown>
  )
  toggleLeft = () => {
    const toogle = !this.state.toogle
    this.setState({toogle: toogle})
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="antProPageContainer">
        <div className={`leftContent ${this.state.toogle ? 'hideLeft' : null}`}>
          {
            loading ? 
            <Ztree
                title="设备列表"
                opt={this.opt}
                  zNodes={store.getState()}
                  loading = {loading}
                /> : ''
          }
          <span className="arrowLeft" onClick={this.toggleLeft}></span>
        </div>
        <div className="tableList">
          <Search />
          <div className="tableContain">
            <DataTable />
          </div>
        </div>
        
        <AddGroup visible={ this.state.isShowGroup } cancel={()=>{this.onCancel("isShowGroup")}}/>
        <AddEqu visible={this.state.isShowEqu} cancel={()=>{this.onCancel("isShowEqu")}}/>

      </div>
    )
  }
}

export default Variable