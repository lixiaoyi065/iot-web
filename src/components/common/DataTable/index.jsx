import React, { useContext, useRef, useState, useEffect } from 'react';
import { Table, Input, Form, Select, Button } from 'antd';
import { Resizable } from 'react-resizable';
import ResizeObserver from 'rc-resize-observer';
// import { debounce } from "lodash";
import PubSub from 'pubsub-js'
import "./index.less"

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
const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
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

class EditableTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.timeout = null;
    this.state = {
      height: 0,
      dataSource: [],
      gist: [],
      changeTags: false,
      columns: this.props.columns,
      tableWidth: 0,
      tableHeight: 0,
      preTime: props.preTime,
    };
  }

  componentDidMount() {
    this.setState({ gist: this.props.gist })
    // setTimeout(() => {
    //   this.setState({ height: this.ref.current ? this.ref.current.getBoundingClientRect().height - 50 : 400 })
    // })
    PubSub.subscribe("changeTags", (msg, data) => {
      this.setState({ changeTags: data })
    })
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return false 
  // }

  componentWillUnmount() {
    PubSub.unsubscribe("changeTags")
  }

  static getDerivedStateFromProps(props, state) {
    state.dataSource = props.dataSource
    return null
  }

  handleSave = (dataIndex, val, row, flag = true, isAddress= false, nodeType) => {
    /*  
      nodeType： 内部变量 2 选择数据类型需要展示最大值和最小值
     */
    this.setState(state => {
      for (let i = 0; i < state.dataSource.length; i++) {
        if (state.dataSource[i].key === row.key) {
          if (nodeType === 2 || nodeType === 0) {
            let min = document.querySelector(`#min${row.key} div`)
            let max = document.querySelector(`#max${row.key} div`)
            min.parentElement.classList.add('effective-editor')
            max.parentElement.classList.add('effective-editor')

            let types = ['二进制变量', '日期', '时间', '日期时间', '字符串']
            if (types.includes(state.dataSource[i].dataType)) {
              state.dataSource[i].min = ''
              state.dataSource[i].max = ''
              min.innerHTML = ''
              max.innerHTML = ''
            }
            if (state.dataSource[i].dataType === '有符号8位整型') {
              state.dataSource[i].min = '-128'
              state.dataSource[i].max = '127'
              min.innerHTML = '-128'
              max.innerHTML = '127'
            }
            if (state.dataSource[i].dataType === '无符号8位整型') {
              state.dataSource[i].min = '0'
              state.dataSource[i].max = '255'
              min.innerHTML = '0'
              max.innerHTML = '255'
            }
            if (state.dataSource[i].dataType === '有符号16位整型') {
              state.dataSource[i].min = '-32768'
              state.dataSource[i].max = '32767'
              min.innerHTML = '-32768'
              max.innerHTML = '32767'
            }
            if (state.dataSource[i].dataType === '无符号16位整型') {
              state.dataSource[i].min = '0'
              state.dataSource[i].max = '65535'
              min.innerHTML = '0'
              max.innerHTML = '65535'
            }
            if (state.dataSource[i].dataType === '有符号32位整型') {
              state.dataSource[i].min = '-2147483648'
              state.dataSource[i].max = '2147483647'
              min.innerHTML = '-2147483648'
              max.innerHTML = '2147483647'
            }
            if (state.dataSource[i].dataType === '无符号32位整型') {
              state.dataSource[i].min = '0'
              state.dataSource[i].max = '4294967295'
              min.innerHTML = '0'
              max.innerHTML = '4294967295'
            }
            if (state.dataSource[i].dataType === '有符号64位整型') {
              state.dataSource[i].min = '-9223372036854775808'
              state.dataSource[i].max = '9223372036854775807'
              min.innerHTML = '-9223372036854775808'
              max.innerHTML = '9223372036854775807'
            }
            if (state.dataSource[i].dataType === '无符号64位整型') {
              state.dataSource[i].min = '0'
              state.dataSource[i].max = '18446744073709551615'
              min.innerHTML = '0'
              max.innerHTML = '18446744073709551615'
            }
            if (state.dataSource[i].dataType === 'F32位浮点数IEEE754') {
              state.dataSource[i].min = '-3.402823E+38'
              state.dataSource[i].max = '3.402823E+38'
              min.innerHTML = '-3.402823E+38'
              max.innerHTML = '3.402823E+38'
            }
            if (state.dataSource[i].dataType === 'F64位浮点数IEEE754') {
              state.dataSource[i].min = '-1.7976931348623157E+308'
              state.dataSource[i].max = '1.7976931348623157E+308'
              min.innerHTML = '-1.7976931348623157E+308'
              max.innerHTML = '1.7976931348623157E+308'
            }
          }
          Object.assign(state.dataSource[i], row)
          return
        }
      }
      return {
        dataSource: JSON.parse(JSON.stringify(state.dataSource))
      }
    })

    this.props.handleSave(dataIndex, val, row, flag, isAddress);
  };
  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      header: {
        cell: ResizeableTitle,
      },
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map((col, index) => {
      if (!col.editable) {
        return {
          ...col,
          onHeaderCell: column => ({
            width: column.width,
            onResize: this.handleResize(index),
          })
        };
      }
      return {
        ...col,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
        onCell: (record) => ({
          dataSource: dataSource,
          gist: this.props.gist,
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          type: col.type,
          activeNode: this.props.activeNode,
          activeNodeType: this.props.activeNodeType,
          content: col.content,
          changeTags: this.state.changeTags,
          handleSave: this.handleSave,
          tableDataTypes: this.props.tableDataTypes,
          addressSearch: this.props.addressSearch
        }),
      };
    });
    return (
      <>
        <div className="table-contain" ref={this.ref}>
          <ResizeObserver
            onResize={({ width, height }) => {
              this.setState({ tableWidth: width, tableHeight: height - 43 })
            }}
          >
          <Table
            rowSelection={this.props.rowSelection}
            components={components}
            rowClassName={() => 'editable-row'}
            dataSource={dataSource}
            columns={columns}
            loading={this.props.loading}
            pagination={false} scroll={{ y: this.state.tableHeight }}
            />
          </ResizeObserver>
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
    );
  }
}

export default EditableTable