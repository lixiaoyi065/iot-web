import React, { PureComponent } from 'react'
import { Form, Input, Button, Select } from 'antd'
import './index.less'

import searchLogo from 'assets/img/common/search.png'

class Search extends PureComponent {
  render() {
    return (
      <div className="search-contain">
        <Form
          layout="inline"
          onFinish={this.props.onFinish}
        >
          <Form.Item
            label="数据类型"
            name="dataType"
            initialValue="不限"
            width="70px"
          >
            <Select style={{ width: '150px' }}>
              <Select.Option value="unlimited">不限</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="keyword">
            <Input placeholder="请输入关键字" style={{ width: '240px' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submint" className="btn-submint"><img className="btn-icon" src={searchLogo} alt="" />查询</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Search