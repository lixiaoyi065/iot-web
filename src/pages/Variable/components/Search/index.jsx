import React, { PureComponent } from 'react'
import { Form, Input, Button, Select, Dropdown } from 'antd'
import DrowDownMenu from 'components/common/DrowDownMenu'
import './index.less'

import searchLogo from 'assets/img/common/search.png'
import addOpt from 'assets/img/variable/add2.png'
import delOpt from 'assets/img/variable/del.png'
import moreOpt from 'assets/img/variable/more.png'

class Search extends PureComponent {

  saveList = () => {
  }

  moreMenu = (
    <DrowDownMenu lists={[
      {
        key: "overallImport",
        name: '整体导入',
      },
      {
        key: "overallExport",
        name: '整体导出',
      },
      {
        key: "currentTableImport",
        name: '导入当前点表',
      },
      {
        key: "currentTableExport",
        name: '导出当前点表',
      }
    ]}
      onClick={(e) => { this.menuClick(e) }}
    >
    </DrowDownMenu>
  )

  menuClick = (e) => {
    console.log(e.key)
  }

  render() {
    return (
      <div className="search-contain">
        <Form
          layout="inline"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
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
          <Form.Item>
            <Input placeholder="请输入关键字" style={{ width: '240px' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submint" className="btn-submint"><img className="btn-icon" src={searchLogo} alt="" />查询</Button>
          </Form.Item>
        </Form>
        <div className="option-area">
          <Button className="ant-button-normal" onClick={this.saveList}>保存</Button>
          <Button type="primary" style={{ margin: 0 }}>重置</Button>
          <span className="divider"></span>
          <Button className="ant-btn-opt-sm ant-btn-opt-primary"><img className="btn-icon" src={addOpt} alt="" /></Button>
          <Button className="ant-btn-opt-sm ant-btn-opt-danger"><img className="btn-icon" src={delOpt} alt="" /></Button>
          <Dropdown overlay={this.moreMenu} trigger={['click']} placement="bottomRight" arrow>
            <Button className="ant-btn-opt-sm ant-btn-opt-normal"><img className="btn-icon" src={moreOpt} alt="" /></Button>
          </Dropdown>
        </div>
      </div>
    )
  }
}

export default Search