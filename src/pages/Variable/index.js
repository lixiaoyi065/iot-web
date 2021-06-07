import React, { PureComponent } from 'react'
import { Dropdown, Modal, Form, Input, Select } from 'antd'

import Ztree from 'components/common/Ztree'
import DrowDownMenu from 'components/common/DrowDownMenu'
import DataTable from 'components/common/DataTable'

import Search from './components/Search'

import { getEquList } from 'api/variable/index'

import './index.less'

class Variable extends PureComponent{
  state = {
    zNodes: [],
    loading: false,
    toogle: false,
    isShow: false
  }

  componentDidMount() {
    getEquList().then(res => {
      this.setState({ zNodes: res , loading: true})
    });
  }
  menuClick = (e) => {
    console.log(e.key)
    this.setState({isShow: true})
  }

  //提交表单
  submint = () => {
    
  }
  onFinish = (values) => {
    console.log('Success:', values);
  }
  onFinishFailed = () => {
    
  }
  
  equMenu = (
    <DrowDownMenu lists={[
      {
        key: "addEqu",
        name: "添加设备",
      },
      {
        key: "addGroup",
        name: "添加分组",
      }
    ]} menuClick={(key)=>{this.menuClick(key)}}
    >
    </DrowDownMenu>
  )

  opt = (
    <Dropdown overlay={this.equMenu} trigger={['click']} placement="bottomCenter" arrow>
      <div className="optAdd"></div>
    </Dropdown>
  )
  toggleLeft = () => {
    const toogle = !this.state.toogle
    this.setState({toogle: toogle})
  }

  render() {
    const { zNodes, loading } = this.state;
    return (
      <div className="antProPageContainer">
        <div className={`leftContent ${this.state.toogle ? 'hideLeft' : null}`}>
          {
            loading ? 
            <Ztree
                title="设备列表"
                opt={this.opt}
                  zNodes={zNodes}
                  loading = {loading}
                /> : ''
          }
          <span className="arrowLeft" onClick={this.toggleLeft}></span>
        </div>
        <div className="tableList">
          <Search />
          <div className="tableContain">
            <DataTable />
          </div>
        </div>
        <Modal width='fit-content' title="添加/编辑分组" visible={this.state.isShow}
          okText="确定" cancelText="取消"
          onOk={this.submint} onCancel={() => { this.setState({ isShow: !this.state.isShow }) }}>
          <Form
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              equType: "内部变量"
            }}
          >
            <Form.Item label="所属设备" name="equType">
              <Select style={{width: '250px'}}>
                <Select.Option key="0">内部变量</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="分组名称" name="groupName" rules={[
                {
                  required: true,
                  message: '请输入分组名称!',
                },
              ]}
            >
              <Input placeholder="请输入设备描述" style={{width: '250px'}}/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Variable