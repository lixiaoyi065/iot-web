import React, { PureComponent } from 'react'
import { Form, Input, Button, Select, Dropdown } from 'antd'
import DrowDownMenu from 'components/common/DrowDownMenu'
import './index.less'

import searchLogo from 'assets/img/common/search.png'
import addOpt from 'assets/img/variable/add2.png'
import delOpt from 'assets/img/variable/del.png'
import moreOpt from 'assets/img/variable/more.png'

class Search extends PureComponent {

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
      onClick={(e) => { this.props.menuClick(e) }}
    >
    </DrowDownMenu>
  )

  render() {
    return (
      <div className="search-contain">
        <Form
          layout="inline"
          onFinish={this.props.searchForm}
          onFinishFailed={this.onFinishFailed}
          initialValues={
            {
              dataType: "不限",
              key: ""
            }
          }
        >
          <Form.Item
            label="数据类型"
            colon={false}
            name="dataType"
            width="70px"
          >
            <Select style={{ width: '150px' }}>
              <Select.Option value="不限">不限</Select.Option>
              {
                this.props.dataTypes.length > 0 ? this.props.dataTypes.map(element => {
                  return <Select.Option value={element}>{element}</Select.Option>
                }) : <></>
              }
            </Select>
          </Form.Item>
          <Form.Item name="key">
            <Input placeholder="请输入关键字" style={{ width: '240px' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submint" className="btn-submint"><img className="btn-icon" src={searchLogo} alt="" />查询</Button>
          </Form.Item>
        </Form>
        <div className="option-area" onClick={ this.props.optionClick }>
          <Button className="ant-button-normal"
            onClick={this.props.saveList}
            disabled={ this.props.type === 1 ? true : false }>保存</Button>
          <Button type="primary" onClick={ this.props.resetTags } style={{ margin: 0 }} disabled={ this.props.type === 1 ? true : false }>重置</Button>
          <span className="divider"></span>
          <Button className="ant-btn-opt-sm ant-btn-opt-primary" onClick={ this.props.addTags } disabled={ this.props.type === 1 ? true : false }>
            <img className="btn-icon" src={addOpt} alt="" />
          </Button>
          <Button className="ant-btn-opt-sm ant-btn-opt-danger" onClick={ this.props.delTags } disabled={ this.props.type === 1 ? true : false }>
            <img className="btn-icon" src={delOpt} alt="" />
          </Button>
          <Dropdown overlay={this.moreMenu} trigger={['click']} placement="bottomRight" arrow>
            <Button className="ant-btn-opt-sm ant-btn-opt-normal"><img className="btn-icon" src={moreOpt} alt="" /></Button>
          </Dropdown>
        </div>
      </div>
    )
  }
}

export default Search