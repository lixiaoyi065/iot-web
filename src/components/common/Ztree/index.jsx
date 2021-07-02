import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom'
import { Tree, Dropdown } from 'antd';
import PubSub from 'pubsub-js'

import './index.less'

import { stringToArray } from 'utils'

class ZTree extends PureComponent {
  state = {
    nodeDatas: [],
    pathname: "",
    defaultExpandedKeys: [],
    deviceStatus: [],
    selectCallbackFn: function (keys) { },//选中节点 回调函数
  }

  componentDidMount() {
    PubSub.subscribe("deviceStatus", (msg, data) => {
      this.setState({deviceStatus: data})
    })
    this.setState({
      defaultExpandedKeys: stringToArray(localStorage.getItem(`${this.props.location.pathname}`)),
      pathname: this.props.location.pathname,
      ...this.props,
    })
  }

  operationNode = (e, type) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.state.operationNode(type)
  }

  //数据处理
  node = (data) => {
    let nodeStatus = 0;
    this.state.deviceStatus.forEach(item => {
      if (item.id === data.nodeID) {
        nodeStatus = item.status
      }
    })
    const nodeData = {
      key: data.nodeID,
      nodeNo: data.nodeNo,
      fatherNodeID: data.fatherNodeID,
      nodeType: data.nodeType,
      canBeDeleted: data.canBeDeleted,
      children: [],
      nodeStatus: nodeStatus
    }

    //是否需要操作节点
    if (this.props.option) {
      if (data.canBeDeleted) {
        nodeData.title = (<>
          <span className={`iot-status ${nodeData.nodeStatus === 1 ? 'iot-status-normal' : (
            nodeData.nodeStatus === 2 ? 'iot-status-danger' : 'iot-status-disable'
          )}`}></span>
          <span>{data.nodeName}</span>
          <Dropdown trigger={["click"]} overlay={() => {
            return this.props.optionDeviceMenu(data, data.children.length)
          }} placement="bottomCenter" arrow>
            <span className="ant-tree-title-operationNode" onClick={(e) => {
              e.stopPropagation();
            }}></span>
          </Dropdown>
        </>)
      } else {
        nodeData.title = (<>
          <span className={`iot-status`}></span>
          <span>{data.nodeName}</span>
          <Dropdown trigger={["click"]} overlay={() => {
            return this.props.interVariable(data, data.children.length)
          }} placement="bottomCenter" arrow>
            <span className="ant-tree-title-operationNode" onClick={(e) => {
              e.stopPropagation();
            }}></span>
          </Dropdown>
        </>)
      }
    } else {
      nodeData.title = data.nodeName
    }

    if (data.children.length > 0) {
      data.children.map(child => {
        const childNode = {
          key: child.nodeID,
          nodeNo: child.nodeNo,
          fatherNodeID: child.fatherNodeID,
          nodeType: child.nodeType,
          canBeDeleted: child.canBeDeleted
        }

        if (this.props.option) {
          if (child.canBeDeleted) {
            childNode.title = (<>
              <span className="iot-status"></span>
              <span>{child.nodeName}</span>
              <Dropdown trigger={['click']} overlay={() => {
                return this.props.optionGroupMenu({
                  groupId: child.nodeID,
                  name: child.nodeName,
                  deviceId: child.fatherNodeID,
                  type: child.nodeType
                })
              }} placement="bottomCenter" arrow>
                <span className="ant-tree-title-operationNode" onClick={(e) => {
                  e.stopPropagation();
                }}
                ></span>
              </Dropdown>
            </>)
          } else {
            childNode.title = (
              <>
                <span className="iot-status"></span>
                <span>{child.nodeName}</span>
              </>
            )
          }
        } else {
          childNode.title = child.nodeName
        }
        nodeData.children.push(childNode)

        return ""
      })
    }
    return nodeData
  }

  //将数据进行二次处理
  treeData = () => {
    return this.props.nodeDatas.map(el => {
      return this.node(el)
    })
  };

  onSelect = (keys, info) => {
    console.log("onSelect", keys)
    this.state.selectCallbackFn(keys, info);
  };

  onExpand = (e) => {
    // console.log("onExpand", e)
    localStorage.setItem(`${this.state.pathname}`, e)
  };

  render() {
    return (
      <>
        {
          this.props.title ? (
            <div className="title">
              <div className="title-contain">
                <span>{this.props.title}</span>
                {
                  this.props.zTreeOptionDropdown ? <div className="optGroup"> {
                    <Dropdown overlay={this.state.zTreeOptionMenu} trigger={['click']}
                      placement={this.props.zTreeOption.placement} arrow>
                      <div className={this.props.zTreeOption.className}></div>
                    </Dropdown>
                  } </div> : (
                    <div className="optGroup">{this.props.zTreeOption}</div>
                  )
                }
              </div>
            </div>
          ) : null
        }
        {
          this.treeData().length > 0 ? (
            <Tree
              ref="tree"
              blockNode
              draggable
              className={this.props.move ? "moveNode" : ""}
              // autoExpandParent={ true }
              showIcon={false}
              onSelect={this.onSelect}
              onExpand={this.onExpand}
              onCheck={this.props.onCheck}
              treeData={this.treeData()}
              defaultExpandedKeys={this.state.defaultExpandedKeys}
              {...this.props}
            />
          ) : <></>
        }

      </>
    )
  }
};

export default withRouter(ZTree)