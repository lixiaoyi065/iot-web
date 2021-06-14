import React, { PureComponent } from 'react'
import { message } from "antd"

import DrowDownMenu from 'components/common/DrowDownMenu'
import DialogAlert from "components/common/DialogAlert"
import DataTable from 'components/common/DataTable'
import ZTree from './components/ztree'
import AddEqu from './components/AddEqu'
import AddGroup from './components/AddGroup'
import Search from './components/Search'

import { GetTreeStructure, GetDevice, DeleteDevice, DelGroup } from 'api/variable'


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
      onClick={(e) => {
        e.domEvent.stopPropagation();
        this.menuClick(e)
      }}
    />
  )
  //操作设备菜单
  optionDeviceMenu = (el, length)=> {
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
        e.domEvent.stopPropagation();
        this.menuClick(e, el, length)
      }}
    />
    )
  }
  //操作分组菜单
  optionGroupMenu = (el)=> {
    return (
      <DrowDownMenu lists={[
        {
          key: "modifyGroup",
          name: "编辑分组",
        },
        {
          key: "delGroup",
          name: "删除分组",
        }
      ]}
      onClick={(e) => {
        e.domEvent.stopPropagation();
        this.menuClick(e, el)
      }}
      />
    )
  }

  addDeviceForm = (
    <AddEqu key="addDevice"/>
  )
  modifyDeviceForm = (node={})=>{
    return (
      <AddEqu node={ node } key={ node.id }/>
    )
  }
  addGroupForm = (
    <AddGroup key="addGroup"/>
  )
  modifyGroupForm = (node={})=>{
    return (
      <AddGroup node={ node } key={ "-" + node.groupId }/>
    )
  }

  menuClick = (e, id, length) => {
    if (e.key === "addDevice") {
      DialogAlert.open({
        alertTitle: "添加设备",
        alertTip: this.addDeviceForm
      })
    } else if(e.key === "modifyDevice"){
      GetDevice(id).then(res=>{
        DialogAlert.open({
          alertTitle: "编辑设备",
          alertTip: this.modifyDeviceForm(res.data)
        })
      })
    } else if (e.key === "delDevice"){
      if(length > 0){
        DialogAlert.open({
          alertTitle: "提示",
          alertTip: "节点下有分组存在，删除将会跟随分组一起删除，无法恢复，是否继续?",
          confirmCallbackFn(){
            DeleteDevice(id).then(res=>{
              if(res.code === 0){
                message.info("删除成功") 
              }else{
                message.error(res.msg)
              }
            })
          }
        })
      }else{
        DeleteDevice(id).then(res=>{
          if(res.code === 0){
            message.info("删除成功") 
          }else{
            message.error(res.msg)
          }
        })
      }
    }else if(e.key === "addGroup"){
      DialogAlert.open({
        alertTitle: "编辑分组",
        alertTip: this.addGroupForm
      })
    }else if(e.key === "modifyGroup"){
      DialogAlert.open({
        alertTitle: "编辑分组",
        alertTip: this.modifyGroupForm(id)
      })
    }else if(e.key === "delGroup"){
      DelGroup(id.groupId).then(res=>{
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