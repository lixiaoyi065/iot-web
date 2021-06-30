import React, { PureComponent, useContext, useRef } from 'react';
import { Table, Input, Select } from 'antd';
import { Resizable } from 'react-resizable';
import PubSub from 'pubsub-js'
import "components/common/EditDataTable/index.less"

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

class EditableTable extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      height: 0,
      dataSource: [],
      changeTags: false,
      columns: this.props.columns
    };
  }

  componentDidMount() {
    setTimeout(() => {
      // this.setState({ height: this.ref.current.getBoundingClientRect().height - 50 })
    })
    PubSub.subscribe("changeTags", (msg, data) => {
      this.setState({ changeTags: data })
    })
  }
  components = {
    header: {
      cell: ResizeableTitle,
    },
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

    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));
    return (
      <>
        <div className="table-contain" ref={this.ref}>
          <Table
            bordered
            components={this.components}
            rowSelection={this.props.rowSelection}
            dataSource={dataSource}
            columns={columns}
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