import React, { PureComponent } from 'react'

import DrowDownMenu from 'components/common/DrowDownMenu'
import DialogAlert from "components/common/DialogAlert"
import ZTree from './components/ztree'
import AddEqu from './components/AddEqu'

import { GetTreeStructure } from 'api/variable'

import './index.less'

class RealTime extends PureComponent{
  state = {
    treeData: []
  }

  componentDidMount() {
    //获取整棵设备列表树结构
    GetTreeStructure().then(res => {
      this.setState({treeData: res.data})
    })
  }

  //设备树操作菜单
  zTreeOptionMenu = (
    <DrowDownMenu lists={[
        {
          key: "addDevice",
          name: "添加设备",
        },
        {
          key: "addGroup",
          name: "添加分组",
        }
      ]}
      // visible={this.state.visible}
      onClick={(e) => {
        e.domEvent.stopPropagation();
        this.menuClick(e)
      }}
    />
  )
  //操作设备菜单
  optionDeviceMenu = (
    <DrowDownMenu lists={[
      {
        key: "addEqu1",
        name: "添加设备",
      },
      {
        key: "addGroup1",
        name: "添加分组",
      }
    ]}
    // visible={this.state.visible}
      onClick={(e) => {
        e.domEvent.stopPropagation();
        this.menuClick(e)
      }}
  />
  )
  //操作分组菜单
  optionGroupMenu = (
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
    // visible={this.state.visible}
      onClick={(e) => {
        console.log(e)
      }}
    />
  )

  addDeviceForm = (
    <AddEqu></AddEqu>
  )

  menuClick = (e) => {
    if (e.key === "addDevice") {
      console.log("addDevice")
      DialogAlert.open({
        alertTitle: "添加设备",
        alertTip: this.addDeviceForm
      })
    } else{
      
    }
  }
  //选中设备下的分组回调
  selectCallbackFn = () => {
    console.log("选中回调")
  }
  //点击节点的操作按钮
  operationNode = (type) => {
    console.log(type)
    //设备
    if (type === 3) {
      
    } else {
      //分组

    }
  }

  render() {
    return (
      <div className="antProPageContainer">
        <div className="leftContent">
          {
            this.state.treeData ?
              <ZTree
                title="设备列表"
                zTreeOption={{
                  className: "optAdd",
                  placement: "bottomCenter"
                }}
                zTreeOptionMenu={this.zTreeOptionMenu}
                optionDeviceMenu={this.optionDeviceMenu}
                optionGroupMenu={this.optionGroupMenu}
                nodeDatas={this.state.treeData}
                selectCallbackFn={this.selectCallbackFn}
                operationNode={this.operationNode}
              />
              : null
          }
          <span className="arrowLeft" onClick={this.toggleLeft}></span>
        </div>
      </div>
    )
  }
}

export default RealTime