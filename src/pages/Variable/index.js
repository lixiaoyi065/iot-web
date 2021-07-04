import React, { PureComponent } from 'react'
import { Modal, message, Spin } from "antd"
import PubSub from "pubsub-js";
import $ from "jquery"

import DrowDownMenu from 'components/common/DrowDownMenu'
import ZTree from 'components/common/Ztree'
import EditableTable from 'components/common/DataTable'
// import EditableTable from 'components/common/EditDataTable'

import AddEqu from './components/AddEqu'
import AddGroupPane from './components/AddGroup'
import Search from './components/Search'
import AddressConfig from './components/AddressConfig'
import OpcConfig from './components/AddressConfig/OpcConfig'

import { downFile, deepClone } from "utils";

import {
  AddDevice, ModifyDevice, AddGroup, ModifyGroup,
  GetTreeStructure, GetDevice, DeleteDevice, DelGroup,
  InitTags, GetNextPageTags, QueryTags, SaveTags, ExportTags, DeleteTags,
  GetSaveTagsTaskProgress, ImportFile, GetImportTagsTaskProgress, GetAddressEditInfo,
  SortTreeNode, TestOPCUaConnect,
  GetDeviceStatus,StartDevice,StopDevice
} from 'api/variable'

let deviceStatusTimer = null;
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
    node: {},//当前显示的变量对象
    activeNode: "", //当前显示变量列表的节点ID
    activeNodeName: "",//当前显示变量列表的节点名称
    activeNodeType: 0, //当前显示变量列表的节点类型
    tableDataTypes: [],
    modifyTagsList: [],
    fileList: [],
    canSubmit: {},
    tableLoading: false,
    pageIndex: 0, //当前页面
    opcConfigVisible: false,
    opcConfigContent: "",
  }
  searchRef = React.createRef();
  componentDidMount() {
    this.getTreeStructure();
    PubSub.subscribe("modifyTags", (msg, data) => {
      this.setState({modifyTagsList: data})
    })
    PubSub.subscribe("canSubmit", (msg, data) => {
      this.setState({canSubmit: data})
    })

    this.getDeviceStatus();
    deviceStatusTimer = setInterval(() => {
      this.getDeviceStatus();
    }, 5000)
  }
  componentWillUnmount() {
    clearInterval(deviceStatusTimer)
    //取消订阅
    PubSub.unsubscribe("modifyTags")
    PubSub.unsubscribe("canSubmit")
  }
  getDeviceStatus = () =>{
    GetDeviceStatus().then(res => {
      PubSub.publish("deviceStatus", res.data)
    })
  }

  //获取整棵设备列表树结构
  getTreeStructure = () => {
    GetTreeStructure().then(res => {
      console.log("设备树：",res.data)
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
      }, {
          key: "allExport",
          name: "整体导出"
        }
      ]}
      onClick={(e) => {
        e.domEvent.stopPropagation();
        this.menuClick(e)
      }}
    />
  )
  //操作内部变量菜单
  interVariable = (el) => {
    return (
      <DrowDownMenu lists={[
        {
          key: "overallExport",
          name: '整体导出',
        }
      ]}
      onClick={(e) => {
        console.log(el)
        e.domEvent.stopPropagation();
        this.menuClick(e, el)
      }}
    />
    )
  }
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
        },
        {
          key: "overallExport",
          name: '整体导出',
        }
      ]}
      onClick={(e) => {
        console.log(el)
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
  opcConfigCancel = ()=>{
    this.setState({opcConfigVisible: false})
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
  
  //opc_ua协议测试连接
  connetTest = (val) => {
    TestOPCUaConnect(val).then(res => {
      if (res.code === 0) {
        message.info("连接成功")
      } else {
        message.error(res.msg)
      }
    })
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

  menuClick = (e, node, length)=>{
    if (e.key === "addDevice") {
      this.setState({
        visible: true, 
        title: "新增设备", 
        modalContent: <AddEqu key={ new Date()}
          onCancel={this.handleCancel}
          onFinish={this.onAddDeviceFinish}
          connetTest={this.connetTest} />
      })
    } else if (e.key === "modifyDevice") {
      GetDevice(node.nodeID).then(res=>{
        this.setState({
          visible: true, 
          title: "编辑设备", 
          modalContent: <AddEqu
            key={`modifyDevice + ${node.nodeID}`}
            node={res.data}
            onCancel={this.handleCancel}
            onFinish={this.onAddDeviceFinish}
            connetTest={ this.connetTest } />
        })
      })
    } else if(e.key === "delDevice"){
      if(length > 0){
        this.confirm('节点下有分组存在，删除将会跟随分组一起删除，无法恢复，是否继续?',()=>{
          this.delDevice(node.nodeID);
        })
      }else{
        this.delDevice(node.nodeID)
      }
    } else if (e.key === "allExport") {
      ExportTags({
        nodeId: "00000000-0000-0000-0000-000000000000",
        type: -1
      }).then(res => {
        downFile(res, "变量总列表.xls");
      })
    } else if (e.key === "overallExport") {
      ExportTags({
        nodeId: node.nodeID,
        type: node.nodeType
      }).then(res => {
        downFile(res, node.nodeName + ".xlsx");
      })
    }else if (e.key === "addGroup") {
      this.setState({
        visible: true, 
        title: "新增分组", 
        modalContent: <AddGroupPane key="addGroup"
          onCancel={this.handleCancel} 
          onFinish={this.onAddGroupFinish}/>
      })
    } else if (e.key === "modifyGroup") {
      console.log(node)
      this.setState({
        visible: true, 
        title: "编辑分组", 
        modalContent: <AddGroupPane
          key={node.groupId} node={node}
          onCancel={this.handleCancel}
          onFinish={this.onAddGroupFinish} />
      })
    } else if (e.key === "delGroup") {
      this.confirm('节点下有变量存在，删除将会跟随变量一起删除，无法恢复，是否继续?',()=>{
        DelGroup(node.groupId).then(res=>{
          if(res.code === 0){
            message.info("删除成功")
            this.getTreeStructure();
          }else{
            message.error(res.msg)
          }
        })
      })
    } else if (e.key === "startDevice") {
      StartDevice(node.nodeID).then(res =>{
        if (res.code === 0) {
          message.info("启动成功")
        } else {
          message.info(res.msg)
        }
      })
    } else if (e.key === "stopDevice") {
      StopDevice(node.nodeID).then(res =>{
        if (res.code === 0) {
          message.info("停止成功")
        } else {
          message.info(res.msg)
        }
      })
    }
  }
  //点击节点触发函数
  onSelect = (res, info) => {
    let tags = {
      nodeId: info.node.key,
      type: info.node.nodeType
    }
    //当前节点存在未保存的变量，提示是否继续下面的操作
    if (this.state.modifyTagsList.length > 0) {
      this.confirm('当前节点存在未保存的变量，是否继续？',()=>{
        this.initTagList(tags,info)
      })
    } else {
      this.initTagList(tags,info)
    }
  }
  //初始加载变量列表
  initTagList = (tags, info = null) => {
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
    // let nodeName = info.node.nodeType === 1 ? info.selectedNodes[0].title : info.selectedNodes[0].title.props.children[0].props.children
    if (info) {
      this.setState({
        tableLoading: true,
        activeNode: info.node.key,
        // activeNodeName: nodeName,
        activeNodeType: info.node.nodeType,
        node: info.node
      })      
    } else {
      this.setState({
        tableLoading: true,
      })
    }
    InitTags(tags).then(res => {
      let dataList = [];
      this.setState({tableLoading: false})
      if (res.code === 0) {
        res.data.tags.forEach(element => {
          element.key = element.id
          dataList.push(element)
        });
        console.log(res)
        this.setState({
          dataSource: dataList,
          tableDataTypes: res.data.gridDataTypes,
          gist: [...dataList],
          count: res.data.total,
          total: res.data.total > 100 ? 100 : res.data.total,
          dataTypes: res.data.dataTypes,
          activeNode: tags.nodeId,
          activeNodeName: res.data.nodeName,
          activeNodeType: tags.type,
          modifyTagsList: [],
          pageIndex: 0
        })
      } else {
        message.info(res.msg)
      }
    })
  }

  hintSave = (callback) => {
    if (this.state.modifyTagsList.length > 0) {
      Modal.confirm({
        title: "当前存在未保存的变量，确认继续将会被还原",
        okText: "确认",
        cancelText: "取消",
        onCancel: () => {
          //重置查询
          this.searchRef.current.refs.formRef.setFieldsValue({
            dataType: "不限",
            key: "",
          })
        },
        onOk: callback
      })
    } else {
      callback()
    }
  }
 
  //变量查询
  searchForm = (res) => {
    let queryCondition = {
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType,
      dataType: res.dataType,
      key: res.key
    }
    this.hintSave(() => {
      this.queryTagsFun(queryCondition);
    })
  }
  queryTagsFun = (queryCondition) => {
    this.setState({ modifyTagsList: [] })
    $(".effective-editor").removeClass("effective-editor")
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
    this.setState({ selectedRowKeys });
    // this.setState({selectedRowKeys: [selectedRowKeys, selectedRows.id]})
  }
  //加载更多
  loadMore = () => {
    GetNextPageTags(this.state.activeNode).then(res => {
      this.setState((state) => {
        state.dataSource.splice(state.total, 0, ...res.data)
        return {
          dataSource: [...state.dataSource],
          total: state.total + res.data,
        }
      })
    })
  }
  
  //导入导出菜单
  importMenu = (e) => {
    let tags = {
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType
    }
    if (e.key === "currentTableExport") { //导出当前点表
      if (this.state.activeNode === "") {
        message.error("请选择要导出的节点")
      } else {
        ExportTags(tags).then(res => {
          downFile(res, "变量列表.xlsx");
          // downFile(res, `${this.state.activeNodeName}.xlsx`);
        })
      }
    } else if (e.key === "currentTableImport") { //导入当前点表
      if (this.state.activeNode === "") {
        message.error("请选择要导入的节点")
      } else {
        this.hintSave(() => {
          document.getElementById("importFile").click();
        })
      }
    }
  }

  //保存变量列表
  saveList = () => {
    if(this.state.modifyTagsList.length === 0){
      message.warning("当前没有更改的内容")
      return;
    }
    if (!this.state.canSubmit.canSubmit) {
      message.error(this.state.canSubmit.message)
      return;
    }

    let modifyList = []
    deepClone(this.state.modifyTagsList).map(item => {
      item.key = item.id
      modifyList.push(item)
      return "";
    })
    this.setState({loading: true})
    SaveTags({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType,
      dataTypes: [],
      tags: modifyList,
      total: 0
    }).then(res=>{
      if(res.code === 0){
        let timer = setInterval(()=>{
          //获取
          GetSaveTagsTaskProgress(res.data).then(val=>{
            console.log(val)
            //清除定时器,关闭加载中
            if (val.data.status === 2 || val.data.status === 3) {
              clearInterval(timer)
              if(val.data.message){
                message.info(val.data.message)
              }
              $("div").removeClass("effective-editor")
              this.setState({ loading: false })
              if (val.data.resultData !== null) {
                let { dataTypes, tree } = val.data.resultData
                if (dataTypes !== null) {
                  this.setState({ dataTypes: dataTypes})
                }
                if (tree !== null) {
                  this.setState({ treeData: tree})
                }
          
                this.initTagList({
                  nodeId: this.state.activeNode,
                  type: this.state.activeNodeType
                })
              }
            }
          })
        }, 1000)
      }else{
        message.error(res.msg)
        this.setState({loading: false})
      }
    })
   
  }
  //重置变量列表
  resetTags = () => {
    this.initTagList({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType
    })
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
  }
  //新增变量
  addTags = () => {
    const { dataSource, count } = this.state;
    let tagObj = {
      key: `${count + 1}`,
      id: "00000000-0000-0000-0000-000000000000",
      no: count+1,
      name: "",
      desc: "",
      dataType: this.state.tableDataTypes[0],
      max: "",
      min: "",
      address: "",
      stringLength: "",
      zoom: "",
      editable: true
    }
    this.setState(state => {
      return {
        dataSource: [...dataSource, tagObj],
        count: count + 1,
        modifyTagsList: [...state.modifyTagsList, tagObj],
        canSubmit: {
          canSubmit: false,
          message: "变量名不可为空，请重新输入"
        }
      }
    }, () => {
      $(`#dataType${count+1}`).parent().parent().addClass("effective-editor")
    })
    PubSub.publish("modifyTags", [...this.state.modifyTagsList, tagObj])
  }
  //删除变量
  delTags = () => {
    let phyDel = [], //物理删除
      dataDel = []; //数据库删除
    this.state.selectedRowKeys.forEach((item,i)=>{
      if(item.length !== 36){
        phyDel.push(item)
      }else{
        dataDel.push(item)
      }
    })
    DeleteTags({
      ids: dataDel,
      type: this.state.activeNodeType
    }).then(res => {
      if (res.code === 0) {
        message.info("删除成功")
        this.setState((state) => {
          let targetObj = [...state.dataSource]
          let modify = [...state.modifyTagsList]
          res.data.forEach((id) => {
            for (let i = 0; i < targetObj.length;i++){ 
              if (targetObj[i].key === id) {
                targetObj.splice(i, 1);
                break;
              }
            }
            //移除modifyTagsList中删除的变量
            for (let i = 0; i < modify.length; i++){
              if (modify[i].key === id) {
                modify.splice(i, 1);
                break;
              }
            }
          })
          phyDel.forEach((id)=>{
            for (let i = 0; i < targetObj.length;i++){ 
              if (targetObj[i].key === id) {
                targetObj.splice(i, 1);
                break;
              }
            }
            //移除modifyTagsList中删除的变量
            for (let i = 0; i < modify.length; i++){
              if (modify[i].key === id) {
                modify.splice(i, 1);
                break;
              }
            }
          })
          return {
            dataSource: targetObj,
            modifyTagsList: modify,
            count: state.count - res.data.length
          }
        })
      } else {
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
        render: (key, i) => {
          return <span className="serialNum">{this.state.dataSource.indexOf(i) +1}</span>
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
        type: "input-group",
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
    console.log("+++++++++++")
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
    const formdata = new FormData();
    formdata.append('files', e.target.files[0]);
    this.importFileFun(formdata);
  }

  importFileFun = (formdata) => {
    document.getElementById('importFile').value=null
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
                if (mes.data.message === "导入成功") {
                  $(".effective-editor").removeClass("effective-editor")
                }
                return {
                  loading: false,
                  count: mes.data.message === "导入成功" ? result.total : state.count,
                  gist: mes.data.message === "导入成功" && result.tags !== null ? result.tags : state.dataSource,
                  dataSource: mes.data.message === "导入成功" && result.tags !== null ? result.tags : state.dataSource,
                  treeData: mes.data.message === "导入成功" && result.tree !== null ? result.tree : state.treeData,
                  dataTypes: mes.data.message === "导入成功" && result.dataTypes !== null ? result.dataTypes : state.dataTypes,
                  modifyTagsList: mes.data.message === "导入成功" ? [] : state.modifyTagsList //导入成功，清空编辑项
                }
              })
              PubSub.publish("changeTags", true)
              clearInterval(getProcessTimer)
              PubSub.publish("changeTags", false)
            }
          })
        },1000)
      }
    })
  }

  addressSearch = (value, event, row) => {
    GetAddressEditInfo({
      nodeId: this.state.activeNode,
      type: this.state.activeNodeType
    }).then(res => {
      let data = res.data
      if(data.protocolName === "OPC_UA" || data.protocolName === "OPC_DA"){
        this.setState({
          opcConfigContent: (
            <OpcConfig data={data} row={row} node={this.state.node}
              key={new Date()}
              onCancel={this.opcConfigCancel}
              onFinish={this.OpcConfigCommit}/>
          ),
          opcConfigVisible: true,
          title: "选择"+ data.protocolName +"地址"
        })
      }else{
        this.setState({
          modalContent : (
            <AddressConfig data={data} row={row} node={this.state.node}
              key={new Date()}
              onCancel={this.handleCancel}
              onFinish={this.addressFinish}/>
          ),
          visible: true,
          title: "选择"+ data.protocolName +"地址"
        })
      }
    })
  }
  OpcConfigCommit = ()=>{
    console.log("OpcConfigCommit-------")
    this.opcConfigCancel();
  }
  addressFinish = (res) => {
    console.log(res)
  }

  onDrop = info => {
    let newNodeList = []; //新的节点排序
    console.log("info", info);
    const dragNode = info.dragNode;
    const dropNode = info.node;
    console.log(dragNode, dropNode);

    const isSameParent = (a, b) => {
      return a.fatherNodeID === b.fatherNodeID;
    };

    const sameParent = isSameParent(dragNode, dropNode);

    if (sameParent && !dropNode.dragOverGapBottom) {
      const dragKey = info.dragNode.props.eventKey;

      //如果dragPos 小于 dropPos ，那要减一
      const dropPosition = info.dragNode.pos < info.node.pos ? info.dropPosition - 1: info.dropPosition;

      const loop = (data, key, callback) => {
        if(key === "00000000-0000-0000-0000-000000000000"){
          return callback(data);
        }else{
          for (let i = 0; i < data.length; i++) {
            if (data[i].nodeID === key) {
              return callback(data[i], i, data);
            }
            if (data[i].children) {
              loop(data[i].children, key, callback);
            }
          }
        }
      };
      const data = [...this.state.treeData];
      console.log(info.dragNode.pos < info.node.pos,info.dragNode.pos, info.node.pos, info.dropPosition, dropPosition)
      // 找到当前拖动的对象
      let dragObj; 
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      console.log(dropNode.dragOverGapBottom)

      if (!info.dropToGap) {
        // Drop on the content
        console.log("...............")
        loop(data, dragObj.fatherNodeID, (item) => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.splice(dropPosition + 1, 0, dragObj)
          // item.children.push(dragObj);
        });
      } else if (
        (info.node.props.children || []).length > 0 && // Has children
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {

      } else if(dragObj.fatherNodeID === "00000000-0000-0000-0000-000000000000"
        && dropNode.fatherNodeID === "00000000-0000-0000-0000-000000000000"
      ){
        console.log("-0-0-0-0")
        //最外层
        loop(data, dragObj.fatherNodeID, (item) => {
          item.splice(dropPosition, 0, dragObj)
        });
      }

      data.forEach(item=>{
        if(dragObj.fatherNodeID === "00000000-0000-0000-0000-000000000000"){
          newNodeList.push(item.nodeID)
        }else if(dragObj.fatherNodeID === item.nodeID){
          item.children.forEach(child=>{
            newNodeList.push(child.nodeID)
          })
        }
      })

      SortTreeNode({
        nodeId: dragObj.fatherNodeID,
        children: newNodeList
      }).then(res=>{

      })
      this.setState({treeData: data});
    }else if(dragNode.fatherNodeID === dropNode.key){
      console.log("====")
      // dragNode.fatherNodeID === dropNode.nodeID
    }
  };
    
  render() {
    const { activeNodeType, collasped, treeData, dataSource, gist } = this.state
    return (
      <div className={`antProPageContainer ${ collasped ? 'foldToLeft' : "" }`}>
        <Spin spinning={this.state.loading}>
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
                    interVariable={this.interVariable}
                    optionDeviceMenu={this.optionDeviceMenu}
                    optionGroupMenu={this.optionGroupMenu}
                    onSelect={this.onSelect}
                    draggable
                    blockNode
                    onDrop={this.onDrop}
                  />
                  : null
              }
            </div>
            <span className="arrowLeft" onClick={this.toggleLeft}></span>
          </div>
          <div className="tableList">
            <Search
              ref={this.searchRef}
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
              <EditableTable
                rowSelection={{
                  columnWidth: "50px",
                  selectedRowKeys: this.state.selectedRowKeys,
                  onChange: this.onSelectChange,
                }}
                key={ this.state.activeNode }
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
            width="700px"
            bodyStyle={{padding: "30px 30px 20px"}}
            title={this.state.title}
            visible={this.state.opcConfigVisible}
            onCancel={this.opcConfigCancel}
            footer={null}
            >
            {
              this.state.opcConfigContent
            }
          </Modal>
        </Spin>
      </div>
    )
  }
}

export default RealTime