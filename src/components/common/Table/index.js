import React from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import ResizeObserver from 'rc-resize-observer';

import './index.less'

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

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef();
    this.state = {
      height: 0,
      columns: this.props.columns,
      tableWidth: 0,
      tableHeight: 0
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({height: this.ref.current.getBoundingClientRect().height-50})
    })
  }

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
    const { dataSource } = this.props;

    const components = {
      header: {
        cell: ResizeableTitle,
      },
    };

    const columns = this.state.columns.map((col, index) => {
      return {
        ...col,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
      }
    })
   
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
              rowClassName={() => 'editable-row'}
              components={components}
              dataSource={dataSource}
              ellipsis={true}
              columns={columns}
              pagination={ false } scroll={{y: this.state.tableHeight }}
            />
          </ResizeObserver>
        </div>
        <div className="paging">
          {
            dataSource.length > 0 ? (
              <>
                {
                this.props.count - dataSource.length > 0 ? (
                  <label className="load-more" onClick={this.props.loadMore}>
                    <span>...????????????</span>
                    <span style={{ color: '#999' }}>(??????{ this.props.count - dataSource.length }?????????)</span>
                  </label>) : <></>
                }
                <label style={{ float: 'right', color: '#666', 'paddingRight': '20px'}}>
                  <span>????????????</span>
                  <span>{ this.props.count }</span>
                </label>
              </>
            ) : <></>
          }
        </div>
      </>
    );
  }
}

