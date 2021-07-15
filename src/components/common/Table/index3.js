import React from 'react';
import {Input, Select} from 'antd'
import {VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import {Resizable } from 'react-resizable';
import { Table } from 'antd';

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

const ResizableTitle = props => {
  const {onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
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

export default class VirtualTable extends React.Component {
  constructor(props){
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      columns: this.props.columns,
      scroll: { x: 100, y: 100 },
      minWidth: 200,
      mergedColumns: [],
      tableWidth: 0,
      tableHeight: 0,
      connectObject: {},
      inputVal: {
        value: "",
        style:{}
      },
      visibleInput: true
    };

    this.gridRef = null;
    // 回调函数式的ref
    this.setGridRef = element => {
      this.gridRef = element;
    };

    this.components = {
      header: {
        cell: ResizableTitle,
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
  }

  render_ = (text, title, data,style) => {
    if (title === '变量地址') {
      return <div className="virtual-table-cell-item">
              <div className="virtual-table-cell-select">
                <div className="table-cell-input" onClick={(e)=>{this.onClick(e,text, title, data, style)}}>{text}</div>
                <button className="addon-btn">···</button>
              </div>
            </div>;
    }
    return <div className="virtual-table-cell-item" onClick={(e)=>{this.onClick(e,text, title, data, style)}}>{text}</div>
  }

  onClick = (e, text, title, data, style)=>{
    this.setState({inputVal:{
      style:{...style, top: style.top + 43, height: "32px"},
      value: text
    }, visibleInput: false},()=>{
      this.inputRef.current.focus();
    })
    console.log(text, title, data, style)

    // console.log("000000000")
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
        onScroll={({scrollLeft }) => {
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
          return (
            <div className={`${ data.no % 2 === 0 ? "virtual-table-cell virtual-table-cell-odd": 'virtual-table-cell'}`}
              style={style} title={ text }
            >
            {/* //数据展示出口 */}
            {this.render_(text, title, data,style)}
          </div>
          )
        }}
      </Grid>
    );
  };
  setTableWidth = width => {
    const {columns, tableWidth} = this.state;
    const widthColumnCount = columns.filter(({width }) => !width).length;
    const mergedColumns = columns.map(column => {
      if (column.width) {
        return column;
      }
      this.setState({minWidth: Math.floor(tableWidth / widthColumnCount)})
      return {
      ...column, width: Math.floor(tableWidth / widthColumnCount) };
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
      return { mergedColumns: nextColumns };
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

  onBlur=()=>{
    // this.setState({visibleInput: true})
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
    const { pagination, loading, showSizeChanger = false, pageSizeOptions = [], dataSource } = this.props;
    const page = {
      pageSize: Math.pow(2, 53),
      defaultCurrent: 1,
      pageSizeOptions: pageSizeOptions.length ? pageSizeOptions : ['5','20', '50', '100', '200', '500'],
      showQuickJumper: true,
      showSizeChanger: showSizeChanger,
      showTotal: total => `共 ${
       total||0}条数据`,
      onShowSizeChange: (current, pageSize) => {
      this.onChangePagination(current, pageSize)}
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
          <Input className="edit-input" ref={this.inputRef} {...this.state.inputVal} onBlur={this.onBlur} hidden={this.state.visibleInput}/>
          <ResizeObserver
            onResize={({ width, height }) => {
              this.setState({ scroll: { y: height - 43, x: width }, tableWidth: width }, () => {
                this.setTableWidth(width);
              })
            }}
          >
            <Table {...this.props}
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