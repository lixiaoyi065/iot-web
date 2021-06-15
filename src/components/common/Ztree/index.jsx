import React, { PureComponent } from 'react';
import { Tree, Dropdown } from 'antd';

import './index.less'

const { DirectoryTree } = Tree;

class ZTree extends PureComponent {
  state = {
    nodeDatas: [],
    selectCallbackFn: function (keys) { },//选中节点 回调函数
  }

  componentDidMount() {
    this.setState({
      ...this.props
    })
    //将数据进行二次处理
  }

  operationNode = (e, type) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.state.operationNode(type)
  }

  //数据处理
  node = (data) => {
    const nodeData = {
      key: data.nodeID,
      nodeNo: data.nodeNo,
      fatherNodeID: data.fatherNodeID,
      nodeType: data.nodeType,
      canBeDeleted: data.canBeDeleted,
      children: []
    }

    //是否需要操作节点
    if (this.props.option) {
      if (data.canBeDeleted) {
        nodeData.title = (<>
          <span>{data.nodeName}</span>
          <Dropdown overlay={() => { return this.props.optionDeviceMenu(data.nodeID, data.children.length) }} placement="bottomCenter" arrow>
            <span className="ant-tree-title-operationNode"></span>
          </Dropdown>
        </>)
      } else {
        nodeData.title = data.nodeName
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
              <span>{child.nodeName}</span>
              <Dropdown overlay={() => {
                return this.props.optionGroupMenu({
                  groupId: child.nodeID,
                  name: child.nodeName,
                  deviceId: child.fatherNodeID,
                  type: child.nodeType
                })
              }} placement="bottomCenter" arrow>
                <span className="ant-tree-title-operationNode"></span>
              </Dropdown>
            </>)
          } else {
            childNode.title = child.nodeName
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
    if (info.node.nodeType === 4) {
      console.log('选中节点', keys, info);
      this.state.selectCallbackFn(keys, info.nodeType);
    }
  };

  onExpand = (e) => {
    console.log('展开节点',e);
  };

  render() {
    return (
      <>
        {
          this.props.title ? (
            <div className="title">
              <span>{this.props.title}</span>
              {
                this.props.zTreeOptionDropdown ? <div className="optGroup"> {
                  <Dropdown overlay={this.state.zTreeOptionMenu} placement={this.props.zTreeOption.placement} arrow>
                    <div className={this.props.zTreeOption.className}></div>
                  </Dropdown>
                } </div> : (
                  <div className="optGroup">{ this.props.zTreeOption }</div>
                )
              }
            </div>
          ) : null
        }

        <DirectoryTree
          className={ this.props.move ? "moveNode": "" }
          showIcon={false}
          autoExpandParent={true}
          onSelect={this.onSelect}
          onExpand={this.onExpand}
          treeData={this.treeData()}
          {...this.props}
        />
      </>
    )
  }
};

export default ZTree