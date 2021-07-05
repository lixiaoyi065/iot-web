import React, { PureComponent } from 'react'
import { Form, Select, Input, Button,Tree } from 'antd'
import "./index.less"


export default class config extends PureComponent {
  state = {
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
      len: 9, // 长度
      addressOffset: 1, // 地址偏移量
      addressType: '字节', // 地址类型
      addressValue: '', // 最后组装出来的变量值
      showList: [], // 弹窗显示的form块
      address: 1, // S7_TCP 以外的协议 偏移地址
    },
    configHtml: "",
    key: this.props.row.key,
    formData: {},
  }

  componentDidMount() {
    console.log(this.props)
    this.setState({ formData: JSON.parse(JSON.stringify(this.state.addressData)) }, () => {
      this.openPop()
    })
  }

  openPop = () => {
    let { popupData, formData } = this.state
    this.setState(state => {
      return {
        addressData: Object.assign(state.addressData, { len: popupData.dataLen }),
        formData: Object.assign(state.formData, {len: popupData.dataLen})
      }
    })
    if (popupData.protocolName === 'S7_TCP') {    //  渲染 S7_TCP弹窗
      // 1: 数据区域  2. 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
      // 数据区域 需要赋予默认值或回显
      formData.dataArea = formData.dataArea ? formData.dataArea : '位'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2,5] : formData.showList
      } else if (popupData.dataType === '有符号8位整型' || popupData.dataType === '无符号8位整型') {
        formData.letters = formData.dataArea === '位' ?  formData.letters = 'MB' : formData.letters
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '有符号16位整型' || popupData.dataType === '无符号16位整型') {
        formData.letters = formData.dataArea === '位' ?  formData.letters = 'MW' : formData.letters
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '有符号32位整型' || popupData.dataType === '无符号32位整型' || popupData.dataType === 'F32位浮点数IEEE754' || popupData.dataType === '定时器') {
        formData.letters = formData.dataArea === '位' ?  formData.letters = 'MD' : formData.letters
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '有符号64位整型' || popupData.dataType === '无符号64位整型' || popupData.dataType === 'F64位浮点数IEEE754' || popupData.dataType === '日期'|| popupData.dataType === '时间'|| popupData.dataType === '日期时间') {
        formData.showList = formData.showList.length === 0 ?  [1,4,7] : formData.showList
      } else if (popupData.dataType === '文本变量8位字符集' || popupData.dataType === '文本变量16位字符集') {
        formData.showList = formData.showList.length === 0 ?  [1,4,6] : formData.showList
      } else if (popupData.dataType === '字符串' || popupData.dataType === '宽字符串') {
        formData.showList = formData.showList.length === 0 ?  [1,4,6,7] : formData.showList
      }
      console.log(formData.showList, formData, popupData.dataType)
      this.renderS7_TCPHTML(formData.showList, formData, popupData.dataType)
    } else if (popupData.protocolName === 'OPC_UA') {
      
    }
  }
  onLoadData = () => {
    console.log(".....")
  }
  // OPC_UA协议  弹窗渲染函数
  renderOPC_UAHTML = () => {
    this.setState(state=>{
      return {
        configHtml: (
          <div style={{position: 'relative',height: '400px'}}>
            <div className='leftContent'>
              <Tree loadData={this.onLoadData} treeData={this.state.OPC_UATree} />
            </div>
            <div className="tableList">
  
            </div>
          </div>
        )
      }
    })
  }

  // S7_TCP协议 弹窗渲染函数
  renderS7_TCPHTML = (items = [], data = {}, type) => {
    // 1: 数据区域  2. 下拉块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
    this.setState(state => {
      return {
        configHtml: (
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
              <Form.Item label={data.letters} name={data.letters} initialValue={ data.lettleValue }>
                <Input onBlur={ (e)=>{this.blurData(e, 'lettleValue', 'S7_TCP')} }/>
              </Form.Item> : <></>
          }{
            items.includes(3) ?
            <Form.Item label="DB号" name="DBNum" initialValue={ data.DBNum }>
              <Input type="number" min="1" onBlur={ (e)=>{this.blurData(e, 'DBNum', 'S7_TCP')} }/>
            </Form.Item> : <></>
          }{
            items.includes(4) ?
            <Form.Item label="地址偏移量" name="addressOffset" initialValue={ data.addressOffset }>
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
            items.includes(6) ?
            <Form.Item label="长度" name="len" initialValue={ data.len }>
              <Input onBlur={ (e)=>{this.blurData(e, 'len', 'S7_TCP')} }/>
            </Form.Item> : <></>
          }{
            items.includes(7) ?
            <Form.Item label="地址类型" name="addressType">
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
        )
      }
    })
  }

  // 选择下拉内容 -- S7_TCP协议
  changeData = (e, prop, type) => {
    console.log(e, prop, type)
    this.setState(state => {
      let { formData } = state;
      console.log(formData)
      // formData[prop] = e
      // if (type === '二进制变量') {
      //   if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
      //     if (e === '位') {
      //       formData.letters = 'M'
      //       formData.showList = [1,2,5]
      //     } else if (e === 'DB') {
      //       formData.letters = 'DBX'
      //       formData.showList = [1,2,3,5]
      //     } else if (e === '输入') {
      //       formData.letters = 'I'
      //       formData.showList = [1,2,5]
      //     } else if (e === '输出') {
      //       formData.letters = 'Q'
      //       formData.showList = [1,2,5]
      //     }
      //   } else if (type === '有符号8位整型' || type === '无符号8位整型') {
      //     if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
      //       if (e === '位') {
      //         formData.letters = 'MB'
      //         formData.showList = [1,2]
      //       } else if (e === 'DB') {
      //         formData.letters = 'DBB'
      //         formData.showList = [1,2,3]
      //       } else if (e === '输入') {
      //         formData.letters = 'IB'
      //         formData.showList = [1,2]
      //       } else if (e === '输出') {
      //         formData.letters = 'QB'
      //         formData.showList = [1,2]
      //       }
      //     }
      //   } else if (type === '有符号16位整型' || type === '无符号16位整型') {
      //     if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
      //       if (e === '位') {
      //         formData.letters = 'MW'
      //         formData.showList = [1,2]
      //       } else if (e === 'DB') {
      //         formData.letters = 'DBW'
      //         formData.showList = [1,2,3]
      //       } else if (e === '输入') {
      //         formData.letters = 'IW'
      //         formData.showList = [1,2]
      //       } else if (e === '输出') {
      //         formData.letters = 'QW'
      //         formData.showList = [1,2]
      //       }
      //     }
      //   } else if (type === '有符号32位整型' || type === '无符号32位整型' || type === 'F32位浮点数IEEE754' || type === '定时器') {
      //     if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
      //       if (e === '位') {
      //         formData.letters = 'MD'
      //         formData.showList = [1,2]
      //       } else if (e === 'DB') {
      //         formData.letters = 'DBD'
      //         formData.showList = [1,2,3]
      //       } else if (e === '输入') {
      //         formData.letters = 'ID'
      //         formData.showList = [1,2]
      //       } else if (e === '输出') {
      //         formData.letters = 'QD'
      //         formData.showList = [1,2]
      //       }
      //     }
      //   } else if (type === '有符号64位整型' || type === '无符号64位整型' || type === 'F64位浮点数IEEE754' || type === '日期'|| type === '时间'|| type === '日期时间') {
      //     if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
      //       if (e === '位') {
      //         formData.showList = [1,4,7]
      //       } else if (e === 'DB') {
      //         formData.showList = [1,3,4,7]
      //       } else if (e === '输入') {
      //         formData.showList = [1,4,7]
      //       } else if (e === '输出') {
      //         formData.showList = [1,4,7]
      //       }
      //     }
      //   } else if (type === '文本变量8位字符集' || type === '文本变量16位字符集') {
      //     if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
      //       if (e === '位') {
      //         formData.showList = [1,4,6]
      //       } else if (e === 'DB') {
      //         formData.showList = [1,3,4,6]
      //       } else if (e === '输入') {
      //         formData.showList = [1,4,6]
      //       } else if (e === '输出') {
      //         formData.showList = [1,4,6]
      //       }
      //     }
      //   } else if (type === '字符串' || type === '宽字符串') {
      //     if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
      //       if (e === '位') {
      //         formData.showList = [1,4,6,7]
      //       } else if (e === 'DB') {
      //         formData.showList = [1,3,4,6,7]
      //       } else if (e === '输入') {
      //         formData.showList = [1,4,6,7]
      //       } else if (e === '输出') {
      //         formData.showList = [1,4,6,7]
      //       }
      //     }
      //   }
      // }
      return {
        formData: formData
      }
    })
  }
  blurData = (e, prop, protocal) => {
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
    // 协议名称： S7_TCP   Modbus_TCP  OPC_DA  OPC_UA  MC3E_Binary_Etherent  MCA1E_Binary_Etherent  Fins_TCP
    let addressData = JSON.parse(JSON.stringify(this.state.formData))
    console.log(addressData)
    
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
    }
    console.log(popupData.dataValue, addressData.len)
    return ({
      address: popupData.dataValue,
      stringLength: addressData.len
    })
  }

  onFinish = (val) => {
    this.props.onFinish(this.confirmPop(), this.props.row);
  }

  render() {
    return (
      <Form onFinish={this.onFinish}>
        <div className="form-table">
          {this.state.configHtml}
          
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