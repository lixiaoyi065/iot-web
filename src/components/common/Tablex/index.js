import React, { useRef, useState, useEffect } from "react";
import Table from "tablex";
import { Input, Form, Select, Button } from 'antd'
import { addressVerify, descVerify, nameVerify, verifyMax, verifyMin } from './verify'
import PubSub from 'pubsub-js'

import './index.less'
const EditableContext = React.createContext(null);
const { Option } = Select;


class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.tableRef = React.createRef()
    this.form = React.createRef()

    const columns = (() => {
      let { activeNodeType } = props
      let columArr = [
        {
          title: '序号',
          dataIndex: 'no',
          width: 50,
          editable: false
        },{
          title: '变量名',
          dataIndex: 'name',
          onCell: (row) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          editor: (value, row, index, onchange, ref) => {
            return (
              <Input
                defaultValue={value}
                ref={this.cellRef}
                onBlur={e => {
                  this.onBlur(e, row, "name")
                }}
                onChange={e =>
                  onchange([
                    { 'column-name': e.target.value, id: row.id},
                    { id: 'name', address: e.target.value },
                  ])
                }
              />
            )
          },
          editable: true,
        }, {
          title: '变量描述',
          dataIndex: 'desc',
          onCell: (row) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          editor: (value, row, index, onchange, ref) => {
            return (
              <Input
                defaultValue={value}
                ref={this.cellRef}
                onBlur={e => {
                  this.onBlur(e, row, "desc")
                }}
                onChange={e =>
                  onchange([
                    { 'column-desc': e.target.value, id: row.id},
                    { id: 'desc', address: e.target.value },
                  ])
                }
              />
            )
          },
          editable: true,
        }, {
          title: '数据类型',
          dataIndex: 'dataType',
          type: "select",
          content: props.tableDataTypes,
          render: (row) => {
            return <div className="testt">{ row }</div>
          },
          onCell: (row) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          editor: (value, row, index, onchange, ref) => {
            return (
              <Select defaultValue={value} onChange={ e=>{this.onChange(e, row, "dataType")}}>
                {
                  this.props.tableDataTypes.map(item=>{
                    return <Select.Option key={item}>{ item }</Select.Option>
                  })
                }
              </Select>
            )
          },
          editable: true,
        }
      ]
      if (activeNodeType === 0 || activeNodeType === 2) {
        //内部变量或者内部变量组
        columArr.push({
          title: '最大值',
          dataIndex: 'max',
          onCell: (row) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          editor: (value, row, index, onchange, ref) => {
            return (
              <Input
                defaultValue={value}
                ref={this.cellRef}
                onBlur={e => {
                  this.onBlur(e, row, "max")
                }}
                onChange={e =>
                  onchange([
                    { 'column-max': e.target.value, id: row.id},
                    { id: 'max', address: e.target.value },
                  ])
                }
              />
            )
          },
          editable: true,
        },
        {
          title: '最小值',
          dataIndex: 'min',
          width: 100,
          onCell: (row) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          editor: (value, row, index, onchange, ref) => {
            return (
              <Input
                defaultValue={value}
                ref={this.cellRef}
                onBlur={e => {
                  this.onBlur(e, row, "min")
                }}
                onChange={e =>
                  onchange([
                    { 'column-min': e.target.value, id: row.id},
                    { id: 'min', address: e.target.value },
                  ])
                }
              />
            )
          },
          editable: true,
        })
      } else if (activeNodeType === 3 || activeNodeType === 4) {
        //设备或者设备变量组
        columArr.push({
          title: '变量地址',
          dataIndex: 'address',
          render: (row, data) => {
            // console.log(row, data)
            return (
              <>
                <div className="editable-cell-input-group">
                  <div className="editable-cell-value-wrap">
                    {row}
                  </div>
                  <Button className="edit-cell-btn" onClick={(event) => { this.props.addressSearch(row, event, row, row['stringLength']) }}>···</Button>
                </div>
              </>
            )
          },
          onCell: (row) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          editor: (value, row, index, onchange, ref) => {
            return (
              <Input.Search id={"address" + row.key} autoComplete='off' enterButton="···" onPressEnter={false}
                defaultValue={value} onBlur={e => {
                  this.onBlur(e, row, "address")
                }}
                onSearch={(val, event) => { this.props.addressSearch(value, event, row, row['stringLength']) }} />
            )
          },
          editable: true,
        },
        {
          title: '字符长度',
          dataIndex: 'stringLength',
          onCell: (row) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          editor: (value, row, index, onchange, ref) => {
            return (
              <Input
                defaultValue={value}
                ref={this.cellRef}
                onBlur={e => {
                  this.onBlur(e, row, "stringLength")
                }}
                onChange={e =>
                  onchange([
                    { 'column-stringLength': e.target.value, id: row.id},
                    { id: 'stringLength', address: e.target.value },
                  ])
                }
              />
            )
          },
          editable: true,
        },
        {
          title: '缩放比',
          dataIndex: 'zoom',
          onCell: (row) => {
            return {
              onClick: () => {
                this.beginEdit(row)
              },
            }
          },
          editor: (value, row, index, onchange, ref) => {
            return (
              <Input
                defaultValue={value}
                ref={this.cellRef}
                onBlur={e => {
                  this.onBlur(e, row, "zoom")
                }}
                onChange={e =>
                  onchange([
                    { 'column-zoom': e.target.value, id: row.id},
                    { id: 'zoom', address: e.target.value },
                  ])
                }
              />
            )
          },
          editable: true,
        })
      }

      return columArr; 
    })()

    this.state = {
      columns: columns,
      loading: false,
      expandedRowKeys: [],
      modified: "",
      reset: false,
      dataSource: []
    }
  }

  beginEdit(row) {
    console.log("-------------------")
    let arr = []
    arr.push(row.key)
    console.log(this.tableRef.current.api)
    this.tableRef.current.api.edit(arr)
    this.setState({
      modified: row.key
    })
  }

  static getDerivedStateFromProps(props, state) {
    state.dataSource = props.dataSource
    return null
  }
  onEditSave(changedRows, newData, type) {
    // console.log('onEditSave:', newData)
    this.setState({
      dataSource: newData,
    })
  }
  componentDidMount() {
    
  }

  // onEditComplete(modified) {
  //   console.log('onEditComplete:', modified)
  // }

  onChange = (e, row, dataIndex) => {
    let val = e
    let { activeNodeType, activeNode } = this.props
    this.setState(state => {
      for (let i = 0; i < state.dataSource.length;i++){
        if (state.dataSource[i].key === row.key) {
          state.dataSource[i][dataIndex] = val
          return
        }
      }
      return {
        dataSource: state.dataSource
      }
    })
  }

  //失去焦点事件
  onBlur = async (e, row, dataIndex) => {
    let val = e.target.value, isAddress = false
    let { activeNodeType, activeNode } = this.props
    //修改编辑信息
    this.setState(state => {
      for (let i = 0; i < state.dataSource.length;i++){
        if (state.dataSource[i].key === row.key) {
          state.dataSource[i][dataIndex] = val
          return
        }
      }
      return {
        dataSource: state.dataSource
      }
    })
    if (dataIndex === "name") {
      nameVerify(val, this.state.dataSource, row, dataIndex, activeNodeType)
    } else if (dataIndex === "address") { //变量地址校验
      row[dataIndex] = val
      await addressVerify(val, {
        nodeId: activeNode,
        type: activeNodeType,
        dataType: row.dataType,
        address: val,
        length: row.stringLength
      }).then(res => {
        if (res === false) {
          e.target.value = ''
          isAddress = true
        }
      })
    } else if (dataIndex === "desc") {
      descVerify(val)
    } else if (dataIndex === "min") {
      verifyMin(val, row.dataType)
    } else if (dataIndex === "max") {
      verifyMax(val, row.dataType)
    }

    //完成编辑，将input渲染成div
    this.tableRef.current.api.completeEdit()
    console.log(this)
    // this.props.handleSave(dataIndex, val, row);
  }

  //复选框事件
  onSelectChange(rowArr) {
    this.props.onSelectChange(rowArr)
  }

  EditableRow = (row) => {
    let { rowProps } = row

    return (
      <Form ref={this.form} className={rowProps.className} style={rowProps.style}>
        { rowProps.children }
      </Form>
    )
  };

  render() {
    let { columns, dataSource } = this.state
    const components = {
      row: this.EditableRow
    }
   
    return (
      <>
        <div className="table-contain">
          <Table rowKey="id" 
            ref={this.tableRef}
            columns={columns}
            rowHeight={43}
            data={dataSource} 
            rowSelection={{
              type: 'checkbox',
              checkOnSelect: true,
              selectOnCheck: true,
            }}
            components={components}
            isAppend={true}
            // editAll={true}
            editorNoBorder={true} 
            allowSaveEmpty={true}
            alwaysValidate={false}
            validateTrigger="onChange"
            editable={true}
            editTools={[]}
            selectOnRowClick={false}
            onSelectChange={this.onSelectChange.bind(this)}
            orderNumber={false} />
        </div>
        <div className="paging">
          {
            <>
              {
                dataSource && (this.props.count - dataSource.length) > 0 && this.props.count - dataSource.length > 0 ? (
                  <label className="load-more" onClick={this.props.loadMore}>
                    <span>...加载更多</span>
                    <span style={{ color: '#999' }}>(剩余{this.props.count - dataSource.length}条数据)</span>
                  </label>) : <></>
              }
              <label style={{ float: 'right', color: '#666', 'paddingRight': '20px' }}>
                <span>总条数：</span>
                <span>{this.props.count}</span>
              </label>
            </>
          }
        </div>
      </>
    )
  }
}
export default Demo