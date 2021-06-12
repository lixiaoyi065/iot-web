import React, { PureComponent } from 'react'
import { Form, Input, Select, Button, Checkbox, message, Divider } from 'antd'
import store from 'store'

import { addEqu } from 'api/variable/index'

import "./index.less"

const { Option } = Select;

class AddEqu extends PureComponent {
  state = {
    ProtocolNames: ['Modbus_TCP', 'S7_TCP', 'OPC_DA', 'OPC_UA', 'MC3E_Binary_Ethernet', 'MCA1E_Binary_Ethernet', 'Fins_TCP'],//协议列表
    Suppliers: {//厂家列表
      'Modbus_TCP': ['通用', '西门子Siemens'],
      'S7_TCP': ['西门子Siemens'],
      'OPC_DA': ['通用'],
      'OPC_UA': ['通用'],
      'MC3E_Binary_Ethernet': ['通用'],
      'MCA1E_Binary_Ethernet': ['通用'],
      'Fins_TCP': ['欧姆龙Omron']
    },
    ModelLists: {//设备型号列表
      'Modbus_TCP': ['通用'],
      'S7_TCP': ['S7-300/400/1200/1500', 'S7-200Smart'],
      'OPC_DA': ['通用'],
      'OPC_UA': ['通用'],
      'MC3E_Binary_Ethernet': ['通用'],
      'MCA1E_Binary_Ethernet': ['通用'],
      'Fins_TCP': ['通用']
    },
    edit: false,
    activeProto: 'Modbus_TCP', // 当前选中的协议
    initSupplier: ['通用', '西门子Siemens'],  //默认厂家
    initModel: ['通用'], //设备型号列表
    activeModel: '通用', //默认设备型号
    userPane: false, //默认设备型号
    currenNode: {},//初始化
    isShowAttr: {
      'Modbus_TCP': ["ModelLists", "IPAddress", "DeviceID", "Port", "TimeOut", "ByteOrder", "StrByteOrder"],
      'S7_TCP': ["ModelLists", "IPAddress", "Rack", "Slot"],
      'OPC_DA': ["IPAddress", "ServerName", "GroupName", "UpdateRate", "DeadBand", "IsActive"],
      'OPC_UA': ["SessionName", "IPAddress", "SecurityMode", "SecurityPolicy", "UserIdentity", "UserName", "Password"],
      'MC3E_Binary_Ethernet': ["IPAddress", "Port", "StrByteOrder"],
      'MCA1E_Binary_Ethernet': ["IPAddress", "Port", "StrByteOrder"],
      'Fins_TCP': ["IPAddress", "Port", "StrByteOrder"]
    },
  }
  formRef = React.createRef()

  componentDidMount() {
    console.log(this.props.node)
    if (this.props.node) {
      this.setState({
        edit: true,
        activeProto: this.props.node.protocolName,
        currenNode: {
          name: this.props.node.name,
          NodeID: this.props.node.id
        }
      })
    }
  }

  //判断是否显示某个属性
  isShowFormItem = (att) => {
    if (this.state.activeProto) {
      return this.state.isShowAttr[this.state.activeProto].indexOf(att) < 0 ? false : true
    }
  }
  //监听验证方式变化
  onChanguserIdentity = (e) => {
    e === "登录验证" ? this.setUserPane(true) : this.setUserPane(false)
  }

  //监听协议名称的变化
  onProtocalNameChange = (e) => {
    console.log(e)
    this.setState({
      activeProto: e,
      initSupplier: this.state.Suppliers[e][0]
    }, () => {
      console.log(this.state.ModelLists[e])

      this.setState({
        initModel: this.state.ModelLists[e],
        //修改默认厂家
        activeModel: this.state.ModelLists[e][0]
      })
      // if (this.state.ModelLists[e]) {
      //   //修改设备型号列表、设备型号的值
      // } else {
      //   this.setState({
      //     initModel: [],
      //     activeModel: ""
      //   })
      // }
    })

    //手动修改form.item的选中值
    this.formRef.current.setFieldsValue({
      Supplier: this.state.Suppliers[e][0],
      Model: this.state.ModelLists[e][0],
    });
  }

  onFinishEqu = (val) => {
    //将提交的数据对象进行处理
    const list = ["id", "Name", "Desc", "ProtocolName", "Supplier", "Model"]
    const equObj = { params: {} }
    for (let key in val) {
      if (list.indexOf(key) < 0) {
        if (key === "StrByteOrder1") {
          equObj.params.StrByteOrder = val[key] ? "True" : "False"
        } else {
          equObj.params[key] = val[key]
        }
      } else {
        equObj[key] = val[key]
      }
    }
    console.log(equObj)
    if (val.nodeID) {
      console.log("编辑")
    } else {
      console.log("新增")
    }

    addEqu(equObj).then(res => {
      const { code, msg } = res
      if (val.nodeID) {
        //编辑设备
      } else {
        //新增设备
        console.log(res)
        if (code === 0) { //添加成功
          this.formRef.current.resetFields();
          //给设备树添加上新增的设备
          store.dispatch({
            type: "addNodes",
            data: {
              nodeID: res.data.deviceId,
              nodeName: val.Name,
              nodeType: 3,
              nodeNo: this.state.equLength + 1,
              canBeDeleted: true,
              fatherNodeID: "00000000-0000-0000-0000-000000000000",
              children: [
                {
                  nodeID: res.data.groupId,
                  nodeName: res.data.groupName,
                  // nodeType: res.nodeType,
                  canBeDeleted: true,
                  fatherNodeID: msg,
                  nodeType: 4,
                  nodeNo: 1,
                }
              ]
            }
          });
          //关闭弹窗
          this.props.cancel();
          message.info('提交成功！');
        } else {
          message.error(msg)
        }
      }
    })
  }
  onFinishFailedEqu = () => {
    message.error('提交失败！');
  }


  render() {
    return (
      <Form
        ref={this.formRef}
        onFinish={this.onFinishEqu}
        onFinishFailed={this.onFinishFailedEqu}
        initialValues={this.currenNode}>
        <div style={{ padding: '0 27px' }}>
          <Form.Item label="设备名称" name="Name" initialValue="测试设备"
            rules={[
              {
                required: true,
                message: '请输入设备名称',
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="设备描述" name="Desc" placeholder="请输入设备描述" initialValue="">
            <Input />
          </Form.Item>
          <Form.Item label="设备ID" name="id" hidden={true} initialValue="00000000-0000-0000-0000-000000000000">
            <Input />
          </Form.Item>
        </div>
        <Divider></Divider>
        <div style={{ padding: '0 27px' }}>
          {/* <Form.Item label="树节点类型" name="NodeType" hidden={true} initialValue="3">
            <Input/>
          </Form.Item> */}
          <Form.Item label="协议名称" name="ProtocolName">
            <Select onChange={this.onProtocalNameChange} disabled={this.state.edit}>
              {
                this.state.ProtocolNames.map(e => {
                  return <Option value={e} key={e}>{e}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="设备厂家" name="Supplier">
            <Select disabled={this.state.edit}>
              {
                this.state.Suppliers[this.state.activeProto] ? this.state.Suppliers[this.state.activeProto].map(e => {
                  return <Option value={e} key={e}>{e}</Option>
                }) : null
              }
            </Select>
          </Form.Item>
          <Form.Item label="设备型号" name="Model" hidden={this.isShowFormItem("ModelLists")}>
            <Select disabled={this.state.edit}>
              {
                this.state.activeModel ? (this.state.initModel.map((e, idx) => {
                  return <Option value={e} key={idx}>{e}</Option>
                })) : null
              }
            </Select>
          </Form.Item>
          {
            this.isShowFormItem("SessionName") ? (
              <Form.Item label="连接名" name="SessionName">
                <Input />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("IPAddress") ? (
              // <>
              <Form.Item label={this.state.activeProto === "OPC_UA" ? "连接地址" : "设备IP"} name="IPAddress" initialValue="127.0.0.1"
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
                <Input />
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("DeviceID") ? (
              <Form.Item label="设备ID" name="DeviceID" placeholder="请输入设备ID" initialValue="123456"
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
              // </>
            ) : null
          }
          {
            this.isShowFormItem("Port") ? (
              <Form.Item label="端口号" name="Port" placeholder="请输入端口号" initialValue="5000"
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
            this.isShowFormItem("TimeOut") ? (
              <Form.Item label="超时时间" name="TimeOut" placeholder="请输入超时时间" initialValue="5000"
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
            this.isShowFormItem("ByteOrder") ? (
              <Form.Item label="32位字节顺序" name="ByteOrder" initialValue="1234">
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
          }
          {
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
              <Form.Item label="是否启用" name="IsActive" initialValue="true">
                <Select>
                  <Option value="True">True</Option>
                  <Option value="False">False</Option>
                </Select>
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("SecurityMode") ? (
              <Form.Item label="安全模式" name="SecurityMode" initialValue="不加密">
                <Select>
                  <Option value="不加密">不加密</Option>
                </Select>
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("SecurityPolicy") ? (
              <Form.Item label="安全策略" name="SecurityPolicy" initialValue="不加密">
                <Select>
                  <Option value="不加密">不加密</Option>
                </Select>
              </Form.Item>
            ) : null
          }
          {
            this.isShowFormItem("UserIdentity") ? (
              <Form.Item label="验证方式" name="UserIdentity" initialValue="匿名">
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
          }
          {
            this.isShowFormItem("StrByteOrder") ?
              (
                this.state.activeProto === "Fins_TCP" || this.state.activeProto === "MCA1E_Binary_Ethernet" || this.state.activeProto === "MC3E_Binary_Ethernet" ?
                  (
                    <Form.Item valuePropName="checked" name="StrByteOrder1" initialValue={false}>
                      <Checkbox>字符串字节顺序</Checkbox>
                    </Form.Item>
                  ) : (
                    <Form.Item label="字符串字节顺序" name="StrByteOrder" initialValue="1234"
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
          }
          {
            this.state.userPane ? (
              <>
                <Form.Item label="用户名" className="UserName">
                  <Input />
                </Form.Item>
                <Form.Item label="密码" className="Password">
                  <Input.Password />
                </Form.Item>
              </>
            ) : null
          }

          {/* <Form.Item className="dialog-footer">
            <Button type="default" className="login-form-button" onClick={this.props.cancel}>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button">确认</Button>
          </Form.Item> */}
        </div>
      </Form>
    )
  }
}
export default AddEqu