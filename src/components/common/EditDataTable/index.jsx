import React, { useContext, useRef } from 'react';
import { Table, Input, Form, Select } from 'antd';
import PubSub from 'pubsub-js'
import "./index.less"

import { isEffectiveEditor, isFit } from 'utils'
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
  content,
  changeTags,
  activeNode,
  activeNodeType,
  ...restProps
}) => {
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  const toggleEdit = (value) => {
    form.setFieldsValue({
      [dataIndex]: value
    });
  };

  //有效编辑
  const isEffective = (e, value, id = null) => {
    let flag = isEffectiveEditor(gist, record.key, dataIndex, value)

    if (!flag) {
      if (id !== null) {
        document.getElementById(id).parentNode.parentNode.classList.add("effective-editor")
      } else {
        e.target.parentNode.className = "ant-form-item-control-input-content effective-editor"
      }
    } else {
      if (id !== null) {
        document.getElementById(id).parentNode.parentNode.classList.remove("effective-editor")
      } else {
        e.target.parentNode.className = "ant-form-item-control-input-content"
      }
    }
  }

  const check = async (e) => {
    let val = e.target.value;
    try {
      const dataList = await form.validateFields();
      toggleEdit(val)
      if (dataIndex === "name") {
        nameVerify(val, dataSource, record, dataIndex, activeNodeType)
      } else if (dataIndex === "address") { //变量地址校验
        addressVerify(val, {
          nodeId: activeNode,
          type: activeNodeType,
          dataType: dataList.dataType,
          address: val,
          length: dataList.stringLength
        })
      } else if (dataIndex === "desc") {
        descVerify(val)
      }
      handleSave(dataIndex, val, { ...record, ...dataList });
      isEffective(e, val);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const selectChange = async (e, id) => {
    try {
      const dataList = await form.validateFields();
      handleSave(dataIndex, e, { ...record, ...dataList });
      isEffective(e, e, id);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  }

  let childNode = children;

  if (record && record.editable) {
    childNode = type === "select" ? (
      <Form.Item name={dataIndex} initialValue={record[dataIndex]} >
        <Select onChange={(e) => selectChange(e, dataIndex + record.key)} id={dataIndex + record.key}>
          {
            content.map((el, idx) => {
              return <Option value={el} key={el + idx}>{el}</Option>
            })
          }
        </Select>
      </Form.Item>
    ) : (type === "input-group" ? (
      <Form.Item name={dataIndex} initialValue={record[dataIndex]}>
        <Input.Search ref={inputRef} id={dataIndex + record.key} onBlur={check} autoComplete='off' enterButton="···" onSearch={ (value, event)=>{addressSearch(value, event, record)} }/>
      </Form.Item>
    ): (
      <Form.Item name={dataIndex} initialValue={record[dataIndex]}>
        <Input ref={inputRef} id={dataIndex + record.key} onBlur={check} autoComplete='off' />
      </Form.Item>
    ))
    if (changeTags) {
      toggleEdit(record[dataIndex])
    }
  }
  //<Tooltip placement="topLeft" title={record&&record[dataIndex]}></Tooltip>
  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      height: 0,
      dataSource: [],
      changeTags: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ height: this.ref.current.getBoundingClientRect().height - 50 })
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

  handleSave = (dataIndex, val, row) => {
    console.log(row)
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

    if (isHas) {
      if (isFit(this.props.gist, row)) {//新旧对象一致,modifyTags移除该对象
        modifyTags.splice(index, 1)
      } else {
        modifyTags[index][dataIndex] = val
      }
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

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.props.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
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