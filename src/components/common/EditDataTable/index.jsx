import React, { useContext, useRef } from 'react';
import { Table, Input, Form, Select, message } from 'antd';
import PubSub from 'pubsub-js'
import "./index.less"

import { isEffectiveEditor, debounce, isRepeat } from 'utils'

import { VerifyTagName } from 'api/variable'

const EditableContext = React.createContext(null);
const { Option } = Select;

let modifyTags = [];
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
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
  type,
  content,
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

  const verifyTagName = (obj) => {
    VerifyTagName(obj).then(res => {
      if (res.code !== 0) {
        message.error(res.msg)
      }
    })
  }

  const check = async (e) => {
    try {
      const value = e.target.value
      const dataList = await form.validateFields();
      toggleEdit(value)

      //判断变量名是否重复
      if (dataIndex === "name") {
        if (isRepeat(dataSource, dataIndex, value)) {
          verifyTagName({
            tagId: record.id,
            tagName: value,
            type: activeNodeType
          })
        } else {
          message.error("变量名" + value + "已存在")
        }
      }
      handleSave(dataIndex, value, { ...record, ...dataList });
      if (!isEffectiveEditor(gist, record.key, dataIndex, value)) {
        e.target.parentNode.className = "ant-form-item-control-input-content effective-editor"
      } else {
        e.target.parentNode.className = "ant-form-item-control-input-content"
      }

    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const selectChange = async (e) => {
    try {
      const dataList = await form.validateFields();
      handleSave(dataIndex, e, { ...record, ...dataList });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  }

  let childNode = children;

  if (record && record.editable) {
    childNode = type === "select" ? (
      <Form.Item name={dataIndex} initialValue={record[dataIndex]} >
        <Select onChange={selectChange}>
          {
            content.map((el, idx) => {
              return <Option value={el} key={el + idx}>{el}</Option>
            })
          }
        </Select>
      </Form.Item>
    ) : (
        <Form.Item name={dataIndex} initialValue={record[dataIndex]}>
        <Input ref={inputRef} onChange={debounce(check, 1000)} autoComplete='off' />
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      height: 0,
      dataSource: []
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ height: this.ref.current.getBoundingClientRect().height - 50 })
    })
  }
  static getDerivedStateFromProps(props, state) {
    state.dataSource = props.dataSource
    return null
  }

  handleSave = (dataIndex, val, row) => {
    this.setState((state) => {
      for (let i = 0; i < state.dataSource.length; i++) {
        if (state.dataSource[i].key === row.key) {
          state.dataSource[i][dataIndex] = val
          return {
            dataSource: state.dataSource,
          }
        }
      }
    })
    if (modifyTags.length > 0) {
      for (let i = 0; i < modifyTags.length; i++) {
        if (modifyTags[i].key === row.key) {
          modifyTags[i][dataIndex] = val
        } else {
          modifyTags.push(row)
        }
      }
    } else {
      modifyTags.push(row)
    }

    console.log(modifyTags)

    PubSub.publish("modifyTags", modifyTags)
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
          activeNodeType: this.props.activeNodeType,
          content: col.content,
          handleSave: this.handleSave
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
            pagination={false} scroll={{ y: this.state.height }}
          />
        </div>
        <div className="paging">
          {
            dataSource.length > 0 ? (
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