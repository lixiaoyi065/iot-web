import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'utils/jquery-vendor';   //加载jQuery
import 'ztree';  //加载ztree
import PubSub from "pubsub-js";

import 'ztree/css/zTreeStyle/zTreeStyle.css';
import "components/common/Ztree/index.less"
import "./index.less"

import { stringToArray } from 'utils'

let isOpen = [],
  curDragNodes

class ReactZtree extends PureComponent {
  state = {
    pathname: "",
    isShow: false,
    top: "0px",
    list: [],
    treeNode: {},
    isOpen: stringToArray(localStorage.getItem(`${this.props.location.pathname}`)) || [],
    deviceStatus: []
  }

  componentDidMount() {
    this.setState({
      pathname: this.props.location.pathname
    })
    isOpen = stringToArray(localStorage.getItem(`${this.props.location.pathname}`)) || []
    this.renderZtreeDom();

    PubSub.subscribe("deviceStatus", (msg, data) => {
      this.setState({
        deviceStatus: data
      })
      data.forEach(item => {
        // $(item.id)
        let name = item.status === 1 ? "iot-status-normal" : (item.status === 2 ? "iot-status-danger" : "iot-status-disable")
        $(`.level1[data-id=${item.id}]`).find(".iot-status").addClass(`iot-status ${name}`)
      })
    })

    $(document).click((e) => {
      if (this.state.isShow) {
        this.setState({ isShow: false })
      }
      if (e.target.className === "arrow-menu-item") {
        this.menuClick(e)
      }
    })
  }
  componentDidUpdate() {
    this.renderZtreeDom();
  }
  componentWillUnmount() {
    this.ztreeObj.destroy();
    PubSub.unsubscribe("deviceStatus")
  }
  //数据处理
  dataProcessing() {
    let data = JSON.parse(JSON.stringify(this.props.nodeDatas))
    let parentNode = [{ id: "parent-node", nodeName: "设备树", open: true, childOuter: false, children: [] }]
    data.forEach(element => {
      element.childOuter = false
      element.open = this.state.isOpen && this.state.isOpen.includes(element.nodeID)
    });
    parentNode[0].children = [...data]
    return parentNode
  }
  renderZtreeDom() {
    let ztreeObj = this.ztreeObj = $.fn.zTree.init(this.getTreeDom(), this.getTreeSetting(), this.dataProcessing());
    return ztreeObj;
  }
  getTreeDom() {
    return $(this.refs.ztree);
  }
  getTreeSetting() {
    let props = this.props;
    return {
      treeId: props.treeId,
      treeObj: props.treeObj,
      async: props.async,
      check: props.check,
      view: {
        showLine: false,
        showIcon: false,
        selectedMulti: false,
        dblClickExpand: false,
        addDiyDom: this.addDiyDom
      },
      edit: {
        enable: true,
        drag: {
          autoExpandTrigger: true,
          inner: false,
          prev: this.dropPrev,
          next: this.dropNext
        },
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        key: {
          name: "nodeName"
        },
        simpleDate: {
          enable: true,
          idKey: "nodeID",
          pIdKey: "nodeID"
        }
      },
      callback: {
        onClick: this.onClick,
        beforeDrag: this.beforeDrag,
        onDrop: this.onDrop,
        onExpand: this.onExpand, //展开回调
        onCollapse: this.onCollapse //折叠回调
      }
    }
  }
  onClick = (event, treeId, treeNode) => {
    event.stopPropagation();
    if (event.target.className === "more_option") {
      this.MenuPaneLoad(event, treeId, treeNode);
    } else {
      // if (treeNode.isParent) {
      //   $(`#${treeNode.tId}`).addClass("hover-level").siblings().removeClass("hover-level")
      // } else {
      //   $(".level1").removeClass("hover-level")
      // }
      this.setState({
        isShow: false,
      })
      this.props.onSelect({
        nodeID: treeNode.nodeID,
        nodeType: treeNode.nodeType,
        type: treeNode.nodeType
      });
    }
  }
  MenuPaneLoad = (event, treeId, treeNode) => {
    this.setState({
      isShow: false,
    }, () => {
      let top = parseInt((event.pageY - 120) / 36) * 36 + ((event.pageY - 120) % 36 > 0 ? 36 : 0) + 50
      let list = [
        {
          key: "overallExport",
          name: "整体导出"
        }
      ]
      if (treeNode.nodeType === 2 || treeNode.nodeType === 4) {
        list = [{
          key: "modifyGroup",
          name: "编辑分组",
        },
          {
            key: "delGroup",
            name: "删除分组",
          }]
      }
      if (treeNode.nodeType === 3) {
        list.unshift({
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
          })
      }

      this.setState({
        top: top + "px",
        isShow: true,
        list: list,
        treeNode: treeNode
      })
    })
  }

  menuClick = (e) => {
    let { treeNode } = this.state
    this.props.menuClick(e.target.attributes[0].nodeValue, treeNode, treeNode.children.length)
    this.setState({ isShow: false })
  }

  addDiyDom = (treeId, treeNode) => {
    console.log("------------")
    let status = this.state.deviceStatus
    $("#" + treeNode.tId).attr("data-id", treeNode.nodeID)
    let switchObj = $("#" + treeNode.tId + "_span")
    if (treeNode.nodeType !== 1) {
      let spaceStr = "<span class='more_option'></span>";
      switchObj.after(spaceStr);
    }
    if (treeNode.nodeType === 3 || treeNode.nodeType === 0) {
      
      let statusStr = "<span class='iot-status'></span>";
      switchObj.before(statusStr);
    }
  }
  beforeDrag = (treeId, treeNodes) => {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
      if (treeNodes[i].drag === false) {
        curDragNodes = null;
        return false;
      } else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
        curDragNodes = null;
        return false;
      }
    }
    curDragNodes = treeNodes;
    return true;
  }
  dropPrev(treeId, nodes, targetNode) {
    var pNode = targetNode.getParentNode();
    if (pNode && pNode.dropInner === false) {
      return false;
    } else {
      for (var i = 0, l = curDragNodes.length; i < l; i++) {
        var curPNode = curDragNodes[i].getParentNode();
        if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
          return false;
        }
      }
    }
    return true;
  }
  dropNext(treeId, nodes, targetNode) {
    var pNode = targetNode.getParentNode();
    if (pNode && pNode.dropInner === false) {
      return false;
    } else {
      for (var i = 0, l = curDragNodes.length; i < l; i++) {
        var curPNode = curDragNodes[i].getParentNode();
        if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
          return false;
        }
      }
    }
    return true;
  }

  //拖动结束
  onDrop = (event, treeId, treeNodes, targetNode) => {
    if (targetNode !== null) {
      let childNode = $(`#${targetNode.parentTId}_ul`).children()
      let newNodeIDList = [];
      for (let i = 0; i < childNode.length; i++) {
        newNodeIDList.push(childNode[i].attributes["data-id"].value)
      }
      this.props.submitSortTreeNode({
        nodeId: targetNode.fatherNodeID,
        children: newNodeIDList
      })
    }
  }

  //展开
  onExpand = (event, treeId, treeNode) => {
    isOpen.push(treeNode.nodeID)
    localStorage.setItem(`${this.state.pathname}`, isOpen)
  }
  //折叠
  onCollapse = (event, treeId, treeNode) => {
    isOpen.splice(isOpen.indexOf(treeNode.nodeID), 1)
    localStorage.setItem(`${this.state.pathname}`, isOpen)
  }
  getTreeObj() {
    return this.ztreeObj;
  }
  render() {
    return (
      <>
        <div className="ztree" ref="ztree" id="ztree">
        </div >
        {
          this.state.isShow ? (
            <div className='arrow-menu' style={{ top: this.state.top }}>
              <div className='ant-menu-arrow'></div>
              <ul>
                {
                  this.state.list.map(item => {
                    return <li key={item.key} name={item.key} className="arrow-menu-item">{item.name}</li>
                  })
                }
              </ul>
            </div>
          ) : <></>
        }
      </>
    )
  }
}

export default withRouter(ReactZtree)