import React, { PureComponent } from 'react'
import { message } from "antd"

import DrowDownMenu from 'components/common/DrowDownMenu'
import DialogAlert from "components/common/DialogAlert"
import DataTable from 'components/common/DataTable'
import ZTree from './components/ztree'
import AddEqu from './components/AddEqu'
import Search from './components/Search'

import { GetTreeStructure, GetDevice, DeleteDevice, ModifyGroup, DelGroup } from 'api/variable'

class RealTime extends PureComponent{
  state = {
    treeData: [],
    collasped: false
  }

  componentDidMount() {
    //获取整棵设备列表树结构
    GetTreeStructure().then(res => {
      console.log(res.data)
      this.setState({treeData: res.data})
    })
  }
  //收缩设备列表
  toggleLeft = ()=>{
    const collapsed = !this.state.collasped
    this.setState({collasped: collapsed})
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
  optionDeviceMenu = (el)=> {
    console.log(el);
    return (
      <DrowDownMenu lists={[
        {
          key: "startDevice",
          name: "启用",
        },
        {
          key: "stopDevice",
          name: "停止",
        },
        {
          key: "modifyDevice",
          name: "编辑设备",
        },
        {
          key: "delDevice",
          name: "删除设备",
        }
      ]}
      onClick={(e) => {
        this.menuClick(e, el)
      }}
    />
    )
  }
  //操作分组菜单
  optionGroupMenu = (el)=> {
    console.log(el);
    return (
      <DrowDownMenu lists={[
        {
          key: "delGroup",
          name: "编辑分组",
        },
        {
          key: "modifyGroup",
          name: "删除分组",
        }
      ]}
        onClick={(e, el) => {
          console.log(e)
        }}
      />
    )
  }

  addDeviceForm = (
    <AddEqu key="addDevice"/>
  )
  modifyDeviceForm = (node={})=>{
    return (
      <AddEqu node={ node } key="modifyDevice"/>
    )
  }

  menuClick = (e, id) => {
    if (e.key === "addDevice") {
      DialogAlert.open({
        alertTitle: "添加设备",
        alertTip: this.addDeviceForm
      })
    } else if(e.key === "modifyDevice"){
      GetDevice(id).then(res=>{
        console.log("-------------------",res.data)
        DialogAlert.open({
          alertTitle: "编辑设备",
          alertTip: this.modifyDeviceForm(res.data)
        })
      })
    } else if (e.key === "delDevice"){
      DeleteDevice(id).then(res=>{
        console.log(res)
        if(res.code === 0){
          message.info("删除成功") 
        }else{
          message.error(res.msg)
        }
      })
    }else if(e.key === "modifyGroup"){
      DialogAlert.open({
        alertTitle: "编辑设备",
        alertTip: this.modifyDeviceForm(res.data)
      })
    }else if(e.key === "delGroup"){
      DelGroup(el).then(res=>{
        console.log(res)
        if(res.code === 0){
          message.info("删除成功") 
        }else{
          message.error(res.msg)
        }
      })
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
        <div className={ `leftContent ${ this.state.collasped ? 'foldToLeft' : null }` }>
          <div className="fullContain">
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
          </div>
          <span className="arrowLeft" onClick={this.toggleLeft}></span>
        </div>
        <div className="tableList">
          <Search />
          <div className="tableContain">
            <DataTable />
          </div>
        </div>
      </div>
    )
  }
}

export default RealTime