import React from 'react';
import { Input, Select, Checkbox, Button } from 'antd'
import _, { debounce } from "lodash";
import {VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import {Resizable } from 'react-resizable';
import { Table } from 'antd';
import $, { Callbacks } from 'jquery'

import { addressVerify, descVerify, nameVerify, verifyMax, verifyMin } from 'components/common/DataTable/verify'

import './index.less'

/**
 * VirtualTable 通过 react-window 引入虚拟滚动方案，实现 100000 条数据的高性能表格。
 * @param pagination {Boolean} 表示分页器，默认true
 * @param defaultPageSize {Number} 每页显示数量，默认50
 * @param isShowSizeChanger {Boolean} S是否改变pageSize，默认true
 * @param isRowKey {Boolean} 如表格行加上可选功能的话，则isRowKey需设置为false,默认true
 * @param pageSizeOptions {Array} 页码配置选择，默认['20', '50', '100', '200', '500']
 * @param scroll {Object} 表格的宽和高 {y: 300,x: 300}
 * @param render 自定义数据展示 {Function}
 */

export default class VirtualTable extends React.Component {
  constructor(props){
    super(props);
    this.inputRef = React.createRef();
    this.selcetRef = React.createRef();
    this.state = {
      columns: this.props.columns,
      scroll: { x: 100, y: 100 },
      minWidth: 200,
      dataSource: [],
      gist: [],
      activeNodeType: props.activeNodeType,
      activeNode: props.activeNode,
      mergedColumns: [],
      tableWidth: 0,
      tableHeight: 0,
      connectObject: {},
      inputVal: {
        defaultValue: "",
        style:{}
      },
      defaultValue: "",
      visibleInput: true,
      visibleSelect: true,
      scrollLeft: 0,
      scrollTop: 0,
    };

    this.gridRef = null;
    // 回调函数式的ref
    this.setGridRef = element => {
      this.gridRef = element;
    };

    this.components = {
      header: {
        cell: this.ResizableTitle,
      },
      body: this.renderVirtualList,
    };
  }

  componentDidUpdate(preProps,preState){
    if (preState.tableWidth !== this.state.tableWidth) {
      this.resetVirtualGrid();
    }
  }
  componentDidMount(){
    this.scrollLeftFuc();
    $(document).click(e => {
      let className = e.target.className;
      console.log(className)
      if (className === "ant-select-selection-item" || className === "ant-select-item-option-content" ||
          className === "ant-input edit-input" || className === "virtual-table-cell-item virtual-table-cell-edit") {
      } else {
        this.setState({
          visibleSelect: true,
          visibleInput: true
        })
      }
    })
  }

  static getDerivedStateFromProps(props, state) {
    state.dataSource = props.dataSource
    state.gist = props.gist
    return null
  }

  //判断是否编辑
  checkIsSame = (val, record, dataIndex) => {
    let isSame = false, { gist } = this.state
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

  //复选框事件
  rowCheck = (e, id) => {
    this.props.onSelectChange(id)
  }

  render_ = (text, title, data, dataIndex, style) => {
    let isEdited = this.checkIsSame(text, data, dataIndex)

    let isCheck = this.props.selectedRowKeys.indexOf(data.key) >= 0 ? true : false
    
    if (title === "全选") {
      return <div className="virtual-table-cell-item"><Checkbox checked={ isCheck ? true : false } onClick={ e=> {this.rowCheck(e, data.key)} }/></div>
    }

    if (dataIndex==="no") {
      return <div className="virtual-table-cell-item">{text}</div>
    }

    if (title === '变量地址') {
      return <div className={`virtual-table-cell-item virtual-table-cell-select-edit ${isEdited ? "effective-editor": ""}`}>
              <div className="virtual-table-cell-select">
                <div className="table-cell-input" onClick={(e)=>{this.onClick(e,text, title, data, dataIndex, style, isEdited)}}>{text}</div>
                <Button className="addon-btn"  onClick={(event) => { this.props.addressSearch(data[dataIndex], event, data, data['stringLength']) }}><span>···</span></Button>
              </div>
            </div>;
    }
    return <div className={`virtual-table-cell-item ${data.editable ? "virtual-table-cell-edit":"" } ${isEdited ? "effective-editor": ""}`}
            onClick={(e) => { this.onClick(e, text, title, data, dataIndex, style, isEdited) }}>{text}</div>
  }

  onClick = (e, text, title, data, dataIndex, style, flag = false) => {
    e.stopPropagation();
    let { scrollTop, scrollLeft } = this.state
    let setObj = {}

    if (data.editable && title !=="序号" && title !=="全选") {
      if (dataIndex === "dataType") {
        setObj = {
          inputVal: {
            style: { ...style, top: style.top + 43 - scrollTop, left: style.left - scrollLeft + 10, width: style.width - 10, height: "32px", color: !flag? "#252525" : "#F5AB3A"},
            defaultValue: text,
            data,
            title,
            dataindex: dataIndex
          },
          defaultValue: text,
          visibleSelect: false,
          visibleInput: true
        }
      } else {
        setObj = {
          inputVal: {
            style:{...style, top: style.top + 43 - scrollTop, left: style.left - scrollLeft + 10, width: style.width - 10, height: "32px", color: !flag? "#252525" : "#F5AB3A"},
            defaultValue: text,
            data,
            title,
            dataindex: dataIndex
          },
          visibleSelect: true,
          visibleInput: false,
        }
      }
      this.setState(setObj, () => {
        if (dataIndex === "dataType") {
        } else {
          this.inputRef.current.focus();
          this.inputRef.current.setValue(text)
        }
      })
    }
  }

  scrollLeftFuc = () => {
    const connectObject = {};
    Object.defineProperty(connectObject, 'scrollLeft', {
      get: () => null,
      set: scrollLeft => {
        if (this.gridRef) {
          this.gridRef.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    this.setState({connectObject});
  }

  resetVirtualGrid = () => {
    this.gridRef.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: false,
    });
  };
  
  ResizableTitle = props => {
    const { onResize, width, ...restProps } = props;
    if (restProps.title === "全选") {
      return <th {...restProps} >
        <Checkbox checked={this.props.selectedRowKeys.length === this.state.dataSource.length && this.props.selectedRowKeys.length !== 0} onClick={e => { this.props.onSelectChange("all") }} />
      </th>;
    }
  
    return (
      <Resizable
        width={width}
        height={0}
        handle={
          <span className="react-resizable-handle" onClick={e => {e.stopPropagation();}} />
        }
        onResize={onResize}
        draggableOpts={{enableUserSelectHack: false }}
      >
        <th {...restProps} />
      </Resizable>
    );
  };

  renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    const { connectObject, mergedColumns, tableWidth, scroll } = this.state;
    ref = connectObject;
    return (
      <Grid
        ref={this.setGridRef}
        className={`virtual-grid ${rawData.length === 0 ? "no-data" : ""}`}
        columnCount={mergedColumns.length}
        columnWidth={index => {
          const { width } = mergedColumns[index];
          return index === mergedColumns.length - 1 ? width - scrollbarSize - 1 : width;
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 43}
        width={tableWidth}
        onScroll={({ scrollLeft, scrollTop }) => {
          this.setState({
            scrollLeft, scrollTop,
            visibleInput: true,
            visibleSelect: true
          })
          onScroll({
            scrollLeft,
          });
        }}
      >
        {({ columnIndex, rowIndex, style }) => {
          // 当前内容
          let text = rawData[rowIndex][mergedColumns[columnIndex].dataIndex];
          // 当前列标题
          let title = mergedColumns[columnIndex].title;
          // 当前行数据
          let data = rawData[rowIndex];
          //当前字段
          let dataIndex = mergedColumns[columnIndex].dataIndex
          return (
            <div className={`${data.no % 2 === 0 ? "virtual-table-cell virtual-table-cell-odd" : 'virtual-table-cell'}`}
                style={style} title={ text }
              >
              {/* //数据展示出口 */}
              {this.render_(text, title, data, dataIndex, style)}
            </div>
          )
        }}
      </Grid>
    );
  };
  setTableWidth = width => {
    const { columns, tableWidth } = this.state;
    let widthColumnCount = columns.filter(({width }) => !width).length;
    const mergedColumns = columns.map(column => {
      if (column.dataIndex === "checkbox") {
        widthColumnCount = widthColumnCount -1
        this.setState({minWidth: 70})
        return { ...column, width: 70 };
      }
      
      this.setState({minWidth: Math.floor((tableWidth -70) / widthColumnCount)})
      return { ...column, width: Math.floor((tableWidth -70) / widthColumnCount) };
    });
    this.setState({ tableWidth: width, mergedColumns});
  }
  handleResize = index => (e, { size }) => {
    if (size.width <= this.state.minWidth) {
      return
    }
    this.resetVirtualGrid();
    this.setState(({ mergedColumns }) => {
      const nextColumns = [...mergedColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return {
        mergedColumns: nextColumns,
        visibleSelect: true,
        visibleInput: true
      };
    });
  };
  onChangePagination = (current, pageSize) => {
    const connectObject = {};
    Object.defineProperty(connectObject, 'scrollLeft', {
      get: () => null,
      set: scrollLeft => {
        if (this.gridRef) {
          this.gridRef.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    this.setState({connectObject, pageSize});
  }

  onChange = (e) => {
    //将输入框的值设置到dataSource中
    let { data, dataindex } = this.inputRef.current.props
    let {activeNodeType} = this.state
    let val = e.target ? e.target.value : e, min="", max=""

    if (dataindex === 'dataType') {
      if (Number(activeNodeType) === 2 || Number(activeNodeType) === 0) {
        let types = ['二进制变量', '日期', '时间', '日期时间', '字符串']
        if (types.includes(e)) {
          min = ''
          max = ''
        }
        if (e === '有符号8位整型') {
          min = '-128'
          max = '127'
        }
        if (e === '无符号8位整型') {
          min = '0'
          max = '255'
        }
        if (e === '有符号16位整型') {
          min = '-32768'
          max = '32767'
        }
        if (e === '无符号16位整型') {
          min = '0'
          max = '65535'
        }
        if (e === '有符号32位整型') {
          min = '-2147483648'
          max = '2147483647'
        }
        if (e === '无符号32位整型') {
          min = '0'
          max = '4294967295'
        }
        if (e === '有符号64位整型') {
          min = '-9223372036854775808'
          max = '9223372036854775807'
        }
        if (e === '无符号64位整型') {
          min = '0'
          max = '18446744073709551615'
        }
        if (e === 'F32位浮点数IEEE754') {
          min = '-3.402823E+38'
          max = '3.402823E+38'
        }
        if (e === 'F64位浮点数IEEE754') {
          min = '-1.7976931348623157E+308'
          max = '1.7976931348623157E+308'
        }
      }
    }

    this.setState(state => {
      for (let i = 0; i < state.dataSource.length; i++){
        if (state.dataSource[i].key === data.key) {
          state.dataSource[i][dataindex] = val
          if (dataindex === 'dataType') {
            state.dataSource[i].min = min
            state.dataSource[i].max = max
          }
        }
      }
      return {
        dataSource: state.dataSource,
        defaultValue: val
      }
    })
    this.props.handleSave(dataindex, val, data);
  }

  handleSave = (dataIndex, val, row, flag = true, isAddress = false, nodeType) => {
    /*  
      nodeType： 内部变量 2 选择数据类型需要展示最大值和最小值
     */
    this.setState(state => {
      for (let i = 0; i < state.dataSource.length; i++) {
        if (state.dataSource[i].key === row.key) {
          if (nodeType === 2 || nodeType === 0) {
            let types = ['二进制变量', '日期', '时间', '日期时间', '字符串']
            if (types.includes(state.dataSource[i].dataType)) {
              state.dataSource[i].min = ''
              state.dataSource[i].max = ''
            }
            if (state.dataSource[i].dataType === '有符号8位整型') {
              state.dataSource[i].min = '-128'
              state.dataSource[i].max = '127'
            }
            if (state.dataSource[i].dataType === '无符号8位整型') {
              state.dataSource[i].min = '0'
              state.dataSource[i].max = '255'
            }
            if (state.dataSource[i].dataType === '有符号16位整型') {
              state.dataSource[i].min = '-32768'
              state.dataSource[i].max = '32767'
            }
            if (state.dataSource[i].dataType === '无符号16位整型') {
              state.dataSource[i].min = '0'
              state.dataSource[i].max = '65535'
            }
            if (state.dataSource[i].dataType === '有符号32位整型') {
              state.dataSource[i].min = '-2147483648'
              state.dataSource[i].max = '2147483647'
            }
            if (state.dataSource[i].dataType === '无符号32位整型') {
              state.dataSource[i].min = '0'
              state.dataSource[i].max = '4294967295'
            }
            if (state.dataSource[i].dataType === '有符号64位整型') {
              state.dataSource[i].min = '-9223372036854775808'
              state.dataSource[i].max = '9223372036854775807'
            }
            if (state.dataSource[i].dataType === '无符号64位整型') {
              state.dataSource[i].min = '0'
              state.dataSource[i].max = '18446744073709551615'
            }
            if (state.dataSource[i].dataType === 'F32位浮点数IEEE754') {
              state.dataSource[i].min = '-3.402823E+38'
              state.dataSource[i].max = '3.402823E+38'
            }
            if (state.dataSource[i].dataType === 'F64位浮点数IEEE754') {
              state.dataSource[i].min = '-1.7976931348623157E+308'
              state.dataSource[i].max = '1.7976931348623157E+308'
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
  }

  onBlur = async (e) => {
    let { data, dataindex } = this.inputRef.current.props
    let {dataSource, activeNodeType, activeNode} = this.state
    let val = e.target.value
    let isAddress = false, record = data

    //检验
    if (dataindex === "name") {
      nameVerify(val, dataSource, record, dataindex, activeNodeType)
    } else if (dataindex === "address") { //变量地址校验
      record[dataindex] = val
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
    } else if (dataindex === "desc") {
      descVerify(val)
    } else if (dataindex === "min") {
      verifyMin(val, record.dataType)
    } else if (dataindex === "max") {
      verifyMax(val, record.dataType)
    }
    this.handleSave(dataindex, val, record, this.checkIsSame(val, data), isAddress)
  }
  onPressEnter = async (e) => {
    this.setState({ visibleInput: true, visibleSelect: true}, () => {
      this.onBlur(e);
    })
  }

  render() {
    const columns = this.state.mergedColumns.map((col, index) => ({
      ...col,
      onHeaderCell: column => {
        return ({
          width: column.width,
          onResize: this.handleResize(index),
        })
      }
    }));
    const { pagination, loading, showSizeChanger = false, pageSizeOptions = [] } = this.props;
    const { dataSource } = this.state

    const page = {
      pageSize: Math.pow(2, 53),
      defaultCurrent: 1,
      pageSizeOptions: pageSizeOptions.length ? pageSizeOptions : ['5','20', '50', '100', '200', '500'],
      showQuickJumper: false,
      showSizeChanger: showSizeChanger,
      showTotal: total => `共 ${total||0}条数据`,
      onShowSizeChange: (current, pageSize) => {this.onChangePagination(current, pageSize)}
    }
    let isPagination = {};
    if (!pagination && typeof pagination !== 'boolean') {
      if (loading) page.current = 1;
      isPagination.pagination = page;
    } if (!pagination && typeof pagination !== 'boolean') {
      if (loading) page.current = 1;
      isPagination.pagination = page;
    }
    return (
      <>
        <div className="table-contain" ref={this.ref}>
          <Input className="edit-input" ref={this.inputRef}
            {...this.state.inputVal}
            onPressEnter={this.onPressEnter}
            onChange={debounce(this.onChange, 200)}
            onBlur={this.onBlur}
            hidden={this.state.visibleInput} />
          <Select className="edit-select"
            ref={this.selcetRef}
            {...this.state.inputVal}
            onChange={this.onChange}
            value={this.state.defaultValue}
            hidden={this.state.visibleSelect}>
            {
              this.props.tableDataTypes.map(item => {
                return <Select.Option key={item}>{ item }</Select.Option>
              })
            }
          </Select>
          <ResizeObserver
            onResize={({ width, height }) => {
              this.setState({
                scroll: { y: height - 43, x: width },
                tableWidth: width,
                visibleInput: true,
                visibleSelect:true
              }, () => {
                this.setTableWidth(width);
              })
            }}
          >
            <Table {...this.props}
              dataSource={dataSource}
              {...isPagination}
              className="virtual-table"
              columns={columns}
              bordered={true}
              components={this.components}
              scroll={this.state.scroll}
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
    )
  }
} 