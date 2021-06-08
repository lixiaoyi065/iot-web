import React, { PureComponent } from 'react'
import { Dropdown, Modal, Form, Input, Select, Button, message } from 'antd'

import Ztree from 'components/common/Ztree'
import DrowDownMenu from 'components/common/DrowDownMenu'
import DataTable from 'components/common/DataTable'

import Search from './components/Search'
import AddEqu from './components/AddEqu'

import { getEquList, addGroup } from 'api/variable/index'

import './index.less'

const { Option } = Select;

class Variable extends PureComponent{
  state = {
    zNodes: [],
    loading: false,
    toogle: false,
    isShowGroup: false,
    isShowEqu: false,
  }
  

  componentDidMount() {
    //获取设备列表
    getEquList().then(res => {
      this.setState({ zNodes: res , loading: true})
    });
  }
  menuClick = (e) => {
    console.log(e.key, e.key === "addEqu")
    if (e.key === "addEqu") {
      this.setState({isShowGroup: true})
    } else {
      this.setState({isShowEqu: true})
    }
  }

  onCancel = () => {
    this.setState({
      isShowEqu: !this.state.isShowEqu
    })
  }
  //提交表单
  onFinish = (values) => {
    //关闭弹窗
    this.setState({isShowGroup: !this.state.isShowGroup})
    // addGroup(values).then(res => {
      
    // })
    console.log('Success:', values);
    message.info('提交成功！');
  }
  onFinishFailed = () => {
    message.error('提交失败！');
  }
  onFinishEqu = (val) => {
    console.log('Success:', val);
    message.info('提交成功！');
  }
  onFinishFailedEqu = () => {
    message.error('提交失败！');
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

        <Modal width='fit-content' title="添加分组" footer={null} visible={ this.state.isShowGroup }>
          <Form
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              Type: "2"
            }}
          >
            <Form.Item label="所属设备ID" name="DeviceId" hidden>
              <Input value="1"/>
            </Form.Item>
            <Form.Item label="所属设备" name="Type">
              <Select>
                <Option value="2">内部变量</Option>
                <Option value="4">系统变量</Option>
              </Select>
            </Form.Item>
            <Form.Item label="分组名称" name="Name" rules={[
                {
                  required: true,
                  message: '请输入分组名称!',
                },
              ]}
            >
              <Input placeholder="请输入设备描述"/>
            </Form.Item>
            <Form.Item className="form-footer">
              <Button type="default" className="login-form-button" onClick={ ()=>{ this.setState({isShowGroup: !this.state.isShowGroup})} }>取消</Button>
              <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
            </Form.Item>
          </Form>
        </Modal>

        <AddEqu visible={this.state.isShowEqu} cancel={ this.onCancel }/>

      </div>
    )
  }
}

export default Variable