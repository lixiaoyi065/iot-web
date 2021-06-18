import React, { PureComponent } from 'react'
import { Modal, message } from "antd"

import DrowDownMenu from 'components/common/DrowDownMenu'
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
    selectedRowKeys: [],
    //添加设备
    visible: false,
    title: "",
    modalContent:""
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

  handleCancel = ()=>{
    this.setState({visible: false})
  }
  confirm = (content,callback)=> {
    Modal.confirm({
      title: '注意',
      content: content,
      okText: '确认',
      cancelText: '取消',
      onOk: callback
    });
  }
  menuClick = (e, id, length)=>{
    if (e.key === "addDevice") {
      this.setState({
        visible: true, 
        title: "新增设备", 
        modalContent: <AddEqu key="addDevice" onCancel={this.handleCancel}/>
      })
    } else if(e.key === "modifyDevice"){
      GetDevice(id).then(res=>{
        this.setState({
          visible: true, 
          title: "编辑设备", 
          modalContent: <AddEqu key="modifyDevice" node={ res.data } onCancel={this.handleCancel}/>
        })
      })
    } else if(e.key === "delDevice"){
      if(length > 0){
        this.confirm('节点下有分组存在，删除将会跟随分组一起删除，无法恢复，是否继续?',()=>{
          DeleteDevice(id).then(res=>{
            if(res.code === 0){
              message.info("删除成功") 
            }else{
              message.error(res.msg)
            }
          })
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
      this.setState({
        visible: true, 
        title: "新增分组", 
        modalContent: <AddGroup key="addGroup" onCancel={this.handleCancel}/>
      })
    }else if(e.key === "modifyGroup"){
      this.setState({
        visible: true, 
        title: "编辑分组", 
        modalContent: <AddGroup key="modifyGroup" node={ id } onCancel={this.handleCancel}/>
      })
    } else if (e.key === "delGroup") {
      this.confirm('节点下有变量存在，删除将会跟随变量一起删除，无法恢复，是否继续?',()=>{
        DelGroup(id.groupId).then(res=>{
          if(res.code === 0){
            message.info("删除成功")
          }else{
            message.error(res.msg)
          }
        })
      })
    }
  }
  //点击节点触发函数
  onSelect = (res, info)=>{
    let tags = {
      nodeId: info.node.key,
      type: info.node.nodeType
    }
    InitTags(tags).then(res => {
      let dataList = [];
      if (res.code === 0) {
        res.data.tags.forEach(element => {
          element.key = element.id
          dataList.push(element)
        });
        console.log(dataList, res.data.total, res.data.dataTypes)
        this.setState({
          dataSource: dataList,
          count: res.data.total,
          dataTypes: res.data.dataTypes
        })
      } else {
        message.info(res.msg)
      }
    })
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
                  onSelect={this.onSelect}
                />
                : null
            }
          </div>
          <span className="arrowLeft" onClick={this.toggleLeft}></span>
        </div>
        <div className="tableList">
          <Search dataTypes={this.state.dataTypes}/>
          <div className="tableContain">
            <DataTable
              dataSource={this.state.dataSource}
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
          {/* 新增编辑模态框 */}
          <Modal 
            title={this.state.title}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={null}
            >
            {
              this.state.modalContent
            }
          </Modal>
      </div>
    )
  }
}

export default RealTime