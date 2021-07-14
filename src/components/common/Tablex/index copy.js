import React, {useContext, useRef, useState, useEffect} from "react";
import Table from "tablex";
import { Input, Form, Select, Button } from 'antd'

import './index.less'

import { addressVerify, descVerify, nameVerify, verifyMax, verifyMin } from './verify'

const EditableContext = React.createContext(null);
const { Option } = Select;

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} >
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  dataSource,
  gist,
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  addressSearch,
  type,
  tableDataTypes,
  changeTags,
  activeNode,
  activeNodeType,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing && type !== "select") {
      inputRef.current.focus();
    }
  }, [editing]);

  const checkIsSame = (val) => {
    let isSame = true
    if (dataIndex && record.editable) {
      if (gist.length === 0) {
        return isSame = true;
      } else {
        for (let i = 0; i < gist.length; i++) {
          if (gist[i].key === record.key) {
            return isSame = gist[i][dataIndex] !== val
          }
        }
      }
    }
    return isSame
  }

  const toggleEdits = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  }

  const check = async (e) => {
    let val = e.target.value;
    let isAddress = false
    try {
      toggleEdits()
      if (dataIndex === "name") {
        nameVerify(val, dataSource, record, dataIndex, activeNodeType)
      } else if (dataIndex === "address") { //变量地址校验
        record[dataIndex] = val
        await addressVerify(val, {
          nodeId: activeNode,
          type: activeNodeType,
          dataType: record.dataType,
          address: val,
          length: record.stringLength
        }).then(res => {
          if (res === false) {
            e.target.value = ''
            isAddress = true
          }
        })
      } else if (dataIndex === "desc") {
        descVerify(val)
      } else if (dataIndex === "min") {
        verifyMin(val, record.dataType)
      } else if (dataIndex === "max") {
        verifyMax(val, record.dataType)
      }
      record[dataIndex] = e.target.value
      handleSave(dataIndex, val, record, checkIsSame(val), isAddress)
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const selectChange = (e, id) => {
    try {
      record[dataIndex] = e
      if (Number(activeNodeType) === 2 || Number(activeNodeType) === 0 ) {
        let types = ['二进制变量', '日期', '时间', '日期时间', '字符串']
        if (types.includes(e)) {
          record['min'] = ''
          record['max'] = ''
        }
        if (e === '有符号8位整型') {
          record['min'] = '-128'
          record['max'] = '127'
        }
        if (e === '无符号8位整型') {
          record['min'] = '0'
          record['max'] = '255'
        }
        if (e === '有符号16位整型') {
          record['min'] = '-32768'
          record['max'] = '32767'
        } 
        if (e === '无符号16位整型') {
          record['min'] = '0'
          record['max'] = '65535'
        } 
        if (e === '有符号32位整型') {
          record['min'] = '-2147483648'
          record['max'] = '2147483647'
        } 
        if (e === '无符号32位整型') {
          record['min'] = '0'
          record['max'] = '4294967295'
        } 
        if (e === '有符号64位整型') {
          record['min'] = '-9223372036854775808'
          record['max'] = '9223372036854775807'
        } 
        if (e === '无符号64位整型') {
          record['min'] = '0'
          record['max'] = '18446744073709551615'
        } 
        if (e === 'F32位浮点数IEEE754') {
          record['min'] = '-3.402823E+38'
          record['max'] = '3.402823E+38'
        } 
        if (e === 'F64位浮点数IEEE754') {
          record['min'] = '-1.7976931348623157E+308'
          record['max'] = '1.7976931348623157E+308'
        } 
      }
      toggleEdits()
      handleSave(dataIndex, e, record, checkIsSame(e), false, Number(activeNodeType));
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  }

  let childNode = children;

  if (record && record.editable) {
    childNode = record && record[dataIndex]

    childNode = editing ? (
      type === "select" ? (
        <Form.Item name={dataIndex} initialValue={record[dataIndex] || tableDataTypes[0]} >
          <Select onChange={(e) => selectChange(e, dataIndex + record.key)} id={dataIndex + record.key}>
            {
              tableDataTypes.map((el, idx) => {
                return <Option value={el} key={el + idx}>{el}</Option>
              })
            }
          </Select>
        </Form.Item>
      ) : (type === "input-group" ? (
        <Form.Item name={dataIndex} initialValue={record[dataIndex]}>
          <Input.Search ref={inputRef} id={dataIndex + record.key} onBlur={check} autoComplete='off' enterButton="···" onPressEnter={false}
            onSearch={(value, event) => { addressSearch(value, event, record, record['stringLength']) }} />
        </Form.Item>
      ) : (
        <Form.Item name={dataIndex} initialValue={record[dataIndex]}>
          {
            dataIndex === "min" || dataIndex === "max" ? <Input ref={inputRef} min="0" type="number" id={dataIndex + record.key} onBlur={check} autoComplete='off' />
              : <Input ref={inputRef} id={dataIndex + record.key} onBlur={check} autoComplete='off' />
          }
        </Form.Item>
      ))
    ) : (
      type === "input-group" ?
        <div className="editable-cell-input-group">
          <div
            className="editable-cell-value-wrap"
            onClick={toggleEdits} id={record.key}
          >
            {childNode}
          </div>
          <Button className="edit-cell-btn" onClick={(event) => { addressSearch(record[dataIndex], event, record, record['stringLength']) }}>···</Button>
        </div> : <div id={record.key}
          className="editable-cell-value-wrap"
          onClick={toggleEdits}
        >
          {childNode}
        </div>
    )
  }

  return <td {...restProps} title={record && record[dataIndex]} key={record && (dataIndex + record.key)} id={record && dataIndex + record.key}
   className={`ant-table-cell ant-table-cell-ellipsis ${record && record.editable ? "editable" : ""}  ${checkIsSame(record && record[dataIndex]) ? "effective-editor" : ""}
    `}>{childNode}</td>;
};

class Demo extends React.Component {
  constructor(props){
    super(props)
    this.tableRef = React.createRef()
    this.cellRef = React.createRef()
    const columns = (() => {
      let {activeNodeType} = props
      let columArr = [
        {
          title: '序号',
          dataIndex: 'no',
          width: 50,
          editable: false
        },{
          title: '变量名',
          dataIndex: 'name',
          // onCell: (row) => {
          //   return {
          //     onClick: () => {
          //       this.beginEdit(row)
          //     },
          //   }
          // },
          // editor: (value, row, index, onchange, ref) => {
          //   return (
          //     <Input
          //       defaultValue={value}
          //       ref={this.cellRef}
          //       onBlur={e => {
          //         this.onBlur(e, row, "name")
          //       }}
          //       onChange={e =>
          //         onchange([
          //           { 'column-name': e.target.value, id: row.id},
          //           { id: 'name', address: e.target.value },
          //         ])
          //       }
          //     />
          //   )
          // },
          editable: true,
        }, {
          title: '变量描述',
          dataIndex: 'desc',
          // onCell: (row) => {
          //   return {
          //     onClick: () => {
          //       this.beginEdit(row)
          //     },
          //   }
          // },
          // editor: (value, row, index, onchange, ref) => {
          //   return (
          //     <Input
          //       defaultValue={value}
          //       ref={this.cellRef}
          //       onBlur={e => {
          //         this.onBlur(e, row, "desc")
          //       }}
          //       onChange={e =>
          //         onchange([
          //           { 'column-desc': e.target.value, id: row.id},
          //           { id: 'desc', address: e.target.value },
          //         ])
          //       }
          //     />
          //   )
          // },
          editable: true,
        }, {
          title: '数据类型',
          dataIndex: 'dataType',
          type: "select",
          content: props.tableDataTypes,
          // onCell: (row) => {
          //   return {
          //     onClick: () => {
          //       this.beginEdit(row)
          //     },
          //   }
          // },
          // editor: (value, row, index, onchange, ref) => {
          //   return (
          //     <Select defaultValue={value}>
          //       {
          //         this.props.tableDataTypes.map(item=>{
          //           return <Select.Option key={item}>{ item }</Select.Option>
          //         })
          //       }
          //     </Select>
          //   )
          // },
          editable: true,
        }
      ]
      if (activeNodeType === 0 || activeNodeType === 2) {
        //内部变量或者内部变量组
        columArr.push({
          title: '最大值',
          dataIndex: 'max',
          // onCell: (row) => {
          //   return {
          //     onClick: () => {
          //       this.beginEdit(row)
          //     },
          //   }
          // },
          // editor: (value, row, index, onchange, ref) => {
          //   return (
          //     <Input
          //       defaultValue={value}
          //       ref={this.cellRef}
          //       onBlur={e => {
          //         this.onBlur(e, row, "max")
          //       }}
          //       onChange={e =>
          //         onchange([
          //           { 'column-max': e.target.value, id: row.id},
          //           { id: 'max', address: e.target.value },
          //         ])
          //       }
          //     />
          //   )
          // },
          editable: true,
        },
        {
          title: '最小值',
          dataIndex: 'min',
          width: 100,
          // onCell: (row) => {
          //   return {
          //     onClick: () => {
          //       this.beginEdit(row)
          //     },
          //   }
          // },
          // editor: (value, row, index, onchange, ref) => {
          //   return (
          //     <Input
          //       defaultValue={value}
          //       ref={this.cellRef}
          //       onBlur={e => {
          //         this.onBlur(e, row, "min")
          //       }}
          //       onChange={e =>
          //         onchange([
          //           { 'column-min': e.target.value, id: row.id},
          //           { id: 'min', address: e.target.value },
          //         ])
          //       }
          //     />
          //   )
          // },
          editable: true,
        })
      } else if (activeNodeType === 3 || activeNodeType === 4) {
        //设备或者设备变量组
        columArr.push({
          title: '变量地址',
          dataIndex: 'address',
          editable: true,
        },
        {
          title: '字符长度',
          dataIndex: 'stringLength',
          editable: true,
        },
        {
          title: '缩放比',
          dataIndex: 'zoom',
          editable: true,
        })
      }
  
      return columArr; 
    })()
    console.log(columns)
    this.state = {
      data: [],
      columns: columns,
      loading: false,
      expandedRowKeys: [],
      modified: "",
      dataSource: []
    }
  }

  beginEdit(row) {
    let arr = []
    arr.push(row.key)
    console.log(this.tableRef.current.api)
    this.tableRef.current.api.editRows(arr)
    this.setState({
      modified: row.key
    })
  }

  //复选框事件
  onSelectChange(rowArr) {
    this.props.onSelectChange(rowArr)
  }

  componentDidMount(){
    window.onClick = (e)=>{
      this.onEditComplete(this.state.modified)
    }
  }

  static getDerivedStateFromProps(props, state) {
    state.dataSource = props.dataSource
    return null
  }

  onEditComplete(modified) {
    console.log('onEditComplete:', modified)
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
    // this.tableRef.current.api.completeEdit()
    // this.props.handleSave(dataIndex, val, row);
  }
  
  render() {
    let { columns, dataSource } = this.state
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
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