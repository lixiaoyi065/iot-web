import React, { PureComponent, createRef } from 'react'
import { CaretRightOutlined } from "@ant-design/icons"
import $ from "jquery"
import './index.less'

import { stringToArray } from "utils"

const moveRef = createRef();
class Tree extends PureComponent {
  state = {
    activeNode: "",
    isOpenList: [],
    moveNodeTop: 0,
    moveNodeContent: "",
    isMove: false, //当前是否移动
    referenceLineTop: 0, //移动参考线初始位置
    moveList: []
  }

  componentDidMount(e) {
    this.setState({
      isOpenList: stringToArray(localStorage.getItem(`${this.props.pathname}`))
    })

    document.addEventListener("mousemove", (e) => {
      if (this.state.isMove) {
        if (e.clientX > 450 || e.clientX < 200 || e.clientY < 70) {
          this.setState({ moveNodeContent: "" })
        }
      }
    })
  }
  componentWillUnmount() {
    localStorage.setItem(`${this.props.pathname}`, this.state.isOpenList)
  }

  isOpen = id => {
    return this.state.isOpenList.includes(id)
  }

  //显示隐藏子节点
  toggleNodeChild = (e, id) => {
    e.stopPropagation();
    this.setState(state => {
      let list = [];
      if (this.isOpen(id)) {
        state.isOpenList.splice(state.isOpenList.indexOf(id), 1)
        list = [...state.isOpenList]
      } else {
        list = [...state.isOpenList, id];
      }
      return {
        isOpenList: list
      }
    })
  }

  nodeStatus = status => {
    return status === 0 ? "syc-tree-node-status syc-status-init" : (
      status === 1 ? "syc-tree-node-status syc-status-off" : "syc-tree-node-status syc-status-on"
    )
  }

  nodeClick = (e, node) => {
    this.setState({ activeNode: node.nodeID })
    if (this.props.onSelect) {
      this.props.onSelect(e, node)
    }
  }

  onMouseDown = (e, ref, item) => {
    e.stopPropagation();
    this.setState({
      moveNodeTop: e.clientY - 70 - 15,
      moveNodeContent: this.refs[ref].parentNode.innerHTML,
      isMove: true,
      referenceLineTop: Math.round((e.clientY - 70) / 37)
    })
    this.setState(state => {
      if (this.isOpen(ref)) {
        state.isOpenList.splice(state.isOpenList.indexOf(ref), 1)
        return {
          isOpenList: [...state.isOpenList]
        }
      }
    })
    this.setState(state => {
      this.props.nodeDatas.map(node => {
        if (node.fatherNodeID === item.fatherNodeID) {
          state.moveList.push(node)
        }
        return
      })
      return {
        moveList: state.moveList
      }
    })
  }
  onMouseMove = (e, ref) => {
    e.stopPropagation();
    if (this.state.isMove) {
      if (e.clientY > 70 && e.clientY < (this.props.nodeDatas.length * 37 + 70)) {
        this.setState({
          referenceLineTop: Math.round((e.clientY - 70) / 37)
        })
      }
    }
  }
  onMouseUp = (e) => {
    this.setState({ moveNodeContent: "" })
    if (this.state.isMove) {
      this.setState({ isMove: false })
      console.log(this.state.referenceLineTop)
    }
  }

  render() {
    let { nodeDatas } = this.props;
    let { activeNode } = this.state;

    return (
      <>
        <div className={`syc-tree-list ${this.state.isMove ? "syc-tree-list-nohover" : ""}`}
          ref={moveRef}
          onMouseMove={(e) => { this.onMouseMove(e, moveRef) }}
          onMouseUp={this.onMouseUp}
        >
          {
            nodeDatas && nodeDatas.length > 0 ? (
              nodeDatas.map(item => {
                return (
                  <div id={item.nodeID}
                    key={item.nodeID}
                  >
                    <div className={`syc-tree-node ${activeNode === item.nodeID ? "syc-tree-activeNode" : ""}`}
                      onClick={(e) => { this.nodeClick(e, item) }}
                      ref={item.nodeID}
                      onMouseDown={(e) => { this.onMouseDown(e, item.nodeID, item) }}
                    >
                      <span className="syc-tree-switcher">
                        {
                          item.children.length > 0 ? (
                            <span onClick={(e) => { this.toggleNodeChild(e, item.nodeID) }}
                              className={`syc-tree-switcher-icon ${this.isOpen(item.nodeID) ? "syc-tree-switcher-icon-open" : ""}`}>
                              <CaretRightOutlined />
                            </span>
                          ) : <></>
                        }
                      </span>
                      <span className="syc-tree-node-name">{item.nodeName}</span>
                      <span className="syc-tree-switcher">
                        <span className="syc-tree-switcher-icon"></span>
                      </span>
                      <span className="syc-tree-switcher">
                        {
                          item.editable ? (
                            <span></span>
                          ) : <></>
                        }
                      </span>
                    </div>
                    {
                      this.isOpen(item.nodeID) && item.children.length > 0 ? (
                        item.children.map(child => {
                          return (
                            <div className={`syc-tree-node ${activeNode === child.nodeID ? "syc-tree-activeNode" : ""}`}
                              onClick={(e) => { this.nodeClick(e, child) }}
                              key={child.nodeID}
                            >
                              <span className="syc-tree-switcher">
                                {
                                  child.children.length > 0 ? (
                                    <span onClick={(e) => { this.toggleNodeChild(e, child.nodeID) }}
                                      className={`syc-tree-switcher-icon ${this.isOpen(child.nodeID) ? "syc-tree-switcher-icon-open" : ""}`}>
                                      <CaretRightOutlined />
                                    </span>
                                  ) : <></>
                                }
                              </span>
                              <span className="syc-tree-switcher">
                                {
                                  child.status ? (
                                    <span className={this.nodeStatus(child.status)}></span>
                                  ) : <></>
                                }
                              </span>
                              <span className="syc-tree-node-name">{child.nodeName}</span>
                            </div>
                          )
                        })
                      ) : <></>
                    }
                  </div>
                )
              })
            ) : <></>
          }
        </div>
        {
          this.state.isMove ? <div className="move-reference" style={{ top: this.state.referenceLineTop * 37 + "px" }}></div> : <></>
        }
        {/* <div id="moveTreeNode" className="moveTreeNode"
          ref={moveRef}
          onMouseMove={(e) => { this.onMouseMove(e, moveRef) }}
          onMouseUp={(e) => { this.onMouseUp(e, moveRef) }}
          style={{ top: moveNodeTop }}
          dangerouslySetInnerHTML={{ __html: moveNodeContent }}>
        </div> */}
      </>
    )
  }
}
export default Tree