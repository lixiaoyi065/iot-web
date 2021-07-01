 import React, { PureComponent } from 'react'
import { Modal, message, Spin, Dropdown } from "antd"
import PubSub from "pubsub-js";
import $ from "jquery"

import DrowDownMenu from 'components/common/DrowDownMenu'
import ZTree from './components/Ztree'
import Table from 'components/common/EditDataTable/index.jsx'
// import Table from './components/Table/index.jsx'

import AddEqu from './components/AddEqu'
import AddGroupPane from './components/AddGroup'
import Search from './components/Search'

import { downFile, deepClone } from "utils";

import {
  AddDevice, ModifyDevice, AddGroup, ModifyGroup,
  GetTreeStructure, GetDevice, DeleteDevice, DelGroup, SortTreeNode,
  InitTags, GetNextPageTags, QueryTags, SaveTags, ExportTags, DeleteTags,
  GetSaveTagsTaskProgress, ImportFile, GetImportTagsTaskProgress,
  GetDeviceStatus
} from 'api/variable'

class RealTime extends PureComponent{
  state = {
    loading: false, //保存时显示加载中
    treeData: [],//设备树数据
    dataSource: [], //表格的变量列表数据
    gist: [],//表格的变量列表数据参考对象
    dataTypes: [], //查询的数据类型
    total: 0, //正常加载显示的数量
    count: 0, //总数
    collasped: false,
    selectedRowKeys: [],
    //添加设备
    visible: false, //弹窗显示隐藏
    title: "",//弹窗标题
    modalContent: "",//弹窗内容
    activeNode: "", //当前显示变量列表的节点
    activeNodeType: 0, //当前显示变量列表的节点类型
    tableDataTypes: [],
    modifyTagsList: [],
    fileList: [],
    canSubmit: {},
    tableLoading: false,
    comfirmContent: "",
    comfirmVisible: false,
    arrowMenuVisible: false,
    arrowMenuPosition: {
      left: 0,
      top: 0
    },
    arrowMenuList: []
  }
  searchRef = React.createRef()
  componentDidMount() {
    this.getTreeStructure();
    PubSub.subscribe("modifyTags", (msg, data) => {
      this.setState({modifyTagsList: data})
    })
    PubSub.subscribe("canSubmit", (msg, data) => {
      this.setState({canSubmit: data})
    })
  }
  componentWillUnmount(){
    //取消订阅
    PubSub.unsubscribe("modifyTags")
  }

  //获取整棵设备列表树结构
  getTreeStructure = () => {
    GetTreeStructure().then(res => {
      console.log("设备树：",res.data)
      this.setState({treeData: res.data})
    })
  }
  //初始加载变量列表
  initTagList = tags => {
    this.setState({tableLoading: true})
    InitTags(tags).then(res => {
      let dataList = [];
      this.setState({tableLoading: false})
      if (res.code === 0) {
        res.data.tags.forEach(element => {
          element.key = element.id
          dataList.push(element)
        });
        this.setState({
          dataSource: dataList,
          tableDataTypes: res.data.gridDataTypes,
          gist: [...dataList],
          count: res.data.total,
          total: res.data.total > 100 ? 100 : res.data.total,
          dataTypes: res.data.dataTypes,
          activeNode: tags.nodeId,
          activeNodeType: tags.type
        })
      } else {
        message.info(res.msg)
      }
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
      }, {
          key: "allExport",
          name: "整体导出"
        }
      ]}
      onClick={(e) => {
        e.domEvent.stopPropagation();
        this.menuClick(e.key)
      }}
    />
  )

  //点击节点触发函数
  onSelect = (info) => {
    let tags = {
      nodeId: info.nodeID,
      type: info.nodeType
    }
    this.setState({
      activeNode: info.nodeID,
      activeNodeType: info.nodeType
    })

    this.initTagList(tags)
  }

  //提交节点排序的修改
  submitSortTreeNode = (obj) => {
    SortTreeNode(obj).then(res => {
      console.log(res)
    })
  }
  menuClick = (key, treeNode=null, length)=>{
    let id = treeNode !== null ? treeNode.nodeID : "";
    console.log(key)
    if (key === "addDevice") {
      this.setState({
        visible: true, 
        title: "新增设备", 
        modalContent: <AddEqu key="addDevice" onCancel={this.handleCancel} onFinish={ this.onAddDeviceFinish }/>
      })
    } else if(key === "modifyDevice"){
      GetDevice(id).then(res=>{
        this.setState({
          visible: true, 
          title: "编辑设备", 
          modalContent: <AddEqu key="modifyDevice" node={ res.data } onCancel={this.handleCancel} onFinish={ this.onAddDeviceFinish }/>
        })
      })
    } else if(key === "delDevice"){
      if(length > 0){
        this.confirm('节点下有分组存在，删除将会跟随分组一起删除，无法恢复，是否继续?',()=>{
          this.delDevice(id);
        })
      }else{
        this.delDevice(id)
      }
    } else if (key === "allExport") {
      ExportTags({
        nodeId: "00000000-0000-0000-0000-000000000000",
        type: -1
      }).then(res => {
        downFile(res, "变量列表.xls");
      })
    } else if (key === "overallExport") {
      ExportTags({
        nodeId: id,
        type: 3
      }).then(res => {
        downFile(res, "设备列表.xls");
      })
    }else if (key === "addGroup") {
      this.setState({
        visible: true, 
        title: "新增分组", 
        modalContent: <AddGroupPane key="addGroup" onCancel={this.handleCancel} onFinish={this.onAddGroupFinish}/>
      })
    }else if(key === "modifyGroup"){
      console.log(id)
      this.setState({
        visible: true, 
        title: "编辑分组", 
        modalContent: <AddGroupPane key="modifyGroup" node={{
          deviceId: treeNode.fatherNodeID,
          groupId: id,
          name: treeNode.nodeName,
          type: treeNode.nodeType
        }} onCancel={this.handleCancel} onFinish={this.onAddGroupFinish}/>
      })
    } else if (key === "delGroup") {
      this.confirm('节点下有变量存在，删除将会跟随变量一起删除，无法恢复，是否继续?',()=>{
        DelGroup(id).then(res=>{
          if(res.code === 0){
            message.info("删除成功")
            this.getTreeStructure();
          }else{
            message.error(res.msg)
          }
        })
      })
    }
  }

  handleCancel = ()=>{
    this.setState({visible: false, comfirmVisible: false})
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

  delDevice = (id) => {
    DeleteDevice(id).then(res=>{
      if(res.code === 0){
        message.info("删除成功") 
        this.getTreeStructure();
      }else{
        message.error(res.msg)
      }
    })
  }
  //表格项变化
  tableColums = (activeNodeType) => {
    let columArr = [
      {
        title: '序号',
        dataIndex: 'no',
        width: 50,
        editable: false,
        render: (key) => {
          return <span className="serialNum">{key}</span>
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
        width: 100,
        editable: true,
      },
      {
        title: '最小值',
        dataIndex: 'min',
        width: 100,
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
        title: '字符长度',
        dataIndex: 'stringLength',
        width: 100,
        editable: true,
      },
      {
        title: '缩放比',
        dataIndex: 'zoom',
        width: 100,
        editable: true,
      })
    }

    return columArr; 
  }

  //导入点表文件
  importProps = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('files', e.target.files[0]);
    console.log(formdata,formdata.getAll("files"))

    console.log({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType,
    })

    ImportFile({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType,
      formData: formdata
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        this.setState({loading: true})
        let getProcessTimer = setInterval(() => {
          GetImportTagsTaskProgress(res.data).then(mes => {
            let result = mes.data.resultData
            console.log(mes)
            if ( mes.data.status === 2 ||  mes.data.status === 3) {
              message.info(mes.data.message)
              
              this.setState(state => {
                return {
                  loading: false,
                  count: mes.data.message === "导入成功" ? result.total : state.count,
                  dataSource: result.tags !== null ? result.tags : state.dataSource,
                  treeData: result.tree !== null ? result.tree : state.treeData,
                  dataTypes: result.dataTypes !== null ? result.dataTypes : state.dataTypes
                }
              })
              clearInterval(getProcessTimer)
            }
          })
        },1000)
      }
    })

  }
    
  render() {
    const { activeNodeType, collasped, treeData, dataSource, gist } = this.state
    return (
      <div className={`antProPageContainer ${ collasped ? 'foldToLeft' : "" }`}>
        <Spin spinning={this.state.loading}>
          <div className="leftContent">
            <div className="fullContain">
              <div className="title">
                <div className="title-contain">
                  <span>设备列表</span>
                  <div className="optGroup"> {
                    <Dropdown overlay={this.zTreeOptionMenu} trigger={['click']}
                      placement="bottomCenter" arrow>
                      <div className="optAdd"></div>
                    </Dropdown>
                  } </div>
                </div>
              </div>
              {
                treeData ?
                  <ZTree
                    title="设备列表"
                    MenuPaneLoad={this.MenuPaneLoad}
                    pathName="variable"
                    nodeDatas={ treeData}
                    onSelect={this.onSelect}
                    menuClick={this.menuClick}
                    submitSortTreeNode={this.submitSortTreeNode}
                  />
                  : null
              }
            </div>
            <span className="arrowLeft" onClick={this.toggleLeft}></span>
          </div>
          <div className="tableList">
            <Search
              ref={ this.searchRef }
              importProps={this.importProps}
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
              <Table 
                rowSelection={{
                  columnWidth: "50px",
                  selectedRowKeys: this.state.selectedRowKeys,
                  onChange: this.onSelectChange,
                }}
                pageIndex={this.state.pageIndex}
                gist={gist}
                dataSource={dataSource}
                activeNode={this.state.activeNode}
                activeNodeType={this.state.activeNodeType}
                tableDataTypes={this.state.tableDataTypes}
                loadMore={this.loadMore}
                count={this.state.count}
                rowKey={record => {
                  return record.id
                }}
                addressSearch={ this.addressSearch }
                loading={this.state.tableLoading}
                columns={this.tableColums(activeNodeType).map(el => {
                  return {
                    title: el.title,
                    dataIndex: el.dataIndex,
                    width: el.width || 150,
                    ellipsis: {
                      showTitle: false,
                    },
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
          <Modal
            title="提示"
            visible={this.state.comfirmVisible}
            onCancel={this.handleCancel}
          >
            {this.state.comfirmContent}
          </Modal>
        </Spin>
      </div>
    )
  }
}

export default RealTime