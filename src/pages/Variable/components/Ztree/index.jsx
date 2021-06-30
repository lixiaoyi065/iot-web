import React, { Component } from 'react';
import $ from 'utils/jquery-vendor';   //加载jQuery
import 'ztree';  //加载ztree
import 'ztree/css/zTreeStyle/zTreeStyle.css';
import "components/common/Ztree/index.less"

let ztreeIndex = 0;
export default class ReactZtree extends Component {

  componentDidMount() {
    this.renderZtreeDom();
  }
  componentDidUpdate() {
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
      view: props.view,
      edit: {
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
        }
      },
      callback: {
        beforeDrag: this.beforeDrag,
        beforeDrop: this.beforeDrop,
        beforeDragOpen: this.beforeDragOpen,
        onDrag: this.onDrag,
        onDrop: this.onDrop,
        onExpand: this.onExpand
      }
    }
  }
  dropPrev() {

  }
  dropNext() {

  }
  beforeDrag() { }
  beforeDrop() { }
  beforeDragOpen() { }
  onDrag() { }
  onDrop() { }
  onExpand() { }
  getTreeObj() {
    return this.ztreeObj;
  }
  render() {
    return (
      <div className="ztree" ref="ztree" id={`ztree_${ztreeIndex++}`}></div>
    )
  }
}