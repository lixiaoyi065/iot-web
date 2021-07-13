import React, { PureComponent } from 'react'
import { message } from 'antd'
import { getCookie, getNowFormatDate } from 'utils'
import {
  HubConnectionBuilder,
  JsonHubProtocol,
  LogLevel
} from '@microsoft/signalr';
import PubSub from "pubsub-js";

import DataTable from 'components/common/Table'
import ZTree from 'components/common/Ztree'
import Search from './components/Search'

import { GetTreeStructure, GetDeviceStatus} from 'api/variable'
import { EnterPage, LeavePage, InitTags, QueryTags, GetNextPageTags } from 'api/realTime'

let connection = null, getTime = null, deviceStatusTimer= null;
class RealTime extends PureComponent{
  constructor (props) {
    super(props);
    this.state = {
      treeData: [],
      allNodeId: [],
      checkedKeys: [],
      collasped: false,
      defaultExpandedKeys: [],
      dataTypes: [],
      dataSource: [],
      pageIndex: 1,
      count: 0,
      selectNodeList: []
    }
  }
  searchRef = React.createRef();

  componentDidMount() {
    let token = getCookie("accessToken")
    EnterPage().then(res => {})
    //获取整棵设备列表树结构
    GetTreeStructure().then(res => {
      let allcheck = [];
      if (res.data && res.data.length > 0) {
        res.data.forEach(data => {
          if (data.children.length > 0) {
            data.children.forEach(child => {
              allcheck.push(child.nodeID)
            })
          }
          allcheck.push(data.nodeID)
        })
      }
      this.setState({ treeData: res.data, allNodeId: allcheck })
    })
    this.getDeviceStatus();

    deviceStatusTimer = setInterval(() => {
      this.getDeviceStatus();
    }, 1000)

    connection = new HubConnectionBuilder()
      .withUrl("/api/iotTagHub", { accessTokenFactory: () => token })
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(LogLevel.Information)
      .build();
    async function start() {
      try {
        await connection.start();
      } catch (err) {
        console.log(err);
        setTimeout(start, 1000);
      }
    };
    start() 
    connection.on('receiveTagValue', res => {
      console.log(res)
      this.setState(state => {
        for (let i in res) {
          state.dataSource.map(item => {
            console.log(item)
            if (item.key === i) {
              item.value = res[i] + ""
            }
            return item
          })
        }
        return {
          dataSource: JSON.parse(JSON.stringify(state.dataSource))
        }
      })
    });
  }

  getDeviceStatus = () =>{
    GetDeviceStatus().then(res => {
      PubSub.publish("deviceStatus", res.data)
    })
  }

  componentWillUnmount() {
    LeavePage().then(res => { })
    connection.stop();
    clearInterval(getTime)
  }

  //收缩设备列表
  toggleLeft = ()=>{
    const collapsed = !this.state.collasped
    this.setState({collasped: collapsed})
  }
  zTreeOption = () => {
    return (
      <>
        <div className="all-checkbox all-check" onClick={this.allCheck}>全选</div>
        <div className="all-checkbox all-uncheck" onClick={ this.allUnCheck }>不选</div>
      </>
    )
  }
  allCheck = () => {
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
    let nodesList = [];
    this.state.treeData.forEach(item => {
      nodesList.push({
        "nodeId": item.nodeID,
        "type": item.nodeType,
        "no": 0
      })
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          nodesList.push({
            "nodeId": child.nodeID,
            "type": child.nodeType,
            "no": 0
          })
        })
      }
    })
    this.setState({ checkedKeys: this.state.allNodeId, selectNodeList: nodesList })
    this.getList(nodesList)
  }
  getDateTime = () => {
    if (this.state.dataSource.length > 0) {
      getTime = setInterval(() => {
        this.setState(state => {
          state.dataSource.forEach(item => {
            item.time = getNowFormatDate()
          })

          return {  
            dataSource: JSON.parse(JSON.stringify(state.dataSource))
          }
        })
      }, 1000)
    } else {
      clearInterval(getTime)
    }
  }
  allUnCheck = () => {
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
    this.setState({checkedKeys: [], selectNodeList: []})
    this.getList([])
  }
  onCheck = (checkedKeysValue, nodes) => {
    //重置查询
    this.searchRef.current.refs.formRef.setFieldsValue({
      dataType: "不限",
      key: "",
    })
    let nodesList = []
    nodes.checkedNodes.forEach(item => {
      nodesList.push({
        "nodeId": item.key,
        "type": item.nodeType,
        "no": 0
      })
    })
    this.setState({ checkedKeys: checkedKeysValue, selectNodeList: nodesList })
    this.getList(nodesList)
  }
  getList = (nodesList) => {
    InitTags(nodesList).then(res => {
      console.log(res)
      if (res.code === 0) {
        this.setState({dataSource: res.data.tagValues, count: res.data.total, dataTypes: res.data.dataTypes}, () => {
          this.getDateTime()
        })
      } else {
        message.error(res.msg)
      }
    })
  }
  //加载更多
  loadMore = () => {
    GetNextPageTags(this.state.selectNodeList).then(res => {
      if (res.code === 0) {
        this.setState({ dataSource: [...this.state.dataSource, ...res.data] })
      } else {
        message.error(res.msg)
      }
    })
  }
  //查询
  search = (obj) => {
    obj.nodes = this.state.selectNodeList;
    // console.log(obj)
    QueryTags(obj).then(res => {
      if (res.code === 0) {
        this.setState({ count: res.data.total, dataSource: res.data.tagValues })
      } else {
        message.error(res.msg)
      }
    })
  }
  onSelect = (selectRows, row) => {
  }

  render() {
    return (
      <div className={`antProPageContainer ${ this.state.collasped ? 'foldToLeft' : "" }`}>
        <div className="leftContent">
          <div className="fullContain">
            {
              this.state.treeData ?
                <ZTree
                  checkable
                  title="设备列表"
                  move={false}
                  selectNodeList={[]}
                  nodeDatas={this.state.treeData}
                  zTreeOption={this.zTreeOption()}
                  onCheck={this.onCheck}
                  onSelect={this.onSelect}
                  checkedKeys={this.state.checkedKeys}
                  defaultExpandedKeys={ this.state.defaultExpandedKeys }
                />
                : null
            }
          </div>
          <span className="arrowLeft" onClick={this.toggleLeft}></span>
        </div>
        <div className="tableList">
          <Search onFinish={this.search} dataTypes={ this.state.dataTypes } ref={this.searchRef}/>
          <div className="tableContain">
            <DataTable
              dataSource={this.state.dataSource}
              loadMore={this.loadMore}
              count={this.state.count}
              columns={[
              {
                title: '变量名',
                dataIndex: 'name',
                width: 150,
                ellipsis: true
              },
              {
                title: '变量描述',
                dataIndex: 'desc',
                width: 200,
                ellipsis: true
              },
              {
                title: '数据类型',
                dataIndex: 'dataType',
                width: 200,
                ellipsis: true
              },
              {
                title: '变量地址',
                dataIndex: 'address',
                width: 150,
                ellipsis: true
              },
              {
                title: '变量值',
                dataIndex: 'value',
                width: 100,
                ellipsis: true
              },
              {
                title: '时间戳',
                dataIndex: 'time',
                width: 180,
                ellipsis: true
              }
            ] }/>
          </div>
        </div>
      </div>
    )
  }
}

export default RealTime