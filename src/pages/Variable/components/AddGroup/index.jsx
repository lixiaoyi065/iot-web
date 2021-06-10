import React, { PureComponent } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'

import store from 'store'
import axios from 'utils/request'

import { addGroup } from 'api/variable/index'

import "./index.less"

const { Option } = Select;
class AddGroup extends PureComponent {
  state = {
    euqList: [],
    type: 2
  }

  formRef = React.createRef()

  componentDidMount() {
    store.subscribe(() => {
      this.setState({ euqList: store.getState() })
    })

  }


  onFinish = (val) => {
    axios.post(`/VariableManage/AddGroup?DeviceId=${val.DeviceId}&Type=${val.Type}&Name=${val.Name}`).then(res =>{
      console.log(res)
    })
  }
  onFinishFailed = () => {
    
  }

  changeType = (e) => {
    let type = 2
    if (e === "28e1ab1b-fd92-4200-806e-9a32bcf3e492") {
      type = 2
    } else {
      type = 4
    }
    this.formRef.current.setFieldsValue({
      Type: type,
    });
  }
  render() {
    return (
      <Modal width='fit-content' title="添加分组" footer={null} visible={ this.props.visible }>
        <Form
          ref = { this.formRef }
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
          }}
        >
          <Form.Item label="所属设备ID" name="DeviceId">
            <Select onChange={ this.changeType }>
              {
                this.state.euqList.map(e => {
                  return <Option value={ e.nodeID } key={e.nodeID}>{ e.nodeName }</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="所属设备" name="Type" hidden initialValue={ this.state.type }>
            <Input/>
          </Form.Item>
          <Form.Item label="分组名称" name="Name" rules={[
              {
                required: true,
                message: '请输入分组名称!',
              },
            ]}
          >
            <Input placeholder="请输入分组名称"/>
          </Form.Item>
          <Form.Item className="form-footer">
            <Button type="default" className="login-form-button" onClick={ this.props.cancel }>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default AddGroup