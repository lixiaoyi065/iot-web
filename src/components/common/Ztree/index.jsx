import React, { PureComponent } from 'react'
import { Dropdown, Modal } from 'antd'

import DrowDownMenu from 'components/common/DrowDownMenu'
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
  menuClick = () => {
    console.log("-----")
  }
  eqGroup = (
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
        name: "删除设备"
      },
      {
        key: "editEqu",
        name: "编辑设备"
      }
    ]}
    >
    </DrowDownMenu>
  )

  delGroup = () => {
    console.log("删除分组")
    this.setState({isShowModel: true})
  }
  addGroup = () => {
    
  }
  startEqu = () => {
    
  }
  stopEqu = () => {
    
  }
  delEqu = () => {
    
  }
  editEqu = () => {
    
  }
  handleOk = () => {
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
          zNodes ? <ul className="ztree">
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
                            parseInt(element.nodeType) === 3 ? (
                              <Dropdown overlay={ this.eqGroup } trigger={['click']} placement="bottomRight" arrow menuClick={ ()=>{this.menuClick()} }>
                                <span className="more"></span>
                              </Dropdown>
                            ) : (
                              parseInt(element.nodeType) === 4 ? (
                                <Dropdown overlay={ this.optGroup } trigger={['click']} placement="bottomRight" arrow menuClick={ ()=>{this.menuClick()} }>
                                  <span className="more"></span>
                                </Dropdown>
                              ) : null
                            )
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
                                          parseInt(child.nodeType) === 3 ? (
                                            <Dropdown overlay={this.eqGroup} trigger={['click']} placement="bottomRight" arrow menuClick={ ()=>{this.menuClick()} }>
                                              <span className="more"></span>
                                            </Dropdown>
                                          ) : (
                                            parseInt(child.nodeType) === 4 ? (
                                              <Dropdown overlay={ this.optGroup } trigger={['click']} placement="bottomRight" arrow menuClick={ ()=>{this.menuClick()} }>
                                                <span className="more"></span>
                                              </Dropdown>
                                            ) : null
                                          )
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
                    <Modal title="Basic Modal" visible={this.state.isShowModel} onOk={this.handleOk} onCancel={this.handleCancel}>
                      <p>Some contents...</p>
                      <p>Some contents...</p>
                      <p>Some contents...</p>
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
