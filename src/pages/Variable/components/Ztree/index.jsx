import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'utils/jquery-vendor';   //加载jQuery
import 'ztree';  //加载ztree
import 'ztree/css/zTreeStyle/zTreeStyle.css';
import "components/common/Ztree/index.less"
import "./index.less"

import { stringToArray } from 'utils'

let ztreeIndex = 0,
  isOpen = [],
  curDragNodes
class ReactZtree extends PureComponent {
  state = {
    pathname: "",
    isOpen: stringToArray(localStorage.getItem(`${this.props.location.pathname}`)) || [],
  }

  componentDidMount() {
    this.setState({
      pathname: this.props.location.pathname
    })
    isOpen = stringToArray(localStorage.getItem(`${this.props.location.pathname}`)) || []
    this.renderZtreeDom();

    $(".ztree").bind("click", ".more_option", (e) => {
      this.MenuClick(e)
    })
  }
  componentDidUpdate() {
    console.log("--------------")
    this.renderZtreeDom();
  }
  componentWillUnmount() {
    this.ztreeObj.destroy();
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
      callback: props.events,
      check: props.check,
      data: props.data,
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
        enable: true,
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
    console.log(treeNode.tId)
    if (event.target.className === "more_option") return
    console.log(treeNode)
    if (treeNode.isParent) {
      $(`#${treeNode.tId}`).addClass("hover-level").siblings().removeClass("hover-level")
    } else {
      $(".level1").removeClass("hover-level")
    }
    this.props.onSelect({
      nodeID: treeNode.nodeID,
      nodeType: treeNode.nodeType,
      type: treeNode.nodeType
    });
  }
  addDiyDom = (treeId, treeNode) => {
    var switchObj = $("#" + treeNode.tId + "_span")
    $("#" + treeNode.tId).attr("data-id", treeNode.nodeID)
    var spaceStr = "<span class='more_option'></span>";
    switchObj.after(spaceStr);
  }
  MenuClick = (e) => {
    console.log(e)
    this.props.MenuPaneLoad(e);
  }
  beforeDrag = (treeId, treeNodes) => {
    for (var i=0,l=treeNodes.length; i<l; i++) {
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
      for (var i=0,l=curDragNodes.length; i<l; i++) {
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
      for (var i=0,l=curDragNodes.length; i<l; i++) {
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
      for (let i = 0; i < childNode.length;i++){
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
      <div className="ztree" ref="ztree" id={`ztree_${ztreeIndex++}`}></div>
    )
  }
}

export default withRouter(ReactZtree)