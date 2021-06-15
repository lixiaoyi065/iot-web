import React, { PureComponent } from 'react'

import './index.less'


export default class DataTable extends PureComponent {
  componentDidMount() {
    this.setState({
      ...this.props
    })
  }
  change() {
    
  }
  render() {
    const { orderNum=true } = this.props

    return (
      <div className="table-contain">
        <div className="table-head">
          <table className="data-table">
            <thead>
              <tr>
                {
                  orderNum ? (
                    <td className="order-col">
                      {/* <span className={styles.orderNum}>1</span> */}
                      <input type="checkbox" className="ant-checkbox" onChange={ this.change }/>
                    </td>
                  ) : null
                }
                {
                  this.props.cols.map(el => {
                    return <td style={{ width: el.width }} key={ el.field }>{el.title}</td>
                  })
                }
              </tr>
            </thead>
          </table>
        </div>
        <div className="table-body">
          <table className="data-table">
            <thead>
              <tr>
                {
                  orderNum ? (
                    <td className="order-col">
                      {/* <span className={styles.orderNum}>1</span> */}
                      <input type="checkbox" className="ant-checkbox" onChange={ this.change }/>
                    </td>
                  ) : null
                }
                {
                  this.props.cols.map(el => {
                    return <td style={{ width: el.width }} key={ el.field }>{el.title}</td>
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                this.props.cols.map((el, idx) => {
                  return (
                    <tr key={ idx }>
                      <td className="order-col">{idx + 1}</td>
                      {
                        this.props.cols.map(el => {
                          return (
                            <td style={{ width: el.width }} key={el.field}>
                              <div className="td-grird">{el.title}</div>
                            </td>
                          )
                        })
                      }
                    </tr>
                  )
                  
                })
              }
            </tbody>
          </table>
        </div>
        <div className="paging">
          <label className="load-more">
            <span>...加载更多</span>
            <span style={{color: '#999'}}>(剩余20条数据)</span>
          </label>
          <label style={{ float: 'right', color: '#666', 'paddingRight': '20px'}}>
            <span>总条数：</span>
            <span>200</span>
          </label>
        </div>
      </div>
    )
  }
}