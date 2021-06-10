import React, { PureComponent } from 'react'
import { Dropdown, Modal, message } from 'antd'

import DrowDownMenu from 'components/common/DrowDownMenu'
import EditEqu from 'pages/Variable/components/AddEqu'

import store from 'store'

import { delEqu, modifyGroup, delGroup } from 'api/variable'
import { getEquList, getEqu } from 'api/variable/index'

import './index.less'

const storeState = store.getState()
class Ztree extends PureComponent {
  state = {
    zNodes: storeState.zNodes,
    isShowModel: false,
    isShowEqu: false,
    node: {},
  }
  componentDidMount() {
    //获取设备列表
    getEquList().then(res => {
      store.dispatch({
        type: "zNodes",
        data: res.data
      });
    });
    store.subscribe(() => {
      this.setState({ zNodes: store.getState() })
    })
  }
  toogleChildrenList = (e) => {
    console.log(e.target.dataset.close)
  }
  optGroup = (el) => {
    const nodeID = el.nodeID;
    const that = this
    return (
      <DrowDownMenu lists={[
        {
          key: "delGroup",
          name: "删除分组",
          onClick() {
            delGroup({groupId: nodeID}).then(res => {
              console.log(res)
            })
            console.log(nodeID,"删除分组")
          }
        },
        {
          key: "editGroup",
          name: "编辑分组",
          onClick() {
            modifyGroup({groupId: nodeID}).then(res => {
              console.log(res)
            })
            console.log(nodeID,"编辑分组")
          }
        }
      ]}
      >
      </DrowDownMenu>
    )
  }
  eqGroup = (el) => {
    const nodeID = el.nodeID;
    const that = this
    return (
      <DrowDownMenu lists={[
        {
          key: "start",
          name: "启用",
          onClick() {
            message.info("设备已启动")
          }
        },
        {
          key: "stop",
          name: "停止",
          onClick() {
            message.info("设备已停止")
          }
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
          name: "编辑设备",
          onClick(e) {
            getEqu(nodeID).then(res => {
              that.setState({node: res.data}, () => {
                that.setState({isShowEqu: true})
              })
            })
          }
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
    const { title, opt } = this.props;
    const { zNodes } = this.state;
    console.log(zNodes)
    return (
      <div className="fullContain">
        <div className="title">
          <span>{title}</span>
          <div className="optGroup"> {opt} </div>
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
                            <Dropdown overlay={() => {
                              return this.eqGroup(element)
                            } } trigger={['click']} placement="bottomRight" arrow>
                              <span className="more"></span>
                            </Dropdown>
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
                                          <Dropdown overlay={ () => {
                                            return this.optGroup(child)
                                          } } trigger={['click']} placement="bottomRight" arrow>
                                            <span className="more"></span>
                                          </Dropdown>
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
        <EditEqu visible={this.state.isShowEqu} node={ this.state.node } cancel={()=>{ this.setState({isShowEqu: false}) }}/>
      </div>
    )
  }
}

export default Ztree
