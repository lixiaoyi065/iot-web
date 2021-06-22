import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Form, Select, message } from 'antd';
import "./index.less"

import { isEffectiveEditor, debounce, isRepeat } from 'utils'

import { VerifyTagName } from 'api/variable'

const EditableContext = React.createContext(null);
const { Option } = Select;

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
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing && type !== "select") {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    // setEditing(!editing);
    console.log(dataIndex,record[dataIndex],activeNodeType)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
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
      form.setFieldsValue({
        [dataIndex]: value
      });

      //判断变量名是否重复
      if (dataIndex === "name") {
        if (isRepeat(dataSource, dataIndex, value)) {
          verifyTagName({
            tagId: record.id,
            tagName: value,
            type: activeNodeType
          })
        } else {
          message.error("变量名" + value +"已存在")
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

  let childNode = children;

  if (record && record.editable) {
    childNode = type === "select" ? (
      <Form.Item name={dataIndex} defaultValue={content[0]} >
        <Select>
          {
            content.map((el, idx) => {
              return <Option value={el} key={el + idx}>{el}</Option>
            })
          }
        </Select>
      </Form.Item>
    ) : (
      <Form.Item name={dataIndex}>
        <Input ref={inputRef} onChange={debounce(check, 1000)} autoComplete='off' />
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
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
  };

  render() {
    const { dataSource } = this.state;
    console.log(this.state.dataSource)
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