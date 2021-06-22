import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Form, Select } from 'antd';
import "./index.less"

import { isEffectiveEditor } from 'utils'

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
  gist,
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  type,
  content,
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
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const check = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      console.log(e.target)
      e.target.parentNode.parentNode.style.color = "red"
      // if (isEffectiveEditor(gist, record.key, dataIndex, values[dataIndex])) {
      //   e.target.style.backgroundColor = "red"
      // } else {
      //   e.target.style.backgroundColor = "#fff"
      // }
      // console.log(inputRef2)

      console.log(isEffectiveEditor(gist, record.key, dataIndex, values[dataIndex]))
      handleSave(dataIndex, values[dataIndex], { ...record, ...values });
      return isEffectiveEditor(gist, record.key, dataIndex, values[dataIndex])
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const tdClick = (e) => {
    console.log(e.target)
  }

  let childNode = children;

  if (editable && record.editable) {
    childNode = editing ? (
      childNode = type === "select" ? (
        <Form.Item
          name={dataIndex} defaultValue={content[0]}
        >
          <Select onChange={check}>
            {
              content.map((el, idx) => {
                return <Option value={el} key={el + idx}>{el}</Option>
              })
            }
          </Select>
        </Form.Item>
      ) : (
        <Form.Item name={dataIndex}>
          <Input ref={inputRef} autoComplete='off' />
        </Form.Item>
      )
    ) : <div
      className="editable-cell-value-wrap"
      onClick={toggleEdit}
    >
      {children}
    </div>
  } else {
    <div
      className="editable-cell-value-wrap"
      onClick={toggleEdit}
    >
      {children}
    </div>
  }

  return <td {...restProps} onClick={tdClick}>{childNode}</td>;
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
          state.dataSource[i][dataIndex + "edit"] = true
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
          gist: this.props.gist,
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          type: col.type,
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