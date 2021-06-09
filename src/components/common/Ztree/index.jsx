import React, { PureComponent } from 'react'
import { Dropdown, Modal, message } from 'antd'

import DrowDownMenu from 'components/common/DrowDownMenu'

import store from 'store'

import { delEqu } from 'api/variable'

import './index.less'

class Ztree extends PureComponent {
  state = {
    isShowModel: false
  }
  componentDidMount() {
    var setting = {
      view: {
        showIcon: false,
        showLine: false, //不显示连接线
        fontCss: { color: "#666", "font-size": '16px' }
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      async: {
        enable: true,
      }
    };
    Object.assign(setting, this.props.setting)
    // $.fn.zTree.init($("#tree"), setting, this.props.zNodes);
  }
  toogleChildrenList = (e) => {
    console.log(e.target.dataset.close)
  }
  optGroup = (
    <DrowDownMenu lists={[
      {
        key: "delGroup",
        name: "删除分组"
      },
      {
        key: "editGroup",
        name: "编辑分组"
      }
    ]}
    >
    </DrowDownMenu>
  )
  eqGroup = (el) => {
    const nodeID = el.nodeID;
    const that = this
    return (
      <DrowDownMenu lists={[
        {
          key: "start",
          name: "启用"
        },
        {
          key: "stop",
          name: "停止"
        },
        {
          key: "delEqu",
          name: "删除设备",
          onClick(e) {
            if (el.children.length>0) {
              that.setState({isShowModel: true})
            } else {
              that.delGroup(nodeID)
              //更新store中的数据

            }
          }
        },
        {
          key: "editEqu",
          name: "编辑设备"
        }
      ]}
      >
      </DrowDownMenu>
    )
  }

  delGroup = (nodeID) => {
    delEqu(nodeID).then(res=>{
      const { code, msg } = res
      if (code===0) {
        message.info("删除成功！")
        store.dispatch({
          type: "delNodes",
          data: nodeID
        })
      } else {
        message.error(msg)
      }
    })
  }

  handleOk = (nodeID) => {
    // this.delGroup(nodeID)
    this.setState({isShowModel: false})
  }

  handleCancel = () => {
    this.setState({isShowModel: false})
  }

  render() {
    const zNodes = this.props.zNodes;
    return (
      <div className="fullContain">
        <div className="title">
          <span>{this.props.title}</span>
          <div className="optGroup">
            {this.props.opt}
          </div>
        </div>
        {
          zNodes && zNodes.length>0 ? <ul className="ztree">
            {
              zNodes.map(element => {
                return (
                  <>
                    <li key={ element.nodeID }>
                      <div className="ztree-list-item">
                        <span className="switch">
                          {
                            element.children && element.children.length ? (
                              <span className='noline_open' data-close="true" onClick={this.toogleChildrenList}></span>
                            ) : null
                          }
                        </span>
                        <span className="name">{element.nodeName}</span>
                        {
                          element.canBeDeleted ? (
                            // parseInt(element.nodeType) === 3 ? (
                              <Dropdown overlay={() => {
                                return this.eqGroup(element)
                              } } trigger={['click']} placement="bottomRight" arrow>
                                <span className="more"></span>
                              </Dropdown>
                            // ) : (
                            //   parseInt(element.nodeType) === 4 ? (
                            //     <Dropdown overlay={ () => {
                            //       return this.eqGroup(element)
                            //     } } trigger={['click']} placement="bottomRight" arrow>
                            //       <span className="more"></span>
                            //     </Dropdown>
                            //   ) : null
                            // )
                          ) : null
                        }
                        
                      </div>
                      {
                        element.children && element.children.length ? (
                          <ul>
                            {
                              element.children.map(child => {
                                return (
                                  <li key={ child.nodeID }>
                                    <div className="ztree-list-item">
                                      <span className="switch">
                                        {
                                          child.children && child.children.length ? (
                                            <span className="noline_close" data-close="true" onClick={this.toogleChildrenList}></span>
                                          ) : null
                                        }
                                      </span>
                                      <span className="name">{child.nodeName}</span>
                                      {
                                        child.canBeDeleted ? (
                                          // parseInt(child.nodeType) === 3 ? (
                                          //   <Dropdown overlay={ () => {
                                          //     return this.eqGroup(child)
                                          //   } } trigger={['click']} placement="bottomRight" arrow>
                                          //     <span className="more"></span>
                                          //   </Dropdown>
                                          // ) : (
                                            // parseInt(child.nodeType) === 4 ? (
                                              <Dropdown overlay={ () => {
                                                return this.eqGroup(child)
                                              } } trigger={['click']} placement="bottomRight" arrow>
                                                <span className="more"></span>
                                              </Dropdown>
                                          //   ) : null
                                          // )
                                        ) : null
                                      }
                                    </div>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        ) : null
                      }
                    </li>
                    <Modal title="提示" visible={this.state.isShowModel} okText="继续" cancelText="取消" onOk={this.handleOk} onCancel={this.handleCancel}>
                      <div>节点下有变量存在，删除将会跟随设备/分组一起删除，无法恢复，是否继续？</div>
                    </Modal>
                  </>
                )
              })
            }
          </ul> : ""
        }
      </div>
    )
  }
}

export default Ztree
