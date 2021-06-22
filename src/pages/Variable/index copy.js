import React, { PureComponent } from 'react'
import { Modal, message,Input } from "antd"

import DrowDownMenu from 'components/common/DrowDownMenu'
import ZTree from 'components/common/Ztree'
import EditableTable from 'components/common/EditDataTable/index.jsx'

import AddEqu from './components/AddEqu'
import AddGroupPane from './components/AddGroup'
import Search from './components/Search'

import { downFile } from "utils";

import {
  AddDevice, ModifyDevice, AddGroup, ModifyGroup,
  GetTreeStructure, GetDevice, DeleteDevice, DelGroup, 
  InitTags, QueryTags, ExportTags
} from 'api/variable'

class RealTime extends PureComponent{
  state = {
    treeData: [],//设备树数据
    dataSource: [], //表格的变量列表数据
    dataTypes: [], //查询的数据类型
    count: 0,
    collasped: false,
    selectedRowKeys: [],
    //添加设备
    visible: false, //弹窗显示隐藏
    title: "",//弹窗标题
    modalContent: "",//弹窗内容
    activeNode: "", //当前显示变量列表的节点
    activeNodeType: 0, //当前显示变量列表的节点类型
    tableDataTypes: ["二进制变量", "有符号8位整型", "无符号8位整型", "有符号16位整型", "无符号16位整型", "有符号32位整型", "无符号32位整型",
      "有符号64位整型", "无符号64位整型", "F32位浮点数IEEE754","F64位浮点数IEEE754", "日期","时间", "日期时间","字符串"],
  }

  componentDidMount() {
    this.getTreeStructure();
  }

  //获取整棵设备列表树结构
  getTreeStructure = () => {
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

  //添加设备提交函数
  onAddDeviceFinish = val => {
    this.setState({ loading: true })
    const list = ["id", "name", "desc", "nodeType", "protocolName", "supplier", "model"]
    //数据二次处理
    const equObj = { params: {} }
    for (let key in val) {
      if (list.indexOf(key) < 0) {
        if (key === "StrByteOrder1") {
          equObj.params.StrByteOrder = val[key] ? "True" : "False"
        } else {
          equObj.params[key] = val[key]
        }
      } else {
        equObj[key] = val[key]
      }
    }
    if (val.id === "00000000-0000-0000-0000-000000000000") {
      AddDevice(equObj).then(res => {
        this.setState({ loading: false })
        if (res.code === 0) {
          message.info("新增成功");
          this.getTreeStructure();
          this.handleCancel();
        } else {
          message.error("新增失败。" + res.msg)
        }
      })
    } else {
      ModifyDevice(equObj).then(res => {
        this.setState({ loading: false })
        if (res.code === 0) {
          this.handleCancel();
          message.info("编辑成功")
          this.getTreeStructure();
        } else {
          message.error("编辑失败。" + res.msg)
        }
      })
    }
  }

  //添加分组提交函数
  onAddGroupFinish = (val) => {
    console.log(val)
    if (val.groupId === "00000000-0000-0000-0000-000000000000") {
      AddGroup(val).then(res => {
        if (res.code === 0) {
          this.getTreeStructure();
          message.info("新增成功")
          this.handleCancel();
        } else {
          message.error("新增失败。" + res.msg)
        }
      })
    } else {
      ModifyGroup(val).then(res => {
        if (res.code === 0) {
          this.getTreeStructure();
          message.info("编辑成功")
          this.handleCancel();
        } else {
          message.error("编辑失败。" + res.msg)
        }
      })
    }
  }

  menuClick = (e, id, length)=>{
    if (e.key === "addDevice") {
      this.setState({
        visible: true, 
        title: "新增设备", 
        modalContent: <AddEqu key="addDevice" onCancel={this.handleCancel} onFinish={ this.onAddDeviceFinish }/>
      })
    } else if(e.key === "modifyDevice"){
      GetDevice(id).then(res=>{
        this.setState({
          visible: true, 
          title: "编辑设备", 
          modalContent: <AddEqu key="modifyDevice" node={ res.data } onCancel={this.handleCancel} onFinish={ this.onAddDeviceFinish }/>
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
        modalContent: <AddGroupPane key="addGroup" onCancel={this.handleCancel} onFinish={this.onAddGroupFinish}/>
      })
    }else if(e.key === "modifyGroup"){
      this.setState({
        visible: true, 
        title: "编辑分组", 
        modalContent: <AddGroupPane key="modifyGroup" node={ id } onCancel={this.handleCancel} onFinish={this.onAddGroupFinish}/>
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
        console.log(res.data.tags)
        res.data.tags.forEach(element => {
          element.key = element.id
          dataList.push(element)
        });
        this.setState({
          dataSource: dataList,
          count: res.data.total,
          dataTypes: res.data.dataTypes,
          activeNode: info.node.key,
          activeNodeType: info.node.nodeType
        })
      } else {
        message.info(res.msg)
      }
    })
  }
 
  //变量查询
  searchForm = (res) => {
    let queryCondition = {
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType,
      dataType: res.dataType,
      key: res.key
    }
    QueryTags(queryCondition).then(res => {
      if (res.code === 0) {
        this.setState({dataSource: res.data.tags, count: res.data.total})
      } else {
        message.error(res.msg)
      }
    })
  }
  //数据表格选中的项
  onSelectChange = (selectedRowKeys) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`);
    this.setState({ selectedRowKeys });
    // this.setState({selectedRowKeys: [selectedRowKeys, selectedRows.id]})
  }
  //加载更多
  loadMore = () => {
    
  }
  
  //导入导出菜单
  importMenu = (e) => {
    let tags = {
      id: this.state.activeNode,
      type: this.state.activeNodeType
    }
    if (e.key === "currentTableExport") { //导出当前点表
      if (this.state.activeNode === "") {
        message.error("请选择要导出的节点")
      } else {
        ExportTags(tags).then(res => {
          downFile(res, "变量列表.xls");
        })
      }
    } else if (e.key === "overallExport") { //整体导出
      ExportTags({
        id: "00000000-0000-0000-0000-000000000000",
        type: "-1"
      }).then(res => {
        downFile(res, "变量列表.xls");
      })
    } else if (e.key === "currentTableImport") { //导入当前点表
      if (this.state.activeNode === "") {
        message.error("请选择要导出的节点")
      } else {
        
      }
    } else if (e.key === "currentTableExport") { //整体导入
      
    }
  }
  //保存变量列表
  saveList = () => {

  }
  //重置变量列表
  resetTags = () => {
    
  }
  //新增变量
  addTags = () => {
    const { dataSource, count } = this.state;
    console.log("新增",dataSource, count)
    let tagObj = {
      key: count+1,
      id: "00000000-0000-0000-0000-000000000000",
      no: count+1,
      name: "",
      desc: "",
      dataType: "",
      max: "",
      min: "",
      address: "",
      stringLength: "",
      zoom: "",
      editable: true
    }
    this.setState({ dataSource: [...dataSource, tagObj], count: count+1})
  }
  //删除变量
  delTags = () => {
    
  }

  //表格项变化
  tableColums = (activeNodeType) => {
    let columArr = [
      {
        title: '序号',
        dataIndex: 'key',
        width: "50px",
        editable: false,
        render: (key , i) => {
          return <span className="serialNum">{this.state.dataSource.indexOf(i) + 1}</span>
        }
      },{
        title: '变量名',
        dataIndex: 'name',
        editable: true,
      }, {
        title: '变量描述',
        dataIndex: 'desc',
        editable: true,
      }, {
        title: '数据类型',
        dataIndex: 'dataType',
        type: "select",
        content: this.state.tableDataTypes,
        editable: true,
      }
    ]
    if (activeNodeType === 0 || activeNodeType === 2) {
      //内部变量或者内部变量组
      columArr.push({
        title: '最大值',
        dataIndex: 'max',
        width: '100px',
        editable: true,
      },
      {
        title: '最小值',
        dataIndex: 'min',
        width: '100px',
        editable: true,
      })
    } else if (activeNodeType === 3 || activeNodeType === 4) {
      //设备或者设备变量组
      columArr.push({
        title: '变量地址',
        dataIndex: 'address',
        editable: true,
      },
      {
        title: '字符串长度',
        dataIndex: 'stringLength',
        width: '100px',
        editable: true,
      },
      {
        title: '缩放比',
        dataIndex: 'zoom',
        width: '100px',
        editable: true,
      })
    }

    return columArr; 
  }

  render() {
    const {activeNodeType, collasped, treeData, dataSource} = this.state
    return (
      <div className={`antProPageContainer ${ collasped ? 'foldToLeft' : "" }`}>
        <div className="leftContent">
          <div className="fullContain">
            {
              treeData ?
                <ZTree
                  title="设备列表"
                  zTreeOption={{
                    className: "optAdd",
                    placement: "bottomCenter"
                  }}
                  move={true}
                  option={ true }
                  nodeDatas={ treeData}
                  zTreeOptionDropdown={true}
                  zTreeOptionMenu={this.zTreeOptionMenu}
                  optionDeviceMenu={this.optionDeviceMenu}
                  // defaultExpandAll={true}
                  optionGroupMenu={this.optionGroupMenu}
                  onSelect={this.onSelect}
                />
                : null
            }
          </div>
          <span className="arrowLeft" onClick={this.toggleLeft}></span>
        </div>
        <div className="tableList">
          <Search
            dataTypes={this.state.dataTypes}
            type={activeNodeType}
            searchForm={this.searchForm}
            saveList={this.saveList}
            resetTags={this.resetTags}
            addTags={this.addTags}
            delTags={this.delTags}
            menuClick={this.importMenu}
          />
          <div className="tableContain">
            <EditableTable
              rowSelection={{
                columnWidth: "50px",
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.onSelectChange,
              }}
              gist={dataSource}
              dataSource={dataSource}
              tableDataTypes={this.state.tableDataTypes}
              loadMore={this.loadMore}
              count={this.state.count}
              rowKey={record => {
                console.length(record)
                return record.id
              }}
              columns={this.tableColums(activeNodeType).map(el => {
                return {
                  title: el.title,
                  dataIndex: el.dataIndex,
                  width: el.width || '150px',
                  ellipsis: true,
                  editable: el.editable,
                  type: el.type || "",
                  content: el.content || "",
                  render: el.render
                }
              })}
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