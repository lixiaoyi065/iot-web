import React, { PureComponent } from 'react'
import { Form, Select, Input, Button,Tree } from 'antd'
import "./index.less"

let addressForm = React.createRef()
export default class config extends PureComponent {
  state={
    stringLength: this.props.row.stringLength,
    // 需e要在此处手动修改协议protocolNam 和 数据类型 dataType 模拟不同协议下的数据结构
    popupData: {
      protocolName: this.props.data.protocolName,
      // dataType: $("#dataType" + this.props.row.key).parent().siblings(".ant-select-selection-item").attr("title"),
      dataType: this.props.row.dataType,
      dataValue: '',  // 变量地址
      dataLen: '',  // 字符长度
    },
    // 定义一个提交的数据结构， 用来填写默认值与回显
    addressData: {
      dataArea: '', // 数据区域
      letters: 'M', // 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD）
      lettleValue: 0, // 寄存器字母对应的值
      DBNum: 1, // DB号
      bit: 0,  //  位
      len: "", // 长度
      addressOffset: 1, // 地址偏移量
      addressType: '字节', // 地址类型
      addressValue: '', // 最后组装出来的变量值
      showList: [], // 弹窗显示的form块
      address: 1, // S7_TCP 以外的协议 偏移地址
    },
    data: {}, 
    type: "",
    formData: {},
    showList:[]
  }

  componentDidMount(){
    this.setState({ formData: JSON.parse(JSON.stringify(this.state.addressData)) }, () => {
      this.openPop()
    })
  }

  openPop = ()=>{
    let { popupData, formData } = this.state
    let newData = {};
    if (popupData.protocolName === 'S7_TCP') {    //  渲染 S7_TCP弹窗
      // 1: 数据区域  2. 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
      // 数据区域 需要赋予默认值或回显
      let dataArea = formData.dataArea ? formData.dataArea : '位'
      if (popupData.dataType === '二进制变量') {
        newData.showList = formData.showList.length === 0 ?  [1,2,5] : formData.showList
      } else if (popupData.dataType === '有符号8位整型' || popupData.dataType === '无符号8位整型') {
        newData.letters = dataArea === '位' ?  formData.letters = 'MB' : formData.letters
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '有符号16位整型' || popupData.dataType === '无符号16位整型') {
        newData.letters = dataArea === '位' ?  formData.letters = 'MW' : formData.letters
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '有符号32位整型' || popupData.dataType === '无符号32位整型' || popupData.dataType === 'F32位浮点数IEEE754' || popupData.dataType === '定时器') {
        newData.letters = dataArea === '位' ?  formData.letters = 'MD' : formData.letters
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '有符号64位整型' || popupData.dataType === '无符号64位整型' || popupData.dataType === 'F64位浮点数IEEE754' || popupData.dataType === '日期'|| popupData.dataType === '时间'|| popupData.dataType === '日期时间') {
        newData.showList = formData.showList.length === 0 ?  [1,4,7] : formData.showList
      } else if (popupData.dataType === '文本变量8位字符集' || popupData.dataType === '文本变量16位字符集') {
        newData.showList = formData.showList.length === 0 ?  [1,4,6] : formData.showList
      } else if (popupData.dataType === '字符串' || popupData.dataType === '宽字符串') {
        newData.showList = formData.showList.length === 0 ?  [1,4,6,7] : formData.showList
      }
      console.log(formData.showList, formData, popupData.dataType)
      // this.renderS7_TCPHTML(formData.showList, formData, popupData.dataType)
      this.setState(state=>{
        console.log(newData.showList)
        return {
          formData: Object.assign(state.formData, newData),
          type: popupData.dataType
        }
      })
    }else if(popupData.protocolName === 'Modbus_TCP'){
      // 1. 数据区域  2. 偏移地址   3.位  4. 长度
      let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754']
      let dataArea = formData.dataArea ? formData.dataArea : '线圈状态'
      if (popupData.dataType === '二进制变量') {
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }  else if (types.includes(popupData.dataType)) {
        // 此处判断赋默认值还是回显值
        let areas = ['输入寄存器', '保持寄存器']
        dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '输入寄存器'
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['输入寄存器', '保持寄存器']
        dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '输入寄存器'
        newData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } 
      addressForm.current.setFieldsValue({
        dataArea: dataArea
      })
      this.setState(state=>{
        return {
          formData: Object.assign(state.formData, newData, {dataArea: dataArea}),
          type: popupData.dataType
        }
      })
    }else if (popupData.protocolName === 'MC3E_Binary_Ethernet') { //  渲染 MC3E_Binary_Ethernet 弹窗
      let dataArea = formData.dataArea ? formData.dataArea : '输入寄存器（X）'
      if (popupData.dataType === '二进制变量') {
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '链接寄存器（W）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        newData.dataArea = areas.includes(dataArea) ? formData.dataArea : '数据寄存器（D）'
        newData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '链接寄存器（W）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        newData.dataArea = areas.includes(dataArea) ? formData.dataArea : '数据寄存器（D）'
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }
      this.setState(state=>{
        return {
          formData: Object.assign(state.formData, newData),
          type: popupData.dataType
        }
      })
    } else if (popupData.protocolName === 'MCA1E_Binary_Ethernet') { //  渲染 MCA1E_Binary_Ethernet 弹窗
      newData.dataArea = formData.dataArea ? formData.dataArea : '输入寄存器（X）'
      if (popupData.dataType === '二进制变量') {
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }  else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '扩展寄存器（R）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        newData.dataArea = areas.includes(newData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        newData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '扩展寄存器（R）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        newData.dataArea = areas.includes(newData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }
      this.setState(state=>{
        return {
          formData: Object.assign(state.formData, newData),
          type: popupData.dataType
        }
      })
    } else if (popupData.protocolName === 'Fins_TCP') { //  渲染 Fins_TCP 弹窗
      newData.dataArea = formData.dataArea ? formData.dataArea : 'CIO'
      if (popupData.dataType === '二进制变量') {
        newData.showList = formData.showList.length === 0 ?  [1,2,3] : formData.showList
      } else if (popupData.dataType === '字符串') {
        newData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        newData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }
      this.setState(state=>{
        return {
          formData: Object.assign(state.formData, newData),
          type: popupData.dataType
        }
      })
    }
  }

  // 选择下拉内容 -- S7_TCP协议
  changeData = (e, prop, type)=>{
    let obj={};
    obj[prop] = e
    console.log(e, prop)
      if (type === '二进制变量') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          
          if (e === '位') {
            obj.letters = 'M'
            obj.showList = [1,2,5]
          } else if (e === 'DB') {
            console.log("........")
            obj.letters = 'DBX'
            obj.showList = [1,2,3,5]
          } else if (e === '输入') {
            obj.letters = 'I'
            obj.showList = [1,2,5]
          } else if (e === '输出') {
            obj.letters = 'Q'
            obj.showList = [1,2,5]
          }
        }
      } else if (type === '有符号8位整型' || type === '无符号8位整型') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.letters = 'MB'
              obj.showList = [1,2]
            } else if (e === 'DB') {
              obj.letters = 'DBB'
              obj.showList = [1,2,3]
            } else if (e === '输入') {
              obj.letters = 'IB'
              obj.showList = [1,2]
            } else if (e === '输出') {
              obj.letters = 'QB'
              obj.showList = [1,2]
            }
          }
        } else if (type === '有符号16位整型' || type === '无符号16位整型') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.letters = 'MW'
              obj.showList = [1,2]
            } else if (e === 'DB') {
              obj.letters = 'DBW'
              obj.showList = [1,2,3]
            } else if (e === '输入') {
              obj.letters = 'IW'
              obj.showList = [1,2]
            } else if (e === '输出') {
              obj.letters = 'QW'
              obj.showList = [1,2]
            }
          }
        } else if (type === '有符号32位整型' || type === '无符号32位整型' || type === 'F32位浮点数IEEE754' || type === '定时器') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.letters = 'MD'
              obj.showList = [1,2]
            } else if (e === 'DB') {
              obj.letters = 'DBD'
              obj.showList = [1,2,3]
            } else if (e === '输入') {
              obj.letters = 'ID'
              obj.showList = [1,2]
            } else if (e === '输出') {
              obj.letters = 'QD'
              obj.showList = [1,2]
            }
          }
        } else if (type === '有符号64位整型' || type === '无符号64位整型' || type === 'F64位浮点数IEEE754' || type === '日期'|| type === '时间'|| type === '日期时间') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.showList = [1,4,7]
            } else if (e === 'DB') {
              obj.showList = [1,3,4,7]
              console.log(obj)
            } else if (e === '输入') {
              obj.showList = [1,4,7]
            } else if (e === '输出') {
              obj.showList = [1,4,7]
            }
          }
        } else if (type === '文本变量8位字符集' || type === '文本变量16位字符集') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.showList = [1,4,6]
            } else if (e === 'DB') {
              obj.showList = [1,3,4,6]
            } else if (e === '输入') {
              obj.showList = [1,4,6]
            } else if (e === '输出') {
              obj.showList = [1,4,6]
            }
          }
        } else if (type === '字符串' || type === '宽字符串') {
          if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
            if (e === '位') {
              obj.showList = [1,4,6,7]
            } else if (e === 'DB') {
              obj.showList = [1,3,4,6,7]
            } else if (e === '输入') {
              obj.showList = [1,4,6,7]
            } else if (e === '输出') {
              obj.showList = [1,4,6,7]
            }
          }
        }
    this.setState(state => {
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, obj)))
      }
    })
  }

  // 选择下拉内容 -- Modbus_TCP协议
  changeModbus_TCPData = (e, prop, type)=>{
    let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754']
    this.setState(state=>{
      let formData={};
      formData[prop] = e
      if (type === '二进制变量') {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (e === '线圈状态') {
            formData.showList = [1,2]
          } else if (e === '离散输入状态') {
            formData.showList = [1,2]
          } else if (e === '输入寄存器') {
            formData.showList = [1,2,3]
          } else if (e === '保持寄存器') {
            formData.showList = [1,2,3]
          }
        }
      } else if (types.includes(type)) {
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
           if (e === '输入寄存器') {
            formData.showList = [1,2]
          } else if (e === '保持寄存器') {
            formData.showList = [1,2]
          }
        }
      }
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, formData)))
      }
    })
  }
  // 选择下拉内容 -- MC3E_Binary_Ethernet协议
  changeMBEData = (e, prop, type)=> {
    let formData = {};
    formData[prop] = e;
    this.setState(state=>{
      if (type === '二进制变量') {
        let types = ['输入寄存器（X）','输出寄存器（Y）','内部继电器（M）','定时器（触点）（TS）','定时器（线圈）（TC）','计数器（触点）（CS）','计数器（线圈）（CC）']
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (types.includes(e)) {
            formData.showList = [1,2]
          } else {
            formData.showList = [1,2,3]
          }
        }
      }
    
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, formData)))
      }
    })
  }
  // 选择下拉内容 -- MCA1E_Binary_Ethernet协议
  changeMABEData = (e, prop, type)=> {
    let formData = {};
    formData[prop] = e;
    this.setState(state=>{
      if (type === '二进制变量') {
        let types = ['输入寄存器（X）','输出寄存器（Y）','辅助继电器（M）','状态（S）','定时器（触点）（TS）','计数器（触点）（CS）']
        if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
          if (types.includes(e)) {
            formData.showList = [1,2]
          } else {
            formData.showList = [1,2,3]
          }
        }
      }
    
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, formData)))
      }
    })
  }
  // 选择下拉内容 -- Fins_TCP协议
  changeFins_TCPData (e, prop, type) {
    let formData = {};
    formData[prop] = e;
    this.setState(state=>{
      if (type === '二进制变量') {
        if (e === 'TIM/CNT(Complettion Flag)') {
          formData.showList = [1,2]
        } else {
          formData.showList = [1,2,3]
        }
      }
      return {
        formData: JSON.parse(JSON.stringify(Object.assign(state.formData, formData)))
      }
    })
  }

  blurData = (e, prop, protocal)=>{
    console.log(e, prop, protocal)
  }

  arrayEqual = (arr1, arr2)=> {
    if (arr1 === arr2) return true;
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; ++i) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  //提交弹窗
  confirmPop = () => {
    let {arrayEqual} = this
    let { popupData } = this.state
    // 协议名称： S7_TCP   Modbus_TCP  OPC_DA  OPC_UA  MC3E_Binary_Ethernet  MCA1E_Binary_Ethernet  Fins_TCP
    let addressData = JSON.parse(JSON.stringify(this.state.formData))
    
    if (popupData.protocolName === 'S7_TCP') {
      // 1: 数据区域  2. 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
      /* 根据showList中的代码块  处理生成的变量 */
      if (arrayEqual(addressData.showList, [1,2,5])) {
        popupData.dataValue = `${addressData.letters + addressData.lettleValue}.${addressData.bit}` 
      } else if (arrayEqual(addressData.showList, [1,2,3,5])) {
        popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.${addressData.letters + addressData.lettleValue}.${addressData.bit}`
      } else if (arrayEqual(addressData.showList, [1,2])) {
        popupData.dataValue = `${addressData.letters + addressData.lettleValue}`
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.${addressData.letters + addressData.lettleValue}`
      } else if (arrayEqual(addressData.showList, [1,4,7])) {
        if (addressData.dataArea === '位') {
          console.log(addressData.addressType == "字")
          if (addressData.addressType === '字节') {
            popupData.dataValue = `MB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `MW${addressData.addressOffset}`
          } else if (addressData.addressType === '双字'){
            popupData.dataValue = `MD${addressData.addressOffset}`
          }
        } else if (addressData.dataArea === '输入') {
          if (addressData.addressType === '字节') {
            popupData.dataValue = `IB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `IW${addressData.addressOffset}`
          } else if (addressData.addressType === '双字'){
            popupData.dataValue = `ID${addressData.addressOffset}`
          }
        } else if (addressData.dataArea === '输出') {
          if (addressData.addressType === '字节') {
            popupData.dataValue = `QB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `QW${addressData.addressOffset}`
          } else if (addressData.addressType === '双字'){
            popupData.dataValue = `QD${addressData.addressOffset}`
          }
        }
      } else if (arrayEqual(addressData.showList, [1,3,4,7])) {
        if (addressData.addressType === '字节') {
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBB${addressData.addressOffset}`
        } else if (addressData.addressType === '字') {
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBW${addressData.addressOffset}`
        } else if (addressData.addressType === '双字'){
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBD${addressData.addressOffset}`
        }
      } else if (arrayEqual(addressData.showList, [1,4,6])) {
        if (addressData.dataArea === '位') {
          popupData.dataValue = `MB${addressData.addressOffset}`
        } else if (addressData.dataArea === '输入') {
          popupData.dataValue = `IB${addressData.addressOffset}`
        } else if (addressData.dataArea === '输出') {
          popupData.dataValue = `QB${addressData.addressOffset}`
        }
      } else if (arrayEqual(addressData.showList, [1,3,4,6])) {
        popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBB${addressData.addressOffset}`
      } else if (arrayEqual(addressData.showList, [1,4,6,7])) {
        if (addressData.dataArea === '位') {
          if (addressData.addressType === '字节') {
            popupData.dataValue = `MB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `MW${addressData.addressOffset}`
          }
        } else if (addressData.dataArea === '输入') {
          if (addressData.addressType === '字节') {
            popupData.dataValue = `IB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `IW${addressData.addressOffset}`
          }
        } else if (addressData.dataArea === '输出') {
          if (addressData.addressType === '字节') {
            popupData.dataValue = `QB${addressData.addressOffset}`
          } else if (addressData.addressType === '字') {
            popupData.dataValue = `QW${addressData.addressOffset}`
          }
        }
      } else if (arrayEqual(addressData.showList, [1,3,4,6,7])) {
        if (addressData.addressType === '字节') {
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBB${addressData.addressOffset}`
        } else if (addressData.addressType === '字') {
          popupData.dataValue = `${addressData.dataArea + addressData.DBNum}.DBW${addressData.addressOffset}`
        }
      }
    } else if (popupData.protocolName === 'Modbus_TCP') {
      // 1. 数据区域  2. 偏移地址   3.位  4. 长度
      if (arrayEqual(addressData.showList, [1,2]) || arrayEqual(addressData.showList, [1,2,4])) {
        if (addressData.dataArea === '线圈状态') {
          popupData.dataValue = `0${addressData.address.toString().padStart(5, '0')}`
        } else if (addressData.dataArea === '离散输入状态') {
          popupData.dataValue = `1${addressData.address.toString().padStart(5, '0')}`
        } else if (addressData.dataArea === '输入寄存器') {
          popupData.dataValue = `3${addressData.address.toString().padStart(5, '0')}`
        } else if (addressData.dataArea === '保持寄存器') {
          popupData.dataValue = `4${addressData.address.toString().padStart(5, '0')}`
        }
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        if (addressData.dataArea === '线圈状态') {
          popupData.dataValue = `0${addressData.address.toString().padStart(5, '0')}.${addressData.bit}`
        } else if (addressData.dataArea === '离散输入状态') {
          popupData.dataValue = `1${addressData.address.toString().padStart(5, '0')}.${addressData.bit}`
        } else if (addressData.dataArea === '输入寄存器') {
          popupData.dataValue = `3${addressData.address.toString().padStart(5, '0')}.${addressData.bit}`
        } else if (addressData.dataArea === '保持寄存器') {
          popupData.dataValue = `4${addressData.address.toString().padStart(5, '0')}.${addressData.bit}`
        }
      }
    }else if (popupData.protocolName === 'MC3E_Binary_Ethernet') {
      // 1. 数据区域    2.  地址    3.  位    4. 长度
      if (arrayEqual(addressData.showList, [1,2]) || arrayEqual(addressData.showList, [1,2,4])) {
        if (addressData.dataArea === '输入寄存器（X）') {
          popupData.dataValue = `X${addressData.address}`
        } else if (addressData.dataArea === '输出寄存器（Y）') {
          popupData.dataValue = `Y${addressData.address}`
        } else if (addressData.dataArea === '内部继电器（M）') {
          popupData.dataValue = `M${addressData.address}`
        } else if (addressData.dataArea === '定时器（触点）（TS）') {
          popupData.dataValue = `TS${addressData.address}`
        } else if (addressData.dataArea === '定时器（线圈）（TC）') {
          popupData.dataValue = `TC${addressData.address}`
        } else if (addressData.dataArea === '计数器（触点）（CS）') {
          popupData.dataValue = `CS${addressData.address}`
        } else if (addressData.dataArea === '计数器（线圈）（CC）') {
          popupData.dataValue = `CC${addressData.address}`
        } else if (addressData.dataArea === '数据寄存器（D）') {
          popupData.dataValue = `D${addressData.address}`
        } else if (addressData.dataArea === '链接寄存器（W）') {
          popupData.dataValue = `W${addressData.address}`
        } else if (addressData.dataArea === '定时器（当前值）（TN）') {
          popupData.dataValue = `TN${addressData.address}`
        } else if (addressData.dataArea === '计数器（当前值）（CN）') {
          popupData.dataValue = `CN${addressData.address}`
        }
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        if (addressData.dataArea === '输入寄存器（X）') {
          popupData.dataValue = `X${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '输出寄存器（Y）') {
          popupData.dataValue = `Y${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '内部继电器（M）') {
          popupData.dataValue = `M${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（触点）（TS）') {
          popupData.dataValue = `TS${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（线圈）（TC）') {
          popupData.dataValue = `TC${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（触点）（CS）') {
          popupData.dataValue = `CS${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（线圈）（CC）') {
          popupData.dataValue = `CC${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '数据寄存器（D）') {
          popupData.dataValue = `D${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '链接寄存器（W）') {
          popupData.dataValue = `W${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（当前值）（TN）') {
          popupData.dataValue = `TN${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（当前值）（CN）') {
          popupData.dataValue = `CN${addressData.address}.${addressData.bit}`
        }
      }
      
  
    } else if (popupData.protocolName === 'MCA1E_Binary_Ethernet') {
      // 1. 数据区域    2.  地址    3.  位    4. 长度
      if (arrayEqual(addressData.showList, [1,2]) || arrayEqual(addressData.showList, [1,2,4])) {
        if (addressData.dataArea === '输入寄存器（X）') {
          popupData.dataValue = `X${addressData.address}`
        } else if (addressData.dataArea === '输出寄存器（Y）') {
          popupData.dataValue = `Y${addressData.address}`
        } else if (addressData.dataArea === '辅助继电器（M）') {
          popupData.dataValue = `M${addressData.address}`
        } else if (addressData.dataArea === '状态（S）') {
          popupData.dataValue = `S${addressData.address}`
        } else if (addressData.dataArea === '定时器（触点）（TS）') {
          popupData.dataValue = `TS${addressData.address}`
        } else if (addressData.dataArea === '计数器（触点）（CS）') {
          popupData.dataValue = `CS${addressData.address}`
        } else if (addressData.dataArea === '数据寄存器（D）') {
          popupData.dataValue = `D${addressData.address}`
        } else if (addressData.dataArea === '扩展寄存器（R）') {
          popupData.dataValue = `R${addressData.address}`
        } else if (addressData.dataArea === '定时器（当前值）（TN）') {
          popupData.dataValue = `TN${addressData.address}`
        } else if (addressData.dataArea === '计数器（当前值）（CN）') {
          popupData.dataValue = `CN${addressData.address}`
        }
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        if (addressData.dataArea === '输入寄存器（X）') {
          popupData.dataValue = `X${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '输出寄存器（Y）') {
          popupData.dataValue = `Y${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '辅助继电器（M）') {
          popupData.dataValue = `M${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '状态（S）') {
          popupData.dataValue = `S${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（触点）（TS）') {
          popupData.dataValue = `TS${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（触点）（CS）') {
          popupData.dataValue = `CS${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '数据寄存器（D）') {
          popupData.dataValue = `D${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '扩展寄存器（R）') {
          popupData.dataValue = `R${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '定时器（当前值）（TN）') {
          popupData.dataValue = `TN${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === '计数器（当前值）（CN）') {
          popupData.dataValue = `CN${addressData.address}.${addressData.bit}`
        }
      }
    } else if (popupData.protocolName === 'Fins_TCP') {
      // 1. 数据区域    2.  地址    3.  位    4. 长度
      if (arrayEqual(addressData.showList, [1,2]) || arrayEqual(addressData.showList, [1,2,4])) {
        if (addressData.dataArea === 'CIO') {
          popupData.dataValue = `CIO${addressData.address}`
        } else if (addressData.dataArea === 'WR') {
          popupData.dataValue = `W${addressData.address}`
        } else if (addressData.dataArea === 'HR') {
          popupData.dataValue = `H${addressData.address}`
        } else if (addressData.dataArea === 'AR') {
          popupData.dataValue = `A${addressData.address}`
        } else if (addressData.dataArea === 'TIM/CNT(Complettion Flag)') {
          popupData.dataValue = `T${addressData.address}`
        } else if (addressData.dataArea === 'DM') {
          popupData.dataValue = `D${addressData.address}`
        } else if (addressData.dataArea === 'EM current bank') {
          popupData.dataValue = `E${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 0') {
          popupData.dataValue = `E00_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 1') {
          popupData.dataValue = `E01_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 2') {
          popupData.dataValue = `E02_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 3') {
          popupData.dataValue = `E03_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 4') {
          popupData.dataValue = `E04_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 5') {
          popupData.dataValue = `E05_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 6') {
          popupData.dataValue = `E06_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 7') {
          popupData.dataValue = `E07_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 8') {
          popupData.dataValue = `E08_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 9') {
          popupData.dataValue = `E09_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank A') {
          popupData.dataValue = `E0A_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank B') {
          popupData.dataValue = `E0B_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank C') {
          popupData.dataValue = `E0C_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank D') {
          popupData.dataValue = `E0D_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank E') {
          popupData.dataValue = `E0E_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank F') {
          popupData.dataValue = `E0F_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 10') {
          popupData.dataValue = `E10_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 11') {
          popupData.dataValue = `E11_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 12') {
          popupData.dataValue = `E12_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 13') {
          popupData.dataValue = `E13_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 14') {
          popupData.dataValue = `E14_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 15') {
          popupData.dataValue = `E15_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 16') {
          popupData.dataValue = `E16_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 17') {
          popupData.dataValue = `E17_${addressData.address}`
        } else if (addressData.dataArea === 'EM bank 18') {
          popupData.dataValue = `E18_${addressData.address}`
        }
      } else if (arrayEqual(addressData.showList, [1,2,3])) {
        if (addressData.dataArea === 'CIO') {
          popupData.dataValue = `CIO${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'WR') {
          popupData.dataValue = `W${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'HR') {
          popupData.dataValue = `H${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'AR') {
          popupData.dataValue = `A${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'TIM/CNT(Complettion Flag)') {
          popupData.dataValue = `T${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'DM') {
          popupData.dataValue = `D${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM current bank') {
          popupData.dataValue = `E${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 0') {
          popupData.dataValue = `E00_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 1') {
          popupData.dataValue = `E01_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 2') {
          popupData.dataValue = `E02_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 3') {
          popupData.dataValue = `E03_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 4') {
          popupData.dataValue = `E04_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 5') {
          popupData.dataValue = `E05_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 6') {
          popupData.dataValue = `E06_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 7') {
          popupData.dataValue = `E07_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 8') {
          popupData.dataValue = `E08_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 9') {
          popupData.dataValue = `E09_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank A') {
          popupData.dataValue = `E0A_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank B') {
          popupData.dataValue = `E0B_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank C') {
          popupData.dataValue = `E0C_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank D') {
          popupData.dataValue = `E0D_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank E') {
          popupData.dataValue = `E0E_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank F') {
          popupData.dataValue = `E0F_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 10') {
          popupData.dataValue = `E10_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 11') {
          popupData.dataValue = `E11_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 12') {
          popupData.dataValue = `E12_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 13') {
          popupData.dataValue = `E13_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 14') {
          popupData.dataValue = `E14_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 15') {
          popupData.dataValue = `E15_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 16') {
          popupData.dataValue = `E16_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 17') {
          popupData.dataValue = `E17_${addressData.address}.${addressData.bit}`
        } else if (addressData.dataArea === 'EM bank 18') {
          popupData.dataValue = `E18_${addressData.address}.${addressData.bit}`
        }
      }
    }
    console.log(popupData.dataValue, addressData.dataArea)
    return ({
      address: popupData.dataValue,
      stringLength: addressData.len+""
    })
  }

  onFinish = (val) => {
    this.props.onFinish(this.confirmPop(), this.props.row);
  }

  render() {
    let {type, formData, popupData} = this.state
    let items = formData.showList || []; 
    let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754', '字符串']
    let binaryarea = ['CIO','WR','HR','AR','TIM/CNT(Complettion Flag)','DM','EM current bank','EM bank 0','EM bank 1','EM bank 2','EM bank 3','EM bank 4','EM bank 5','EM bank 6','EM bank 7','EM bank 8','EM bank 9','EM bank A','EM bank B','EM bank C','EM bank D',
    'EM bank E','EM bank F','EM bank 10','EM bank 11','EM bank 12','EM bank 13','EM bank 14','EM bank 15','EM bank 16','EM bank 17','EM bank 18']
    console.log(popupData.protocolName, items)
    return (
      <Form onFinish={this.onFinish} ref={addressForm}>
        <div className="form-table">
          {
            popupData.protocolName === "S7_TCP" ? (
              <>
              {
                items.includes(1) ? 
                  <Form.Item label="数据区域" name="dataArea" initialValue="位">
                    <Select onChange={(e)=>{this.changeData(e,'dataArea', type)}} >
                      <Select.Option value="位">位</Select.Option>
                      <Select.Option value="DB">DB</Select.Option>
                      <Select.Option value="输入">输入</Select.Option>
                      <Select.Option value="输出">输出</Select.Option>
                    </Select>
                  </Form.Item> : <></>
              }{
                items.includes(2) ?
                  <Form.Item label={formData.letters} name={formData.letters} initialValue={ formData.lettleValue }>
                    <Input onBlur={ (e)=>{this.blurData(e, 'lettleValue', 'S7_TCP')} }/>
                  </Form.Item> : <></>
              }{
                items && items.includes(3) ?
                <Form.Item label="DB号" name="DBNum" initialValue={ formData.DBNum }>
                  <Input type="number" min="1" onBlur={ (e)=>{this.blurData(e, 'DBNum', 'S7_TCP')} }/>
                </Form.Item> : <></>
              }{
                items && items.includes(4) ?
                <Form.Item label="地址偏移量" name="addressOffset" initialValue={ formData.addressOffset }>
                  <Input type="number" min="1" onBlur={ (e)=>{this.blurData(e, 'addressOffset', 'S7_TCP')} }/>
                </Form.Item> : <></>
              }{
                items.includes(5) ?
                <Form.Item label="位" name="bit" initialValue="1">
                  <Select onChange={(e) => { this.changeData(e, 'bit', type) }}>
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                  </Select>
                </Form.Item> : <></>
              }{
                items && items.includes(6) ?
                <Form.Item label="长度" name="len" initialValue={ formData.len }>
                  <Input onBlur={ (e)=>{this.blurData(e, 'len', 'S7_TCP')} }/>
                </Form.Item> : <></>
              }{
                items && items.includes(7) ?
                <Form.Item label="地址类型" name="addressType" initialValue="字节">
                  <Select onChange={ (e)=>{this.changeData(e, 'addressType', type)} }>
                    <Select.Option value="字节">字节</Select.Option>   
                    <Select.Option value="字">字</Select.Option>
                    {
                      ['字符串', '宽字符串'].includes(type) ? 
                      <Select.Option value="双字">双字</Select.Option> : <></>
                    }
                  </Select>
                </Form.Item> : <></>
              }
            </>
            ) : <></>
          }{
            popupData.protocolName === "Modbus_TCP" ? 
              <>
                {
                  !types.includes(type) ? 
                    <Form.Item label="数据区域" name="dataArea" initialValue="线圈状态">
                      <Select onChange={(e)=>{this.changeModbus_TCPData(e,'dataArea', type)}} >
                        <Select.Option value="线圈状态">线圈状态</Select.Option>
                        <Select.Option value="离散输入状态">离散输入状态</Select.Option>
                        <Select.Option value="输入寄存器">输入寄存器</Select.Option>
                        <Select.Option value="保持寄存器">保持寄存器</Select.Option>
                      </Select>
                    </Form.Item> : 
                    <Form.Item label="数据区域" name="dataArea" initialValue="输入寄存器">
                      <Select onChange={(e)=>{this.changeModbus_TCPData(e,'dataArea', type)}} >
                        <Select.Option value="输入寄存器">输入寄存器</Select.Option>
                        <Select.Option value="保持寄存器">保持寄存器</Select.Option>
                      </Select>
                    </Form.Item>
                }{
                  items && items.includes(2) ? 
                  <Form.Item label="偏移地址" name="address" initialValue={ formData.address }>
                    <Input type="number" min="0" onBlur={ (e)=>{this.blurData(e, 'address', 'Modbus_TCP')} }/>
                  </Form.Item> : <></>
                }{
                  items && items.includes(3) ? 
                  <Form.Item label="位" name="bit" initialValue="1">
                    <Select onChange={(e)=>{this.changeModbus_TCPData(e,'bit', type)}} >
                      <Select.Option value="1">1</Select.Option>
                      <Select.Option value="2">2</Select.Option>
                      <Select.Option value="3">3</Select.Option>
                      <Select.Option value="4">4</Select.Option>
                      <Select.Option value="5">5</Select.Option>
                      <Select.Option value="6">6</Select.Option>
                      <Select.Option value="7">7</Select.Option>
                      <Select.Option value="8">8</Select.Option>
                      <Select.Option value="9">9</Select.Option>
                      <Select.Option value="10">10</Select.Option>
                      <Select.Option value="11">11</Select.Option>
                      <Select.Option value="12">12</Select.Option>
                      <Select.Option value="13">13</Select.Option>
                      <Select.Option value="14">14</Select.Option>
                    </Select>
                  </Form.Item> : <></>
                }{
                  items && items.includes(4) ? 
                  <Form.Item label="长度" name="address" initialValue={ formData.len }>
                    <Input type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'Modbus_TCP')} }/>
                  </Form.Item> : <></>
                }
              </> : <></>
          }{
            popupData.protocolName === "MC3E_Binary_Ethernet" ? <>
              {
                items.includes(1) ? 
                <Form.Item label="数据区域" name="dataArea" initialValue="输入寄存器（X）">
                  <Select onChange={(e)=>{this.changeMBEData(e,'dataArea', type)}} >
                    <Select.Option value="输入寄存器（X）">输入寄存器（X）</Select.Option>
                    <Select.Option value="输出寄存器（Y）">输出寄存器（Y）</Select.Option>
                    <Select.Option value="内部继电器（M）">内部继电器（M）</Select.Option>
                    <Select.Option value="定时器（触点）（TS）">定时器（触点）（TS）</Select.Option>
                    <Select.Option value="定时器（线圈）（TC）">定时器（线圈）（TC）</Select.Option>
                    <Select.Option value="计数器（触点）（CS）">计数器（触点）（CS）</Select.Option>
                    <Select.Option value="计数器（线圈）（CC）">计数器（线圈）（CC）</Select.Option>
                    <Select.Option value="数据寄存器（D）">数据寄存器（D）</Select.Option>
                    <Select.Option value="链接寄存器（W）">链接寄存器（W）</Select.Option>
                    <Select.Option value="定时器（当前值）（TN）">定时器（当前值）（TN）</Select.Option>
                    <Select.Option value="计数器（当前值）（CN）">计数器（当前值）（CN）</Select.Option>
                  </Select>
                </Form.Item> : 
                <Form.Item label="数据区域" name="dataArea" initialValue="数据寄存器（D）">
                  <Select onChange={(e)=>{this.changeMBEData(e,'dataArea', type)}} >
                    <Select.Option value="数据寄存器（D）">数据寄存器（D）</Select.Option>
                    <Select.Option value="链接寄存器（W）">链接寄存器（W）</Select.Option>
                    <Select.Option value="定时器（当前值）（TN）">定时器（当前值）（TN）</Select.Option>
                    <Select.Option value="计数器（当前值）（CN）">计数器（当前值）（CN）</Select.Option>
                  </Select>
                </Form.Item>
              }{
                items && items.includes(2) ? 
                <Form.Item label="偏移地址" name="address" initialValue={ formData.address }>
                  <Input type="number" min="0" onBlur={ (e)=>{this.blurData(e, 'address', 'MC3E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }{
                items && items.includes(3) ? 
                <Form.Item label="位" name="bit" initialValue="1">
                  <Select onChange={(e)=>{this.changeModbus_TCPData(e,'bit', type)}} >
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                    <Select.Option value="A">A</Select.Option>
                    <Select.Option value="B">B</Select.Option>
                    <Select.Option value="C">C</Select.Option>
                    <Select.Option value="D">D</Select.Option>
                    <Select.Option value="E">E</Select.Option>
                    <Select.Option value="F">F</Select.Option>
                  </Select>
                </Form.Item> : <></>
              }{
                items && items.includes(4) ? 
                <Form.Item label="长度" name="address" initialValue={ formData.len }>
                  <Input type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'MC3E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }
            </> : <></>
          }{
            popupData.protocolName === "MCA1E_Binary_Ethernet" ? <>
              {
                items.includes(1) ? 
                <Form.Item label="数据区域" name="dataArea" initialValue="输入寄存器（X）">
                  <Select onChange={(e)=>{this.changeMABEData(e,'dataArea', type)}} >
                    <Select.Option value="输入寄存器（X）">输入寄存器（X）</Select.Option>
                    <Select.Option value="输出寄存器（Y）">输出寄存器（Y）</Select.Option>
                    <Select.Option value="辅助继电器（M）">辅助继电器（M）</Select.Option>
                    <Select.Option value="状态（S）">状态（S）</Select.Option>
                    <Select.Option value="数据寄存器（D）">数据寄存器（D）</Select.Option>
                    <Select.Option value="扩展寄存器（R）">扩展寄存器（R）</Select.Option>
                    <Select.Option value="定时器（触点）（TS）">定时器（触点）（TS）</Select.Option>
                    <Select.Option value="定时器（当前值）（TN）">定时器（当前值）（TN）</Select.Option>
                    <Select.Option value="计数器（触点）（CS）">计数器（触点）（CS）</Select.Option>
                    <Select.Option value="计数器（当前值）（CN）">计数器（当前值）（CN）</Select.Option>
                  </Select>
                </Form.Item> : 
                <Form.Item label="数据区域" name="dataArea" initialValue="数据寄存器（D）">
                  <Select onChange={(e)=>{this.changeMBEData(e,'dataArea', type)}} >
                    <Select.Option value="数据寄存器（D）">数据寄存器（D）</Select.Option>
                    <Select.Option value="扩展寄存器（R）">扩展寄存器（R）</Select.Option>
                    <Select.Option value="定时器（当前值）（TN）">定时器（当前值）（TN）</Select.Option>
                    <Select.Option value="计数器（当前值）（CN）">计数器（当前值）（CN）</Select.Option>
                  </Select>
                </Form.Item>
              }{
                items && items.includes(2) ? 
                <Form.Item label="偏移地址" name="address" initialValue={ formData.address }>
                  <Input type="number" min="0" onBlur={ (e)=>{this.blurData(e, 'address', 'MCA1E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }{
                items && items.includes(3) ? 
                <Form.Item label="位" name="bit" initialValue="1">
                  <Select onChange={(e)=>{this.changeMABEData(e,'bit', type)}} >
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                    <Select.Option value="A">A</Select.Option>
                    <Select.Option value="B">B</Select.Option>
                    <Select.Option value="C">C</Select.Option>
                    <Select.Option value="D">D</Select.Option>
                    <Select.Option value="E">E</Select.Option>
                    <Select.Option value="F">F</Select.Option>
                  </Select>
                </Form.Item> : <></>
              }{
                items && items.includes(4) ? 
                <Form.Item label="长度" name="address" initialValue={ formData.len }>
                  <Input type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'MCA1E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }
            </> : <></>
          }{
            popupData.protocolName === "Fins_TCP" ? <>
              {
                items.includes(1) ? (
                  type === '二进制变量' ? 
                  <Form.Item label="数据区域" name="dataArea" initialValue={binaryarea[0]}>
                    <Select onChange={(e)=>{this.changeFins_TCPData(e,'dataArea', type)}} >
                    {
                      binaryarea.map((item,index) => {
                        return <Select.Option value={item} key={item+index}>{item}</Select.Option>
                      })
                    }
                    </Select>
                  </Form.Item> : 
                  <Form.Item label="数据区域" name="dataArea" initialValue={binaryarea[0]}>
                    <Select onChange={(e)=>{this.changeFins_TCPData(e,'dataArea', type)}} >
                      {
                        binaryarea.filter(f => f !== 'TIM/CNT(Complettion Flag)').map((item,index) => {
                          return <Select.Option value={item} key={item+index}>{item}</Select.Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                ) : <></>
              }{
                items.includes(2) ? 
                <Form.Item label="偏移地址" name="address" initialValue={ formData.address }>
                  <Input type="number" min="0" onBlur={ (e)=>{this.blurData(e, 'address', 'Fins_TCP')} }/>
                </Form.Item> : <></>
              }{
                items.includes(3) ? 
                <Form.Item label="位" name="bit" initialValue="1">
                  <Select onChange={(e)=>{this.changeMABEData(e,'bit', type)}} >
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="11">11</Select.Option>
                    <Select.Option value="12">12</Select.Option>
                    <Select.Option value="13">13</Select.Option>
                    <Select.Option value="14">14</Select.Option>
                    <Select.Option value="15">15</Select.Option>
                  </Select>
                </Form.Item> : <></>
              }{
                items.includes(4)  ? 
                <Form.Item label="长度" name="address" initialValue={ formData.len }>
                  <Input type="number" min="1" max="255" onBlur={ (e)=>{this.blurData(e, 'len', 'MCA1E_Binary_Ethernet')} }/>
                </Form.Item> : <></>
              }
            </> : <></>
          }
          
          <Form.Item className="form-footer">
            <Button type="default" className="login-form-button" onClick={this.props.onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" className="login-form-button" ref="submit">
              确认
            </Button>
          </Form.Item>
        </div>
      </Form>
    )
  }
}