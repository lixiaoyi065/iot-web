import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Form, Select } from 'antd';
import "./index.less"

const EditableContext = React.createContext(null);
const { Option } = Select;
const tableDataTypes = ["二进制变量", "有符号8位整型", "无符号8位整型", "有符号16位整型", "无符号16位整型", "有符号32位整型", "无符号32位整型",
  "有符号64位整型", "无符号64位整型", "F32位浮点数IEEE754", "F64位浮点数IEEE754", "日期", "时间", "日期时间", "字符串"];

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
    if (editing && title !== "数据类型") {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const check = async (dataIndex) => {
    // console.log("=+++++", dataIndex.target.id, dataIndex.target.value)

    if (dataIndex.target.id) {
      
    }

    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  
  if (editable && record.editable) {
    childNode = type === "select" ? (
      <Form.Item
        name={dataIndex} defaultValue={ content[0] }
      >
        <Select>
          {
            content.map(( el,idx )=>{
              return <Option value={el} key={ el + idx }>{ el }</Option>
            })
          }
        </Select>
      </Form.Item>
    ): (
      <Form.Item name={dataIndex}>
        <Input ref={inputRef} onBlur={check} />
      </Form.Item>
    )
  } else {
    <div
      className="editable-cell-value-wrap"
      style={{
        paddingRight: 24,
      }}
      onClick={toggleEdit}
    >
      {children}
    </div>
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({height: this.ref.current.getBoundingClientRect().height-50})
    })
  }
  
  handleSave = (row) => {
    console.log("==============", row);
  };

  render() {
    const { dataSource } = this.props;
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
      <div className="table-contain" ref={ this.ref }>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource}
          columns={columns}
          pagination={ false } scroll={{y: this.state.height }}
        />
        <div className="paging">
          {
            dataSource.length > 0 ? (
              <>
                {
                this.props.count - dataSource.length > 0 ? (
                  <label className="load-more" onClick={this.props.loadMore}>
                    <span>...加载更多</span>
                    <span style={{ color: '#999' }}>(剩余{ this.props.count - dataSource.length }条数据)</span>
                  </label>) : <></>
                }
                <label style={{ float: 'right', color: '#666', 'paddingRight': '20px'}}>
                  <span>总条数：</span>
                  <span>{ this.props.count }</span>
                </label>
              </>
            ) : <></>
          }
        </div>
      </div>
    );
  }
}

export default EditableTable