import React, { PureComponent } from 'react'
import { Form, Input, Select, Button, Checkbox, message, Divider } from 'antd'

import { AddDevice, ModifyDevice } from 'api/variable'

const { Option } = Select;

export default class addDevice extends PureComponent {
  formRef = React.createRef()
  state = {
    protocolNames: ['Modbus_TCP', 'S7_TCP', 'OPC_DA', 'OPC_UA', 'MC3E_Binary_Ethernet', 'MCA1E_Binary_Ethernet', 'Fins_TCP'],//协议列表
    suppliers: {//厂家列表
      'Modbus_TCP': ['通用', '西门子Siemens'],
      'S7_TCP': ['西门子Siemens'],
      'OPC_DA': ['通用'],
      'OPC_UA': ['通用'],
      'MC3E_Binary_Ethernet': ['通用'],
      'MCA1E_Binary_Ethernet': ['通用'],
      'Fins_TCP': ['欧姆龙Omron']
    },
    modelLists: {//设备型号列表
      'Modbus_TCP': ['通用'],
      'S7_TCP': ['S7-300/400/1200/1500', 'S7-200Smart'],
      'OPC_DA': ['通用'],
      'OPC_UA': ['通用'],
      'MC3E_Binary_Ethernet': ['通用'],
      'MCA1E_Binary_Ethernet': ['通用'],
      'Fins_TCP': ['通用']
    },
    isShowAttr: { //根据协议显示对应的字段
      'Modbus_TCP': ["modelLists", "IPAddress", "deviceID", "port", "timeOut", "byteOrder", "strByteOrder"],
      'S7_TCP': ["modelLists", "IPAddress", "Rack", "Slot"],
      'OPC_DA': ["IPAddress", "ServerName", "GroupName", "UpdateRate", "DeadBand", "IsActive"],
      'OPC_UA': ["sessionName", "IPAddress", "securityMode", "securityPolicy", "userIdentity", "userName", "Password"],
      'MC3E_Binary_Ethernet': ["IPAddress", "port", "strByteOrder"],
      'MCA1E_Binary_Ethernet': ["IPAddress", "port", "strByteOrder"],
      'Fins_TCP': ["IPAddress", "port", "strByteOrder"]
    },
    activeProto: "Modbus_TCP", // 当前选中的协议
    initialValues: {
      id: "00000000-0000-0000-0000-000000000000",
      name: "测试设备",
      desc: "这是一段描述",
      // nodeType: "3",
      protocolName: "Modbus_TCP", //协议名称
      supplier: "通用",//设备厂家
      model: "通用",
      IPAddress: "127.0.0.1",
      deviceID: "1234",
      port: "5000",
      timeOut: "5000",
      byteOrder: "1234",
      IsActive: "True",
      securityMode: "不加密",
      securityPolicy: "不加密",
      userIdentity: "匿名",
      strByteOrder1: "false",
      strByteOrder: "1234"
    },//初始化表单数据
    checked: false
  }
  //判断是否显示某个属性
  isShowFormItem = item => {
    if (this.state.activeProto) {
      return this.state.isShowAttr[this.state.activeProto].indexOf(item) < 0 ? false : true
    }
  }
  //监听协议名称切换
  onProtocalNameChange = e => {
    console.log(e)
    this.setState({ activeProto: e }, () => {
      //修改设备厂家和设备协议的初始默认值
      this.formRef.current.setFieldsValue({
        supplier: this.state.suppliers[e][0],
        model: this.state.modelLists[e][0],
      });
    })
  }
  onFinish = val => {
    const list = ["id", "name", "desc", "nodeType", "protocolName", "supplier", "model"]
    //数据二次处理
    const equObj = { params: {} }
    for (let key in val) {
      if (list.indexOf(key) < 0) {
        if (key === "strByteOrder1") {
          equObj.params.strByteOrder = val[key]
        } else {
          equObj.params[key] = val[key]
        }
      } else {
        equObj[key] = val[key]
      }
    }
    if (val.id === "00000000-0000-0000-0000-000000000000") {
      console.log("新增设备", equObj)
      AddDevice(equObj).then(res => {
        console.log(res)
      })
    } else {
      ModifyDevice(equObj).then(res => {
        console.log(res)
      })
      console.log("编辑设备", equObj)
    }
  }
  componentDidMount() {
    if (this.props.node) {
      // 将传过来的设备数据进行处理
      const list = ["id", "name", "desc", "nodeType", "protocolName", "supplier", "model"];
      const node = this.props.node,
        initValue = {
          id: node.id,
          name: node.name,
          desc: node.desc,
          // nodeType: "3",
          protocolName: node.protocolName, //协议名称
          supplier: node.supplier,//设备厂家
          model: node.model,
        },
        { activeProto } = this.state;
      for (let i in node.params) {
        if (i === "strByteOrder") {
          if (activeProto === "Fins_TCP" || activeProto === "MCA1E_Binary_Ethernet" || activeProto === "MC3E_Binary_Ethernet") {
            initValue.strByteOrder1 = node.params[i]
          } else {
            initValue.strByteOrder = node.params[i]
          }
        } else {
          initValue[i] = node.params[i]
        }
      }
      //更新表单中的值
      this.formRef.current.setFieldsValue(initValue);
      console.log(initValue, node)
      this.setState({
        activeProto: node.protocolName,
        edit: true
      })
    }
  }

  render() {
    const { protocolNames, suppliers, modelLists, initialValues, activeProto, edit } = this.state
    return (
      <Form
        ref={this.formRef}
        onFinish={this.onFinish}
        initialValues={initialValues}
      >
        <div style={{ padding: '0 27px' }}>
          <Form.Item label="设备ID" name="id" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item label="设备名称" name="name"
            rules={[
              {
                required: true,
                message: '请输入设备名称',
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="设备描述" name="desc" placeholder="请输入设备描述">
            <Input />
          </Form.Item>
        </div>
        <Divider></Divider>
        <div style={{ padding: '0 27px' }}>
          {/* <Form.Item label="树节点类型" name="nodeType" hidden={true} >
            <Input />
          </Form.Item> */}
          <Form.Item label="协议名称" name="protocolName" >
            <Select onChange={this.onProtocalNameChange} disabled={edit}>
              {
                protocolNames.map(e => {
                  return <Option value={e} key={e}>{e}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="设备厂家" name="supplier">
            <Select disabled={edit}>
              {
                suppliers[activeProto] ? suppliers[activeProto].map(e => {
                  return <Option value={e} key={e}>{e}</Option>
                }) : null
              }
            </Select>
          </Form.Item>
          <Form.Item label="设备型号" name="model" hidden={!this.isShowFormItem("modelLists")}>
            <Select disabled={edit}>
              {
                modelLists[activeProto].map((e, idx) => {
                  return <Option value={e} key={idx}>{e}</Option>
                })
              }
            </Select>
          </Form.Item>
          {
            this.isShowFormItem("sessionName") ? (
              <Form.Item label="连接名" name="sessionName">
                <Input />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("IPAddress") ? (
              <Form.Item label={this.state.activeProto === "OPC_UA" ? "连接地址" : "设备IP"} name="IPAddress"
                rules={[
                  {
                    required: true,
                    message: `请输入 ${this.state.activeProto === "OPC_UA" ? "连接地址" : "设备IP"}`,
                  }, {
                    pattern: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
                    message: '请输入输入正确的地址',
                  }
                ]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("deviceID") ? (
              <Form.Item label="设备ID" name="deviceID" placeholder="请输入设备ID"
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
                <Input />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("port") ? (
              <Form.Item label="端口号" name="port" placeholder="请输入端口号"
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
                <Input type="Number" />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("timeOut") ? (
              <Form.Item label="超时时间" name="timeOut" placeholder="请输入超时时间"
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
                <Input suffix="毫秒" />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("byteOrder") ? (
              <Form.Item label="32位字节顺序" name="byteOrder">
                <Select>
                  <Option value="1234">1234</Option>
                  <Option value="2134">2134</Option>
                  <Option value="3412">3412</Option>
                  <Option value="4321">4321</Option>
                </Select>
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("ServerName") ? (
              <Form.Item label="服务器名称" name="ServerName" placeholder="请输入服务器名称"
                rules={[
                  {
                    required: true,
                    message: '请输入服务器名称',
                  }
                ]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("GroupName") ? (
              <Form.Item label="组名称" name="GroupName" placeholder="请输入组名称"
                rules={[
                  {
                    required: true,
                    message: '请输入组名称',
                  }
                ]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("UpdateRate") ? (
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
                <Input suffix="mSec" />
              </Form.Item>
            ) : null
          }{
            this.isShowFormItem("DeadBand") ? (
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
                <Input type="number" suffix="%FS" />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("IsActive") ? (
              <Form.Item label="是否启用" name="IsActive" >
                <Select>
                  <Option value="True">True</Option>
                  <Option value="False">False</Option>
                </Select>
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("securityMode") ? (
              <Form.Item label="安全模式" name="securityMode" initialValue="不加密">
                <Select>
                  <Option value="不加密">不加密</Option>
                </Select>
              </Form.Item>
            ) : null
          }{
            this.isShowFormItem("securityPolicy") ? (
              <Form.Item label="安全策略" name="securityPolicy" initialValue="不加密">
                <Select>
                  <Option value="不加密">不加密</Option>
                </Select>
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("userIdentity") ? (
              <Form.Item label="验证方式" name="userIdentity" initialValue="匿名">
                <Select onChange={this.onChanguserIdentity}>
                  <Option value="匿名">匿名</Option>
                  <Option value="登录验证">登录验证</Option>
                </Select>
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("Rack") ? (
              <Form.Item label="机架号" name="Rack">
                <Input />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("Slot") ? (
              <Form.Item label="CPU插槽" name="Slot">
                <Input />
              </Form.Item>
            ) : null
          }{
            this.isShowFormItem("strByteOrder") ?
              (
                this.state.activeProto === "Fins_TCP" || this.state.activeProto === "MCA1E_Binary_Ethernet" || this.state.activeProto === "MC3E_Binary_Ethernet" ?
                  (
                    <Form.Item valuePropName="checked" name="strByteOrder1">
                      <Checkbox>字符串字节顺序</Checkbox>
                    </Form.Item>
                  ) : (
                    <Form.Item label="字符串字节顺序" name="strByteOrder"
                      rules={[{
                        require: true
                      }]
                      }>
                      <Select>
                        <Option value="1234">1234</Option>
                        <Option value="2134">2134</Option>
                        <Option value="3412">3412</Option>
                        <Option value="4321">4321</Option>
                      </Select>
                    </Form.Item>
                  )
              ) : null
          }{
            this.state.userPane ? (
              <>
                <Form.Item label="用户名" className="userName">
                  <Input />
                </Form.Item>
                <Form.Item label="密码" className="password">
                  <Input.Password />
                </Form.Item>
              </>
            ) : null
          }
          <Form.Item className="form-footer">
            <Button type="default" className="login-form-button" onClick={this.props.cancel}>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
          </Form.Item>
        </div>
      </Form>
    )
  }
}