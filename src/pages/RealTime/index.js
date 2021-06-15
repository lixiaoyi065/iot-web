import React, { PureComponent } from 'react'
import { message } from "antd"

import DrowDownMenu from 'components/common/DrowDownMenu'
import DialogAlert from "components/common/DialogAlert"
import DataTable from 'components/common/DataTable'
import ZTree from 'components/common/Ztree'

import AddEqu from './components/AddEqu'
import AddGroup from './components/AddGroup'
import Search from './components/Search'

import { GetTreeStructure, GetDevice, DeleteDevice, DelGroup } from 'api/variable'


class RealTime extends PureComponent{
  state = {
    treeData: [],
    checkedKeys: [],
    allNodeId: [],
    collasped: false
  }

  componentDidMount() {
    //获取整棵设备列表树结构
    GetTreeStructure().then(res => {
      let allcheck = [];
      res.data.forEach(data => {
        if (data.children.length > 0) {
          data.children.forEach(child => {
            allcheck.push(child.nodeID)
          })
        }
        allcheck.push(data.nodeID)
      })
      console.log(res.data)
      this.setState({treeData: res.data, allNodeId: allcheck})
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
    this.setState({ checkedKeys: this.state.allNodeId }, () => {
      console.log(this.state.allNodeId)
    })
  }
  allUnCheck = () => {
    this.setState({checkedKeys: []})
  }

  onCheck = (checkedKeysValue) => {
    console.log('onCheck',checkedKeysValue)
  }

  render() {
    return (
      <div className="antProPageContainer">
        <div className={ `leftContent ${ this.state.collasped ? 'foldToLeft' : null }` }>
          <div className="fullContain">
            {
              this.state.treeData ?
                <ZTree
                  checkable
                  title="设备列表"
                  nodeDatas={this.state.treeData}
                  zTreeOption={this.zTreeOption()}
                  onCheck={ this.onCheck }
                  checkedKeys={this.state.checkedKeys}
                  // expandedKeys={this.state.checkedKeys}
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
              url='/demo/table/user'
              cols={
                [
                  {field:'id', width:80, title: '变量名'}
                  ,{field:'username', width:80, title: '变量描述'}
                  ,{field:'sex', width:80, title: '数据类型'}
                  ,{field:'city', width:80, title: '变量地址'}
                  ,{field:'sign', title: '变量值', width: '30%', minWidth: 100} 
                  ,{field:'experience', title: '时间戳'}
                ]
               }/>
          </div>
        </div>
      </div>
    )
  }
}

export default RealTime