import React, { PureComponent } from 'react'
import { message } from "antd"

import DrowDownMenu from 'components/common/DrowDownMenu'
import DialogAlert from "components/common/DialogAlert"
import DataTable from 'components/common/Table'

import ZTree from 'components/common/Ztree'
import AddEqu from './components/AddEqu'
import AddGroup from './components/AddGroup'
import Search from './components/Search'

import { GetTreeStructure, GetDevice, DeleteDevice, DelGroup, InitTags } from 'api/variable'

class RealTime extends PureComponent{
  state = {
    treeData: [],
    dataSource: [],
    dataTypes: [],
    count: 0,
    collasped: false,
    selectedRowKeys: []
  }
  child =  React.createRef()

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
    <AddEqu key="addDevice" ref={ this.child }/>
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
        alertTip: this.addDeviceForm,
        confirmCallbackFn: () => {
          this.child.current.formRef.current.submit()
        }
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
    } else if (e.key === "delGroup") {
      DialogAlert.open({
        alertTitle: "提示",
        alertTip: "节点下有变量存在，删除将会跟随变量一起删除，无法恢复，是否继续?",
        confirmCallbackFn(){
          DelGroup(id.groupId).then(res=>{
            if(res.code === 0){
              message.info("删除成功") 
            }else{
              message.error(res.msg)
            }
          })
        }
      })
    }
  }
  //选中设备列表的回调
  selectCallbackFn = (res, info) => {
    let tags = {
      groupId: info.node.key,
      type: info.node.nodeType
    }
    InitTags(tags).then(res => {
      let dataList = [];
      if (res.code === 0) {
        res.data.tags.forEach(element => {
          element.key = element.id
          dataList.push(element)
        });
        this.setState({
          dataSource: dataList,
          count: res.data.total,
          dataTypes: res.data.dataTypes
        })
      } else {
        this.setState({
          dataSource: [],
          count: 0
        })
      }
    })
  }
  //加载更多
  loadMore = () => {
    
  }
  //数据表格选中的项
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
    // this.setState({selectedRowKeys: [selectedRowKeys, selectedRows.id]})
    console.log(`selectedRowKeys: ${selectedRowKeys}`);
  }

  render() {
    return (
      <div className={`antProPageContainer ${ this.state.collasped ? 'foldToLeft' : "" }`}>
        <div className="leftContent">
          <div className="fullContain">
            {
              this.state.treeData ?
                <ZTree
                  title="设备列表"
                  zTreeOption={{
                    className: "optAdd",
                    placement: "bottomCenter"
                  }}
                  move={true}
                  option={ true }
                  nodeDatas={this.state.treeData}
                  zTreeOptionDropdown={true}
                  zTreeOptionMenu={this.zTreeOptionMenu}
                  optionDeviceMenu={this.optionDeviceMenu}
                  defaultExpandAll={true}
                  defaultExpandedKeys={ ["371dc6de-1264-4e39-999f-83ceacc29322"] }
                  optionGroupMenu={this.optionGroupMenu}
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
            <DataTable
              rowSelection={{
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.onSelectChange,
              }}
              dataSource={this.state.dataSource}
              loadMore={this.loadMore}
              count={this.state.count}
              rowKey={record => {
                console.length(record)
                return record.id
              }}
              columns={[
              {
                title: '变量名',
                dataIndex: 'name',
                  width: '150px',
                ellipsis: true,
              },
              {
                title: '变量描述',
                dataIndex: 'desc',
                width: '200px',
                ellipsis: true,
              },
              {
                title: '数据类型',
                dataIndex: 'dataType',
                width: '200px',
                ellipsis: true,
              },
              {
                title: '变量地址',
                dataIndex: 'address',
                width: '150px',
                ellipsis: true,
              },
              {
                title: '字符长度',
                dataIndex: 'characterLength',
                width: '150px',
                ellipsis: true,
              }
            ] }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default RealTime