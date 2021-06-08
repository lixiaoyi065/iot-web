import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button, Checkbox, message, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import "./index.less"

const { Option } = Select;

const AddEqu = (props) => {
  const formRef = React.createRef();
  const ProtocolNames = ['Modbus_TCP', 'S7_TCP', 'OPC_DA', 'OPC_UA', 'MC3E_Binary_Ethernet', 'MCA1E_Binary_Ethernet', 'Fins_TCP'],//协议列表
    Suppliers = {//厂家列表
      'Modbus_TCP': ['西门子Siemens'],
      'S7_TCP': ['通用', '西门子Siemens'],
      'OPC_DA': ['通用'],
      'OPC_UA': ['通用'],
      'MC3E_Binary_Ethernet': ['通用'],
      'MCA1E_Binary_Ethernet': ['通用'],
      'Fins_TCP': ['欧姆龙Omron']
    },
    ModelLists = {//设备型号列表
      'Modbus_TCP': ['通用'],
      'S7_TCP': ['hc', 'S7-200Smart'],
      'OPC_DA': [],
      'OPC_UA': [],
      'MC3E_Binary_Ethernet': [],
      'MCA1E_Binary_Ethernet': [],
      'Fins_TCP': []
    },
  
    [activeProto, setActiveProto] = useState(ProtocolNames[0]), // 当前选中的协议
    [initSupplier, setInitSupplier] = useState(Suppliers[activeProto]), //默认厂家
    [initModel, setInitModel] = useState(ModelLists[activeProto]), //设备型号列表
    [activeModel, setActiveModel] = useState(ModelLists[activeProto][0]), //默认设备型号
    [userPane, setUserPane] = useState(false), //默认设备型号

    isShowAttr = {
      'Modbus_TCP': ["IPAddress","DeviceID","Port","TimeOut","ByteOrder","StrByteOrder"],
      'S7_TCP': ["IPAddress", "Rack", "Slot"],
      'OPC_DA': ["IPAddress","ServerName","GroupName","UpdateRate","DeadBand","IsActive"],
      'OPC_UA': ["SessionName", "IPAddress", "SecurityMode", "SecurityPolicy", "UserIdentity", "UserName", "Password"],
      'MC3E_Binary_Ethernet': ["IPAddress","Port","StrByteOrder"],
      'MCA1E_Binary_Ethernet': ["IPAddress","Port","StrByteOrder"],
      'Fins_TCP': ["IPAddress","Port","StrByteOrder"]
    },

    //判断是否显示某个属性
    isShowFormItem = (att) => {
      return isShowAttr[activeProto].indexOf(att) < 0 ? false : true
    },
    //监听验证方式变化
    onChanguserIdentity = (e) => {
      e === 1 ? setUserPane(true) : setUserPane(false)
    },
  
    //监听协议名称的变化
    onProtocalNameChange = (e) => {
      console.log(e)
      setActiveProto(e)
      //修改默认厂家
      setInitSupplier(Suppliers[e][0])
      
      if (ModelLists[e]) {
        //修改设备型号列表
        setInitModel(ModelLists[e])
        //修改设备型号的值
        setActiveModel(ModelLists[e][0])
      } else {
        setInitModel([])
        setActiveModel("")
      }
      //手动修改form.item的选中值
      formRef.current.setFieldsValue({
        Supplier: Suppliers[e][0],
        Model: ModelLists[e][0],
      });
    },
    //监听厂家列表的变化
    onSupplierChange = e => {
      setInitSupplier(e);
      console.log(e, initSupplier)
    },
    onFinishEqu = (val) => {
      console.log('Success:', val);
      message.info('提交成功！');
    },
    onFinishFailedEqu = () => {
      message.error('提交失败！');
    }
    
  return (
    <Modal width='fit-content' title="添加设备" footer={null} visible={ props.visible }>
      <Form
        ref={ formRef }
        onFinish={onFinishEqu}
        onFinishFailed={onFinishFailedEqu}
        initialValues={{
          ProtocolName: activeProto,
          Supplier: initSupplier,
          Model: activeModel
        }}>
        <div style={{padding: '0 27px'}}>
          <Form.Item label="设备名称" name="Name"
            rules={[
              {
                required: true,
                message: '请输入设备名称',
              }
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item label="设备描述" name="Desc" placeholder="请输入设备描述" initialValue="">
            <Input/>
          </Form.Item>
        </div>
        <Divider></Divider>
        <div style={{padding: '0 27px'}}>
          <Form.Item label="协议名称" name="ProtocolName">
            <Select onChange={onProtocalNameChange}>
              {
                ProtocolNames.map(e => {
                  return <Option value={ e } key={e}>{ e }</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="设备厂家" name="Supplier">
            <Select>
              {
                Suppliers[activeProto].map(e => {
                  return <Option value={e} key={e}>{e}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="设备型号" name="Model" hidden={ !activeModel }>
            <Select>
              {
                activeModel ? (initModel.map((e,idx) => {
                  return <Option value={e} key = {idx}>{e}</Option>
                })):null
              }
            </Select>
          </Form.Item>
          {
            isShowFormItem("SessionName") ? (
              <Form.Item label="连接名" name="SessionName">
                <Input/>
              </Form.Item>
            ): null
          }
          {
            isShowFormItem("IPAddress") ? (
              <>
                <Form.Item label={ activeProto === "OPC_UA" ? "连接地址" :"设备IP"} name="IPAddress"
                  rules={[
                    {
                      required: true,
                      message: '请输入',
                    }, {
                      pattern: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
                      message: '请输入输入正确的地址',
                    }
                  ]}
                >
                  <Input/>
                </Form.Item>
                <Form.Item label="设备ID" name="DeviceID" placeholder="请输入设备ID"
                    rules={[
                      {
                        required: true,
                        message: '请输入设备ID',
                      }, {
                        pattern: /^\+?[1-9][0-9]*$/,
                        message: '请输入输入数字',
                      }
                    ]}
                  >
                  <Input/>
                </Form.Item>
              </>
            ) : null
          }
          {
            isShowFormItem("Port") ? (
              <Form.Item label="端口号" name="Port" placeholder="请输入端口号"
                rules={[
                  {
                    required: true,
                    message: '请输入端口号',
                  }, {
                    pattern: /^\+?[1-9][0-9]*$/,
                    message: '请输入输入大于0的整数',
                  }
                ]}
              >
                <Input type="Number"/>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("TimeOut") ? (
              <Form.Item label="超时时间" name="TimeOut" placeholder="请输入超时时间"
                rules={[
                  {
                    required: true,
                    message: '请输入超时时间',
                  }, {
                    pattern: /^\+?[1-9][0-9]*$/,
                    message: '请输入输入大于0的整数',
                  }
                ]}
              >
                <Input suffix="毫秒"/>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("ByteOrder") ? (
              <Form.Item label="32位字节顺序" name="ByteOrder" initialValue="1234">
                <Select>
                  <Option value="1234">1234</Option>
                  <Option value="2134">2134</Option>
                  <Option value="3412">3412</Option>
                  <Option value="4321">4321</Option>
                </Select>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("ServerName") ? (
              <Form.Item label="服务器名称" name="ServerName" placeholder="请输入服务器名称"
                rules={[
                  {
                    required: true,
                    message: '请输入服务器名称',
                  }
                ]}
              >
                <Input/>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("GroupName") ? (
              <Form.Item label="组名称" name="GroupName" placeholder="请输入组名称"
                rules={[
                  {
                    required: true,
                    message: '请输入组名称',
                  }
                ]}
              >
                <Input/>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("UpdateRate") ? (
              <Form.Item label="刷新速率" name="UpdateRate" placeholder="请输入刷新速率"
                rules={[
                  {
                    required: true,
                    message: '请输入刷新速率',
                  }, {
                    pattern: /^\+?[1-9][0-9]*$/,
                    message: '请输入输入大于0的整数',
                  }
                ]}
              >
                <Input suffix="mSec"/>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("DeadBand") ? (
              <Form.Item label="死区" name="DeadBand" placeholder="请输入死区"
                rules={[
                  {
                    required: true,
                    message: '请输入死区',
                  }, {
                    pattern: /^\+?[1-9][0-9]*$/,
                    message: '请输入输入大于0的整数',
                  }
                ]}
              >
                <Input type="number" suffix="%FS"/>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("IsActive") ? (
              <Form.Item label="是否启用" name="IsActive" initialValue="true">
                <Select>
                  <Option value="true">True</Option>
                  <Option value="false">False</Option>
                </Select>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("SecurityMode") ? (
              <Form.Item label="安全模式" name="SecurityMode" initialValue="0">
                <Select>
                  <Option value="0">不加密</Option>
                </Select>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("SecurityPolicy") ? (
              <Form.Item label="安全策略" name="SecurityPolicy" initialValue="0">
                <Select>
                  <Option value="0">不加密</Option>
                </Select>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("UserIdentity") ? (
              <Form.Item label="验证方式" name="UserIdentity" initialValue="0">
                <Select onChange={ onChanguserIdentity }>
                  <Option value="0">匿名</Option>
                  <Option value="1">登录验证</Option>
                </Select>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("Rack") ? (
              <Form.Item label="机架号" name="Rack">
                <Input/>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("Slot") ? (
              <Form.Item label="CPU插槽" name="Slot">
                <Input/>
              </Form.Item>
            ):null
          }
          {
            isShowFormItem("StrByteOrder") ?(
              activeProto === "Fins_TCP" || activeProto === "MCA1E_Binary_Ethernet" || activeProto === "MC3E_Binary_Ethernet" ? (
                <Form.Item name="StrByteOrder">
                  <Checkbox>字符串字节顺序</Checkbox>
                </Form.Item>
              ): (
                <Form.Item label="字符串字节顺序" name="StrByteOrder" initialValue="1234">
                  <Select>
                    <Option value="1234">1234</Option>
                    <Option value="2134">2134</Option>
                    <Option value="3412">3412</Option>
                    <Option value="4321">4321</Option>
                  </Select>
                </Form.Item>
              )
            ):null
          }
          {
            userPane ? (
              <>
                <Form.Item label="用户名" className="UserName">
                  <Input/>
                </Form.Item>
                <Form.Item label="密码" className="Password">
                  <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password"/>
                </Form.Item>
              </>
            ):null
          }

          <Form.Item className="form-footer">
            <Button type="default" className="login-form-button" onClick={ props.cancel }>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
export default AddEqu