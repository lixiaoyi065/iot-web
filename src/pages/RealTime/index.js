import React, { PureComponent } from 'react'
import DataTable from 'components/common/Table'
import ZTree from 'components/common/Ztree'

import Search from './components/Search'

import { GetTreeStructure } from 'api/variable'
import { GetList } from 'api/realTime'


class RealTime extends PureComponent{
  state = {
    treeData: [],
    allNodeId: [],
    checkedKeys: [],
    collasped: false,
    defaultExpandedKeys: [],
    dataSource: [],
    pageIndex: 1,
    count: 0
  }

  componentDidMount() {
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
    this.setState({ checkedKeys: this.state.allNodeId })
    this.getList(this.state.allNodeId)
  }
  allUnCheck = () => {
    this.setState({checkedKeys: []})
    this.getList(1, this.state.allNodeId)
  }
  onCheck = (checkedKeysValue) => {
    console.log(checkedKeysValue)
    this.setState({ checkedKeys: checkedKeysValue })
    this.getList(1, checkedKeysValue)
  }
  getList = (deviceId) => {
    GetList(1, deviceId).then(res => {
      this.setState({dataSource: res.data, count: res.count})
    })
  }
  //加载更多
  loadMore = () => {
    const index = this.state.pageIndex + 1;
    this.setState({pageIndex: index})
    GetList(index).then(res => {
      this.setState({ dataSource: [...this.state.dataSource, ...res.data] })
    })
  }
  //查询
  search = (res) => {
    console.log(res)
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
          <Search onFinish={ this.search }/>
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
              },
              {
                title: '变量描述',
                dataIndex: 'desc',
                width: '200px',
              },
              {
                title: '数据类型',
                dataIndex: 'dataType',
                width: '200px',
              },
              {
                title: '变量地址',
                dataIndex: 'address',
                width: '150px',
              },
              {
                title: '变量值',
                dataIndex: 'value',
                width: '150px',
              },
              {
                title: '时间戳',
                dataIndex: ' timeStamp',
                width: '250px',
              }
            ] }/>
          </div>
        </div>
      </div>
    )
  }
}

export default RealTime