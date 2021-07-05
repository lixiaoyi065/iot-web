import React, { useContext, useRef, useState, useEffect } from 'react';
import { Table, Input, Form, Select,Button } from 'antd';
import { Resizable } from 'react-resizable';
import PubSub from 'pubsub-js'
import "./index.less"

import { isFit } from 'utils'
import { addressVerify, descVerify, nameVerify } from './verify'

const EditableContext = React.createContext(null);
const { Option } = Select;

let modifyTags = [];
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
    let gistIndex = dataSource && dataSource.indexOf(record);
    let isSame = true

    if (dataIndex && record.editable) {
      isSame = gistIndex >= gist.length ? false : (
        val === gist[gistIndex][dataIndex]
      )
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
    try {
      toggleEdits()
      if (dataIndex === "name") {
        nameVerify(val, dataSource, record, dataIndex, activeNodeType)
      } else if (dataIndex === "address") { //变量地址校验
        addressVerify(val, {
          nodeId: activeNode,
          type: activeNodeType,
          dataType: record.dataType,
          address: val,
          length: record.stringLength
        })
      } else if (dataIndex === "desc") {
        descVerify(val)
      }
      record[dataIndex] = e.target.value
      handleSave(dataIndex, val, record, checkIsSame(val))
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const selectChange = (e, id) => {
    try {
      toggleEdits()
      record[dataIndex] = e
      handleSave(dataIndex, e, record, false);
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
          <Input.Search ref={inputRef} id={dataIndex + record.key} onBlur={check} autoComplete='off' enterButton="···"
            onSearch={(value, event) => { addressSearch(value, event, record) }} />
        </Form.Item>
      ) : (
        <Form.Item name={dataIndex} initialValue={record[dataIndex]}>
          <Input ref={inputRef} id={dataIndex + record.key} onBlur={check} autoComplete='off' />
        </Form.Item>
      ))
    ) : (
      type === "input-group" ? 
        <div className="editable-cell-input-group">
          <div
            className="editable-cell-value-wrap"
            onClick={toggleEdits}
          >
            {childNode}
          </div>
          <Button className="edit-cell-btn" onClick={(event) => { addressSearch(record[dataIndex], event, record) }}>···</Button>  
        </div> : <div
        className="editable-cell-value-wrap"
        onClick={toggleEdits}
      >
        {childNode}
      </div>
    )
  }

  return <td {...restProps} title={record && record[dataIndex]}
    className={`ant-table-cell ant-table-cell-ellipsis ${record && record.editable ? "editable" : ""}
      ${!checkIsSame(record && record[dataIndex]) ? "effective-editor" : ""}
    `}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      height: 0,
      dataSource: [],
      gist: [],
      changeTags: false,
      columns: this.props.columns
    };
  }

  componentDidMount() {
    this.setState({ gist: this.props.gist })
    setTimeout(() => {
      this.setState({ height: this.ref.current ? this.ref.current.getBoundingClientRect().height - 50 : 400 })
    })
    PubSub.subscribe("changeTags", (msg, data) => {
      this.setState({ changeTags: data })
    })
  }

  componentWillUnmount() {
    PubSub.unsubscribe("changeTags")
  }

  static getDerivedStateFromProps(props, state) {
    state.dataSource = props.dataSource
    return null
  }

  handleSave = (dataIndex, val, row, flag = true) => {
    console.log(row)
    this.setState(state => {
      for (let i = 0; i < state.dataSource.length; i++) {
        if (state.dataSource[i].key === row.key) {
          Object.assign(state.dataSource[i], row)
          return
        }
      }
      return {
        dataSource: state.dataSource
      }
    })

    /**
     * 1、判断在modifyTags中存在，
     * 2、存在判断 新、旧（gist中对比）对象是否有一致，一致则在modifyTags中移除该对象
     * 3、不存在在加入
     */
    let index = -1;
    //判断是否已经存在
    let isHas = modifyTags.some((item, i) => {
      if (item.key === row.key) {
        index = i;
        return true
      } else {
        index = -1;
        return false
      }
    })
    console.log(isHas,flag)

    if (isHas) {
      if (isFit(this.props.gist, row)) {//新旧对象一致,modifyTags移除该对象
        modifyTags.splice(index, 1)
      } else {
        modifyTags[index][dataIndex] = val
      }
    } else if (flag) {
      return
    } else {
      //否则添加
      modifyTags.push(row)
    }
    PubSub.publish("modifyTags", modifyTags)
    PubSub.publish("canSubmit", {
      canSubmit: modifyTags.length > 0 ? true : false,
      message: modifyTags.length > 0 ? "" : "当前没有修改的内容"
    })
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
        return col;
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
          <Table
            rowSelection={this.props.rowSelection}
            components={components}
            rowClassName={() => 'editable-row'}
            dataSource={dataSource}
            columns={columns}
            loading={this.props.loading}
            pagination={false} scroll={{ y: this.state.height }}
          />
        </div>
        <div className="paging">
          {
            dataSource && dataSource.length > 0 ? (
              <>
                {
                  this.props.count - dataSource.length > 0 ? (
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
            ) : <></>
          }
        </div>
      </>
    );
  }
}

export default EditableTable