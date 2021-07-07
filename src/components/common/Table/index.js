import React from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';

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
      height: 0
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({height: this.ref.current.getBoundingClientRect().height-50})
    })
  }

  render() {
    const { dataSource } = this.props;

    const components = {
      header: {
        cell: ResizeableTitle,
      },
    };
   
    return (
      <>
        <div className="table-contain" ref={ this.ref }>
          <Table
            rowSelection={this.props.rowSelection}
            rowClassName={() => 'editable-row'}
            components={components}
            dataSource={dataSource}
            columns={this.props.columns}
            pagination={ false } scroll={{y: this.state.height }}
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
      </>
    );
  }
}

