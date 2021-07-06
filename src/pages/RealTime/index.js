import React, { PureComponent } from 'react'
import { message } from 'antd'
import { getCookie, getNowFormatDate } from 'utils'
import {
  HubConnectionBuilder,
  JsonHubProtocol,
  LogLevel
} from '@microsoft/signalr';

import DataTable from 'components/common/Table'
import ZTree from 'components/common/Ztree'
import Search from './components/Search'

import { GetTreeStructure } from 'api/variable'
import { EnterPage, LeavePage, InitTags, QueryTags, GetNextPageTags } from 'api/realTime'

let connection = null, getTime = null;
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
      selectNodeList:[]
    }
  }

  componentDidMount() {
    let token = getCookie("accessToken")
    this.getDateTime();
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

    // SetSignalr().then(res => {
    //   console.log(res)
    // })
    connection = new HubConnectionBuilder()
      .withUrl("/api1/api/iotTagHub", { accessTokenFactory: () => token })
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(LogLevel.Information)
      .build();
    async function start() {
      try {
        await connection.start();
      } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
      }
    };
    start() 
    connection.on('receiveTagValue', res => {
      console.log(res)
    });
  }

  componentWillUnmount() {
    LeavePage().then(res => { })
    connection.stop();
    clearInterval(getTime)
  }
  // getSignalr = () => {
  //   SetSignalr().then(res => {
  //     console.log(res)
  //   })
  // }

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
    getTime = setInterval(() => {
      return getNowFormatDate()
    }, 1000)
  }
  allUnCheck = () => {
    this.setState({checkedKeys: [], selectNodeList: []})
    this.getList([])
  }
  onCheck = (checkedKeysValue, nodes) => {
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
      if (res.code === 0) {
        console.log(res.data.tagValues)
        this.setState({dataSource: res.data.tagValues, count: res.data.total, dataTypes: res.data.dataTypes})
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
    console.log(obj)
    QueryTags(obj).then(res => {
      if (res.code === 0) {
        this.setState({count: res.data.total, dataSource: res.data.tagValues})
      } else {
        message.error(res.msg)
      }
    })
  }

  render() {
    return (
      <div className={`antProPageContainer ${ this.state.collasped ? 'foldToLeft' : "" }`}>
        <div className="leftContent">
          {/* <Button onClick={this.getSignalr}>测试</Button> */}
          <div className="fullContain">
            {
              this.state.treeData ?
                <ZTree
                  checkable
                  title="设备列表"
                  nodeDatas={this.state.treeData}
                  zTreeOption={this.zTreeOption()}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys}
                  defaultExpandedKeys={ this.state.defaultExpandedKeys }
                />
                : null
            }
          </div>
          <span className="arrowLeft" onClick={this.toggleLeft}></span>
        </div>
        <div className="tableList">
          <Search onFinish={this.search} dataTypes={ this.state.dataTypes }/>
          <div className="tableContain">
            <DataTable
              dataSource={this.state.dataSource}
              loadMore={this.loadMore}
              count={this.state.count}
              columns={[
              {
                title: '变量名',
                dataIndex: 'name',
                width: '150px',
                ellipsis: true
              },
              {
                title: '变量描述',
                dataIndex: 'desc',
                width: '200px',
                ellipsis: true
              },
              {
                title: '数据类型',
                dataIndex: 'dataType',
                width: '200px',
                ellipsis: true
              },
              {
                title: '变量地址',
                dataIndex: 'address',
                width: '150px',
                ellipsis: true
              },
              {
                title: '最大值',
                dataIndex: 'max',
                width: '100px',
                ellipsis: true
              },
              {
                title: '最小值',
                dataIndex: 'min',
                width: '100px',
                ellipsis: true
              },
              {
                title: '字符长度',
                dataIndex: 'stringLength',
                width: '100px',
                ellipsis: true
              },
              {
                title: '缩放比',
                dataIndex: ' zoom',
                width: '100px',
                ellipsis: true
              },
              {
                title: '时间戳',
                dataIndex: '$DateTime',
                width: '180px',
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