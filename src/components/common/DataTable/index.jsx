import React, { PureComponent } from 'react'

import './index.less'


export default class DataTable extends PureComponent {
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
                <td>变量名</td>
                <td>变量描述</td>
                <td>数据类型</td>
                <td>变量地址</td>
                <td>字符长度</td>
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
                <td>变量名</td>
                <td>变量描述</td>
                <td>数据类型</td>
                <td>变量地址</td>
                <td>字符长度</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                {
                  orderNum ? (
                    <td className="order-col">
                      {/* <span className={styles.orderNum}>1</span> */}
                      <input type="checkbox" className="ant-checkbox" onChange={ this.change }/>
                    </td>
                  ) : null
                }
                <td><div className="td-grird">Tag_1</div></td>
                <td></td>
                <td><div className="td-grird">二进制</div></td>
                <td><div className="td-grird">4000.2</div></td>
                <td></td>
              </tr>
              <tr>
                <td className="order-col">2</td>
                <td><div className="td-grird">Tag_1</div></td>
                <td></td>
                <td><div className="td-grird">二进制</div></td>
                <td><div className="td-grird">4000.2</div></td>
                <td></td>
              </tr>
              <tr>
                <td className="order-col">3</td>
                <td><div className="td-grird">Tag_1</div></td>
                <td></td>
                <td><div className="td-grird">二进制</div></td>
                <td><div className="td-grird">4000.2</div></td>
                <td></td>
              </tr>
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