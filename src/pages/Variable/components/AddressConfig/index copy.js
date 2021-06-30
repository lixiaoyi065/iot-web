export default function config(data, row) {
  let { model, protocolName, supplier } = data;
  let { dataType, stringLength } = row;
  let configPane = document.createElement("div")
  // console.log(model, protocolName, supplier, dataType)

  // 需e要在此处手动修改协议protocolNam 和 数据类型 dataType 模拟不同协议下的数据结构
  var popupData = {
    protocolName: protocolName,
    dataType: dataType,
    dataValue: '',  // 变量地址
    dataLen: '',  // 字符长度
  }

  // 定义一个提交的数据结构， 用来填写默认值与回显
  var addressData = {
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
  }
  // 克隆一份数据用来做弹窗取消的回显
  var formData = JSON.parse(JSON.stringify(addressData))


  let lenInput = stringLength
  lenInput = popupData.dataLen




  /* 方法 */

  function resetData () {
    formData = {
      dataArea: '', // 数据区域
      letters: 'M', // 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD）
      lettleValue: 0, // 寄存器字母对应的值
      DBNum: 1, // DB号
      bit: 0,  //  位
      len: popupData.dataLen, // 长度
      addressOffset: 1, // 地址偏移量
      addressType: '字节', // 地址类型
      addressValue: '', // 最后组装出来的变量值
      showList: [], // 弹窗显示的form块
      address: 1, // S7_TCP 以外的协议 偏移地址
    }
  }

  // 字符长度
  function handleLen (e) {
    if (e.target.value <= 1) {
      e.target.value = 1
    } else if (e.target.value >= 255) {
      e.target.value = 255
    }
    e.target.value = parseInt(e.target.value)
    popupData.dataLen = e.target.value
  }

  function handleBlur (e) {
    if (e.target.value.trim() === '') {
      return
    }
    popupData.dataValue = e.target.value
    console.log(popupData.dataValue)
    /* 输入框回显 */
    /* 
      正则：
      ^   以后面的字符开始
      $    以前面字符结束
      ([0-9]{1,})   大于0的正整数 不限位数
      ([.]{1})  匹配.
      ([0-9]|(1[0-5])) 1-15 位整数
    */
    if (popupData.protocolName === 'S7_TCP') {
        // 1: 数据区域  2. 寄存器字母块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
        if (popupData.dataType === '二进制变量') {
          let bitReg = /^[M]([0-9]{1,})([.]{1})([0-7]{1})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBX){1})([0-9]{1,})([.]{1})([0-7]{1,})$/ // DB号匹配正则
          let IReg = /^[I]([0-9]{1,})([.]{1})([0-7]{1})$/ // 输入匹配正则
          let QReg = /^[Q]([0-9]{1,})([.]{1})([0-7]{1})$/ // 输出匹配正则
          if (bitReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(bitReg) 
            addressData.dataArea = '位'
            addressData.letters = 'M'
            addressData.lettleValue = arr[1]
            addressData.bit = arr[3]
            addressData.showList = [1,2,5]
          } else if (dbReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(dbReg) 
            addressData.dataArea = 'DB'
            addressData.DBNum = arr[2]
            addressData.letters = 'DBX'
            addressData.lettleValue = arr[6]
            addressData.bit = arr[8]
            addressData.showList = [1,2,3,5]
          } else if (IReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(IReg) 
            addressData.dataArea = '输入'
            addressData.letters = 'I'
            addressData.lettleValue = arr[1]
            addressData.bit = arr[3]
            addressData.showList = [1,2,5]
          } else if (QReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(QReg) 
            addressData.dataArea = '输出'
            addressData.letters = 'Q'
            addressData.lettleValue = arr[1]
            addressData.bit = arr[3]
            addressData.showList = [1,2,5]
          } else {
            e.target.value = ''
            popupData.dataValue = ''
            resetData()
            alert('输入格式不正确，请重新输入')
            return
          }
        } else if (popupData.dataType === '有符号8位整型' || popupData.dataType === '无符号8位整型') {
          let bitReg = /^(MB)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IB)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(bitReg) 
            addressData.dataArea = '位'
            addressData.letters = 'MB'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else if (dbReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(dbReg) 
            addressData.dataArea = 'DB'
            addressData.DBNum = arr[2]
            addressData.letters = 'DBB'
            addressData.lettleValue = arr[6]
            addressData.showList = [1,2,3]
          } else if (IReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(IReg) 
            addressData.dataArea = '输入'
            addressData.letters = 'IB'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else if (QReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(QReg) 
            addressData.dataArea = '输出'
            addressData.letters = 'QB'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else {
            e.target.value = ''
            popupData.dataValue = ''
            resetData()
            alert('输入格式不正确，请重新输入')
            return
          }

        } else if (popupData.dataType === '有符号16位整型' || popupData.dataType === '无符号16位整型') {
          let bitReg = /^(MW)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBW){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IW)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QW)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(bitReg) 
            addressData.dataArea = '位'
            addressData.letters = 'MW'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else if (dbReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(dbReg) 
            addressData.dataArea = 'DB'
            addressData.DBNum = arr[2]
            addressData.letters = 'DBW'
            addressData.lettleValue = arr[6]
            addressData.showList = [1,2,3]
          } else if (IReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(IReg) 
            addressData.dataArea = '输入'
            addressData.letters = 'IW'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else if (QReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(QReg) 
            addressData.dataArea = '输出'
            addressData.letters = 'QW'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else {
            e.target.value = ''
            popupData.dataValue = ''
            resetData()
            alert('输入格式不正确，请重新输入')
            return
          }


        } else if (popupData.dataType === '有符号32位整型' || popupData.dataType === '无符号32位整型' || popupData.dataType === 'F32位浮点数IEEE754' || popupData.dataType === '定时器') {
          let bitReg = /^(MD)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBD){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(ID)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QD)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(bitReg) 
            addressData.dataArea = '位'
            addressData.letters = 'MD'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else if (dbReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(dbReg) 
            addressData.dataArea = 'DB'
            addressData.DBNum = arr[2]
            addressData.letters = 'DBD'
            addressData.lettleValue = arr[6]
            addressData.showList = [1,2,3]
          } else if (IReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(IReg) 
            addressData.dataArea = '输入'
            addressData.letters = 'ID'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else if (QReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(QReg) 
            addressData.dataArea = '输出'
            addressData.letters = 'QD'
            addressData.lettleValue = arr[2]
            addressData.showList = [1,2]
          } else {
            e.target.value = ''
            popupData.dataValue = ''
            resetData()
            alert('输入格式不正确，请重新输入')
            return
          }

        } else if (popupData.dataType === '有符号64位整型' || popupData.dataType === '无符号64位整型' || popupData.dataType === 'F64位浮点数IEEE754' || popupData.dataType === '日期'|| popupData.dataType === '时间'|| popupData.dataType === '日期时间') {
          let bitReg = /^(MB|MD|MW)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB|DBW|DBD){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IB|IW|ID)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB|QW|QD)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(bitReg) 
            addressData.dataArea = '位'
            addressData.addressOffset = arr[2]
            if (arr[1] === 'MB') {
              addressData.addressType = '字节'
            } else if (arr[1] === 'MW') {
              addressData.addressType = '字'
            } else if (arr[1] === 'MD') {
              addressData.addressType = '双字'
            }
            addressData.showList = [1,4,7]
          } else if (dbReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(dbReg) 
            console.log(arr)
            addressData.dataArea = 'DB'
            addressData.DBNum = arr[2]
            addressData.addressOffset = arr[6]
            if (arr[4] === 'DBB') {
              addressData.addressType = '字节'
            } else if (arr[4] === 'DBW') {
              addressData.addressType = '字'
            } else if (arr[4] === 'DBD') {
              addressData.addressType = '双字'
            }
            addressData.showList = [1,3,4,7]
          } else if (IReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(IReg) 
            addressData.dataArea = '输入'
            addressData.addressOffset = arr[2]
            if (arr[1] === 'IB') {
              addressData.addressType = '字节'
            } else if (arr[1] === 'IW') {
              addressData.addressType = '字'
            } else if (arr[1] === 'ID') {
              addressData.addressType = '双字'
            }
            addressData.showList = [1,4,7]
          } else if (QReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(QReg) 
            addressData.dataArea = '输出'
            addressData.addressOffset = arr[2]
            if (arr[1] === 'QB') {
              addressData.addressType = '字节'
            } else if (arr[1] === 'QW') {
              addressData.addressType = '字'
            } else if (arr[1] === 'QD') {
              addressData.addressType = '双字'
            }
            addressData.showList = [1,4,7]
          } else {
            e.target.value = ''
            popupData.dataValue = ''
            resetData()
            alert('输入格式不正确，请重新输入')
            return
          }


        } else if (popupData.dataType === '文本变量8位字符集' || popupData.dataType === '文本变量16位字符集') {
          let bitReg = /^(MB)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IB)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB)([0-9]{1,})$/ // 输出匹配正则

          if (bitReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(bitReg) 
            addressData.dataArea = '位'
            addressData.addressOffset = arr[2]
            addressData.len = popupData.dataLen
            addressData.showList = [1,4,6]
          } else if (dbReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(dbReg) 
            console.log(arr)
            addressData.dataArea = 'DB'
            addressData.DBNum = arr[2]
            addressData.addressOffset = arr[6]
            addressData.len = popupData.dataLen
            addressData.showList = [1,3,4,6]
          } else if (IReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(IReg) 
            addressData.dataArea = '输入'
            addressData.addressOffset = arr[2]
            addressData.len = popupData.dataLen
            addressData.showList = [1,4,6]
          } else if (QReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(QReg) 
            addressData.dataArea = '输出'
            addressData.addressOffset = arr[2]
            addressData.len = popupData.dataLen
            addressData.showList = [1,4,6]
          } else {
            e.target.value = ''
            popupData.dataValue = ''
            resetData()
            alert('输入格式不正确，请重新输入')
            return
          }


        } else if (popupData.dataType === '字符串' || popupData.dataType === '宽字符串') {
          let bitReg = /^(MB|MW)([0-9]{1,})$/     // 位匹配正则
          let dbReg = /^(DB)([1-9]{1,})([.]{1})((DBB|DBW){1})([0-9]{1,})$/ // DB号匹配正则
          let IReg = /^(IB|IW)([0-9]{1,})$/ // 输入匹配正则
          let QReg = /^(QB|QW)([0-9]{1,})$/ // 输出匹配正则
          
          if (bitReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(bitReg) 
            addressData.dataArea = '位'
            addressData.addressOffset = arr[2]
            if (arr[1] === 'MB') {
              addressData.addressType = '字节'
            } else if (arr[1] === 'MW') {
              addressData.addressType = '字'
            }
            addressData.showList = [1,4,6,7]
          } else if (dbReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(dbReg) 
            console.log(arr)
            addressData.dataArea = 'DB'
            addressData.DBNum = arr[2]
            addressData.addressOffset = arr[6]
            if (arr[4] === 'DBB') {
              addressData.addressType = '字节'
            } else if (arr[4] === 'DBW') {
              addressData.addressType = '字'
            }
            addressData.showList = [1,3,4,6,7]
          } else if (IReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(IReg) 
            addressData.dataArea = '输入'
            addressData.addressOffset = arr[2]
            if (arr[1] === 'IB') {
              addressData.addressType = '字节'
            } else if (arr[1] === 'IW') {
              addressData.addressType = '字'
            }
            addressData.showList = [1,4,6,7]
          } else if (QReg.test(popupData.dataValue)) {
            let arr =  popupData.dataValue.match(QReg) 
            addressData.dataArea = '输出'
            addressData.addressOffset = arr[2]
            if (arr[1] === 'QB') {
              addressData.addressType = '字节'
            } else if (arr[1] === 'QW') {
              addressData.addressType = '字'
            }
            addressData.showList = [1,4,6,7]
          } else {
            e.target.value = ''
            popupData.dataValue = ''
            resetData()
            alert('输入格式不正确，请重新输入')
            return
          }



        }
    } else if (popupData.protocolName === 'Modbus_TCP') {
      let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754']
      if (e.target.value == '000000') {
        e.target.value = ''
            popupData.dataValue = ''
            resetData()
            alert('输入格式不正确，请重新输入')
            return
      }
      // 1. 数据区域  2. 偏移地址   3.位  4. 长度
      if (popupData.dataType === '二进制变量') {
        let coilReg = /^[0]([0-9]{5})$/     // 线圈状态匹配正则
        let dIReg = /^[1]([0-9]{5})$/  // 离散输入匹配正则
        let IReg = /^[3]([0-9]{5})([.]{1})([0-9]|(1[0-5]))$/ // 输入寄存器正则
        let KReg = /^[4]([0-9]{5})([.]{1})([0-9]|(1[0-5]))$/  // 保持寄存器正则

        if (coilReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(coilReg) 
          addressData.dataArea = '线圈状态'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (dIReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(dIReg) 
          addressData.dataArea = '离散输入状态'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (IReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(IReg) 
          console.log(arr)
          addressData.dataArea = '输入寄存器'
          addressData.address = parseInt(arr[1])
          addressData.bit = arr[3]
          addressData.showList = [1,2,3]
        } else if (KReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(KReg) 
          addressData.dataArea = '保持寄存器'
          addressData.address = parseInt(arr[1])
          addressData.bit = arr[3]
          addressData.showList = [1,2,3]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }

      } else if (types.includes(popupData.dataType)) {
        let IReg = /^[3]([0-9]{5})$/ // 输入寄存器正则
        let KReg = /^[4]([0-9]{5})$/  // 保持寄存器正则

        if (IReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(IReg) 
          addressData.dataArea = '输入寄存器'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (KReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(KReg) 
          addressData.dataArea = '保持寄存器'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }
      } else if (popupData.dataType === '字符串') {
        let IReg = /^[3]([0-9]{5})$/ // 输入寄存器正则
        let KReg = /^[4]([0-9]{5})$/  // 保持寄存器正则

        if (IReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(IReg) 
          addressData.dataArea = '输入寄存器'
          addressData.address = parseInt(arr[1])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (KReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(KReg) 
          addressData.dataArea = '保持寄存器'
          addressData.address = parseInt(arr[1])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }
      }
    } else if (popupData.protocolName === 'MC3E_Binary_Etherent') {
      if (popupData.dataType === '二进制变量'){
        // 1. 数据区域    2.  地址    3.  位    4. 长度
        let XReg = /^[X]([0-9]{1,})$/     // 输入寄存器（X）匹配正则
        let YReg = /^[Y]([0-9]{1,})$/ // 输出寄存器（Y）匹配正则
        let MReg = /^[M]([0-9]{1,})$/ // 内部继电器（M）正则
        let TSReg = /^(TS)([0-9]{1,})$/  // 定时器（触点）（TS）正则
        let TCReg = /^(TC)([0-9]{1,})$/  // 定时器（线圈）（TC）正则
        let CSReg = /^(CS)([0-9]{1,})$/ // 计数器（触点）（CS）正则
        let CCReg = /^(CC)([0-9]{1,})$/  // 计数器（线圈）（CC）正则
        let DReg =  /^[D]([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 数据寄存器（D）正则
        let WReg = /^[W]([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 链接寄存器（W）正则
        let TNReg = /^(TN)([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 计数器（当前值）（CN）正则

        if (XReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(XReg) 
          addressData.dataArea = '输入寄存器（X）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (YReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(YReg) 
          addressData.dataArea = '输出寄存器（Y）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (MReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(MReg) 
          addressData.dataArea = '内部继电器（M）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (TSReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TSReg) 
          addressData.dataArea = '定时器（触点）（TS）'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (TCReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TCReg) 
          addressData.dataArea = '定时器（线圈）（TC）'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (CSReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CSReg) 
          addressData.dataArea = '计数器（触点）（CS）'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (CCReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CCReg) 
          addressData.dataArea = '计数器（线圈）（CC）'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg) 
          addressData.dataArea = '数据寄存器（D）'
          addressData.address = parseInt(arr[1])
          addressData.bit = arr[3]
          addressData.showList = [1,2,3]
        } else if (WReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(WReg) 
          addressData.dataArea = '链接寄存器（W）'
          addressData.address = parseInt(arr[1])
          addressData.bit = arr[3]
          addressData.showList = [1,2,3]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          addressData.dataArea = '定时器（当前值）（TN）'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          addressData.dataArea = '计数器（当前值）（CN）'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }



      } else if (popupData.dataType === '字符串') {
        let DReg =  /^[D]([0-9]{1,})$/  // 数据寄存器（D）正则
        let WReg = /^[W]([0-9]{1,})$/  // 链接寄存器（W）正则
        let TNReg = /^(TN)([0-9]{1,})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})$/  // 计数器（当前值）（CN）正则

        if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg)
          console.log(arr) 
          addressData.dataArea = '数据寄存器（D）'
          addressData.address = arr[1]
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (WReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(WReg) 
          addressData.dataArea = '链接寄存器（W）'
          addressData.address = arr[1]
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          addressData.dataArea = '定时器（当前值）（TN）'
          addressData.address = arr[2]
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          addressData.dataArea = '计数器（当前值）（CN）'
          addressData.address = arr[2]
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }
      } else {
        let DReg =  /^[D]([0-9]{1,})$/  // 数据寄存器（D）正则
        let WReg = /^[W]([0-9]{1,})$/  // 链接寄存器（W）正则
        let TNReg = /^(TN)([0-9]{1,})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})$/  // 计数器（当前值）（CN）正则

        if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg)
          console.log(arr) 
          addressData.dataArea = '数据寄存器（D）'
          addressData.address = arr[1]
          addressData.showList = [1,2]
        } else if (WReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(WReg) 
          addressData.dataArea = '链接寄存器（W）'
          addressData.address = arr[1]
          addressData.showList = [1,2]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          addressData.dataArea = '定时器（当前值）（TN）'
          addressData.address = arr[2]
          addressData.showList = [1,2]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          addressData.dataArea = '计数器（当前值）（CN）'
          addressData.address = arr[2]
          addressData.showList = [1,2]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }
      }
    } else if (popupData.protocolName === 'MCA1E_Binary_Etherent') {
      if (popupData.dataType === '二进制变量'){
        // 1. 数据区域    2.  地址    3.  位    4. 长度
        let XReg = /^[X]([0-9]{1,})$/     // 输入寄存器（X）匹配正则
        let YReg = /^[Y]([0-9]{1,})$/ // 输出寄存器（Y）匹配正则
        let MReg = /^[M]([0-9]{1,})$/ // 辅助继电器（M）正则
        let SReg = /^[S]([0-9]{1,})$/ // 状态（S）正则
        let TSReg = /^(TS)([0-9]{1,})$/  // 定时器（触点）（TS）正则
        let CSReg = /^(CS)([0-9]{1,})$/ // 计数器（触点）（CS）正则
        let DReg =  /^[D]([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 数据寄存器（D）正则
        let RReg =  /^[R]([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 扩展寄存器（R）正则
        let TNReg = /^(TN)([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})([.]{1})([0-9A-F]{1})$/  // 计数器（当前值）（CN）正则

        if (XReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(XReg) 
          addressData.dataArea = '输入寄存器（X）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (YReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(YReg) 
          addressData.dataArea = '输出寄存器（Y）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (MReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(MReg) 
          addressData.dataArea = '辅助继电器（M）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (SReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(SReg) 
          addressData.dataArea = '状态（S）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (TSReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TSReg) 
          addressData.dataArea = '定时器（触点）（TS）'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (CSReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CSReg) 
          addressData.dataArea = '计数器（触点）（CS）'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg) 
          addressData.dataArea = '数据寄存器（D）'
          addressData.address = parseInt(arr[1])
          addressData.bit = arr[3]
          addressData.showList = [1,2,3]
        } else if (RReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(RReg) 
          addressData.dataArea = '扩展寄存器（R）'
          addressData.address = parseInt(arr[1])
          addressData.bit = arr[3]
          addressData.showList = [1,2,3]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          console.log(arr)
          addressData.dataArea = '定时器（当前值）（TN）'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          addressData.dataArea = '计数器（当前值）（CN）'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }
      } else if (popupData.dataType === '字符串') {
        let DReg =  /^[D]([0-9]{1,})$/  // 数据寄存器（D）正则
        let RReg =  /^[R]([0-9]{1,})$/  // 扩展寄存器（R）正则
        let TNReg = /^(TN)([0-9]{1,})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})$/  // 计数器（当前值）（CN）正则

        if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg) 
          addressData.dataArea = '数据寄存器（D）'
          addressData.address = parseInt(arr[1])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (RReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(RReg) 
          addressData.dataArea = '扩展寄存器（R）'
          addressData.address = parseInt(arr[1])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          console.log(arr)
          addressData.dataArea = '定时器（当前值）（TN）'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          addressData.dataArea = '计数器（当前值）（CN）'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }
      } else {
        let DReg =  /^[D]([0-9]{1,})$/  // 数据寄存器（D）正则
        let RReg =  /^[R]([0-9]{1,})$/  // 扩展寄存器（R）正则
        let TNReg = /^(TN)([0-9]{1,})$/  // 定时器（当前值）（TN）正则
        let CNReg = /^(CN)([0-9]{1,})$/  // 计数器（当前值）（CN）正则

        if (DReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(DReg) 
          addressData.dataArea = '数据寄存器（D）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (RReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(RReg) 
          addressData.dataArea = '扩展寄存器（R）'
          addressData.address = parseInt(arr[1])
          addressData.showList = [1,2]
        } else if (TNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TNReg) 
          console.log(arr)
          addressData.dataArea = '定时器（当前值）（TN）'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (CNReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(CNReg) 
          addressData.dataArea = '计数器（当前值）（CN）'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }


      }
    } else if (popupData.protocolName === 'Fins_TCP') {
      // 1. 数据区域    2.  地址    3.  位    4. 长度
      if (popupData.dataType === '二进制变量'){
        let TIMReg = /^(T)([0-9]{1,})$/
        let CIOReg = /^(CIO)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let WRReg = /^(W)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let HRReg = /^(H)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let ARReg = /^(A)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let DMReg = /^(D)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let ECBReg = /^(E)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E0Reg = /^(E00_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E1Reg = /^(E01_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E2Reg = /^(E02_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E3Reg = /^(E03_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E4Reg = /^(E04_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E5Reg = /^(E05_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E6Reg = /^(E06_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E7Reg = /^(E07_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E8Reg = /^(E08_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EAReg = /^(E0A_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EBReg = /^(E0B_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let ECReg = /^(E0C_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EDReg = /^(E0D_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EEReg = /^(E0E_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let EFReg = /^(E0F_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E10Reg = /^(E10_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E11Reg = /^(E11_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E12Reg = /^(E12_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E13Reg = /^(E13_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E14Reg = /^(E14_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E15Reg = /^(E15_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E16Reg = /^(E16_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E17Reg = /^(E17_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/
        let E18Reg = /^(E18_)([0-9]{1,})([.]{1})([0-9]|(1[0-5]))$/

        if (TIMReg.test(popupData.dataValue)) {
          let arr =  popupData.dataValue.match(TIMReg) 
          addressData.dataArea = 'TIM/CNT(Complettion Flag)'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (CIOReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(CIOReg) 
          addressData.dataArea = 'CIO'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (WRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(WRReg) 
          addressData.dataArea = 'WR'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (HRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(HRReg) 
          addressData.dataArea = 'HR'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (ARReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ARReg) 
          addressData.dataArea = 'AR'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (DMReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(DMReg) 
          addressData.dataArea = 'DM'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (ECBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECBReg) 
          addressData.dataArea = 'EM current bank'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E0Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E0Reg) 
          addressData.dataArea = 'EM bank 0'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E1Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E1Reg) 
          addressData.dataArea = 'EM bank 1'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E2Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E2Reg) 
          addressData.dataArea = 'EM bank 2'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E3Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E3Reg) 
          addressData.dataArea = 'EM bank 3'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E4Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E4Reg) 
          addressData.dataArea = 'EM bank 4'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E5Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E5Reg) 
          addressData.dataArea = 'EM bank 5'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E6Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E6Reg) 
          addressData.dataArea = 'EM bank 6'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E7Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E7Reg) 
          addressData.dataArea = 'EM bank 7'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E8Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E8Reg) 
          addressData.dataArea = 'EM bank 8'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (EAReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EAReg) 
          addressData.dataArea = 'EM bank A'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (EBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EBReg) 
          addressData.dataArea = 'EM bank B'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (ECReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECReg) 
          addressData.dataArea = 'EM bank C'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (EDReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EDReg) 
          addressData.dataArea = 'EM bank D'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (EEReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EEReg) 
          addressData.dataArea = 'EM bank E'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (EFReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EFReg) 
          addressData.dataArea = 'EM bank F'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E10Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E10Reg) 
          addressData.dataArea = 'EM bank 10'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E11Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E11Reg) 
          addressData.dataArea = 'EM bank 11'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E12Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E12Reg) 
          addressData.dataArea = 'EM bank 12'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E13Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E13Reg) 
          addressData.dataArea = 'EM bank 13'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E14Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E14Reg) 
          addressData.dataArea = 'EM bank 14'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E15Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E15Reg) 
          addressData.dataArea = 'EM bank 15'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E16Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E16Reg) 
          addressData.dataArea = 'EM bank 16'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E17Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E17Reg) 
          addressData.dataArea = 'EM bank 17'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else if (E18Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E18Reg) 
          addressData.dataArea = 'EM bank 18'
          addressData.address = parseInt(arr[2])
          addressData.bit = arr[4]
          addressData.showList = [1,2,3]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }

      } else if (popupData.dataType === '字符串') {
        let CIOReg = /^(CIO)([0-9]{1,})$/
        let WRReg = /^(W)([0-9]{1,})$/
        let HRReg = /^(H)([0-9]{1,})$/
        let ARReg = /^(A)([0-9]{1,})$/
        let DMReg = /^(D)([0-9]{1,})$/
        let ECBReg = /^(E)([0-9]{1,})$/
        let E0Reg = /^(E00_)([0-9]{1,})$/
        let E1Reg = /^(E01_)([0-9]{1,})$/
        let E2Reg = /^(E02_)([0-9]{1,})$/
        let E3Reg = /^(E03_)([0-9]{1,})$/
        let E4Reg = /^(E04_)([0-9]{1,})$/
        let E5Reg = /^(E05_)([0-9]{1,})$/
        let E6Reg = /^(E06_)([0-9]{1,})$/
        let E7Reg = /^(E07_)([0-9]{1,})$/
        let E8Reg = /^(E08_)([0-9]{1,})$/
        let EAReg = /^(E0A_)([0-9]{1,})$/
        let EBReg = /^(E0B_)([0-9]{1,})$/
        let ECReg = /^(E0C_)([0-9]{1,})$/
        let EDReg = /^(E0D_)([0-9]{1,})$/
        let EEReg = /^(E0E_)([0-9]{1,})$/
        let EFReg = /^(E0F_)([0-9]{1,})$/
        let E10Reg = /^(E10_)([0-9]{1,})$/
        let E11Reg = /^(E11_)([0-9]{1,})$/
        let E12Reg = /^(E12_)([0-9]{1,})$/
        let E13Reg = /^(E13_)([0-9]{1,})$/
        let E14Reg = /^(E14_)([0-9]{1,})$/
        let E15Reg = /^(E15_)([0-9]{1,})$/
        let E16Reg = /^(E16_)([0-9]{1,})$/
        let E17Reg = /^(E17_)([0-9]{1,})$/
        let E18Reg = /^(E18_)([0-9]{1,})$/

        if (CIOReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(CIOReg) 
          addressData.dataArea = 'CIO'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (WRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(WRReg) 
          addressData.dataArea = 'WR'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (HRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(HRReg) 
          addressData.dataArea = 'HR'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (ARReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ARReg) 
          addressData.dataArea = 'AR'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (DMReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(DMReg) 
          addressData.dataArea = 'DM'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (ECBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECBReg) 
          addressData.dataArea = 'EM current bank'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E0Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E0Reg) 
          addressData.dataArea = 'EM bank 0'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E1Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E1Reg) 
          addressData.dataArea = 'EM bank 1'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E2Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E2Reg) 
          addressData.dataArea = 'EM bank 2'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E3Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E3Reg) 
          addressData.dataArea = 'EM bank 3'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E4Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E4Reg) 
          addressData.dataArea = 'EM bank 4'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E5Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E5Reg) 
          addressData.dataArea = 'EM bank 5'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E6Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E6Reg) 
          addressData.dataArea = 'EM bank 6'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E7Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E7Reg) 
          addressData.dataArea = 'EM bank 7'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E8Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E8Reg) 
          addressData.dataArea = 'EM bank 8'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (EAReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EAReg) 
          addressData.dataArea = 'EM bank A'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (EBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EBReg) 
          addressData.dataArea = 'EM bank B'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (ECReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECReg) 
          addressData.dataArea = 'EM bank C'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (EDReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EDReg) 
          addressData.dataArea = 'EM bank D'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (EEReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EEReg) 
          addressData.dataArea = 'EM bank E'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (EFReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EFReg) 
          addressData.dataArea = 'EM bank F'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E10Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E10Reg) 
          addressData.dataArea = 'EM bank 10'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E11Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E11Reg) 
          addressData.dataArea = 'EM bank 11'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E12Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E12Reg) 
          addressData.dataArea = 'EM bank 12'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E13Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E13Reg) 
          addressData.dataArea = 'EM bank 13'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E14Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E14Reg) 
          addressData.dataArea = 'EM bank 14'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E15Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E15Reg) 
          addressData.dataArea = 'EM bank 15'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E16Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E16Reg) 
          addressData.dataArea = 'EM bank 16'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E17Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E17Reg) 
          addressData.dataArea = 'EM bank 17'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else if (E18Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E18Reg) 
          addressData.dataArea = 'EM bank 18'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2,4]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }

      } else {
        let CIOReg = /^(CIO)([0-9]{1,})$/
        let WRReg = /^(W)([0-9]{1,})$/
        let HRReg = /^(H)([0-9]{1,})$/
        let ARReg = /^(A)([0-9]{1,})$/
        let DMReg = /^(D)([0-9]{1,})$/
        let ECBReg = /^(E)([0-9]{1,})$/
        let E0Reg = /^(E00_)([0-9]{1,})$/
        let E1Reg = /^(E01_)([0-9]{1,})$/
        let E2Reg = /^(E02_)([0-9]{1,})$/
        let E3Reg = /^(E03_)([0-9]{1,})$/
        let E4Reg = /^(E04_)([0-9]{1,})$/
        let E5Reg = /^(E05_)([0-9]{1,})$/
        let E6Reg = /^(E06_)([0-9]{1,})$/
        let E7Reg = /^(E07_)([0-9]{1,})$/
        let E8Reg = /^(E08_)([0-9]{1,})$/
        let EAReg = /^(E0A_)([0-9]{1,})$/
        let EBReg = /^(E0B_)([0-9]{1,})$/
        let ECReg = /^(E0C_)([0-9]{1,})$/
        let EDReg = /^(E0D_)([0-9]{1,})$/
        let EEReg = /^(E0E_)([0-9]{1,})$/
        let EFReg = /^(E0F_)([0-9]{1,})$/
        let E10Reg = /^(E10_)([0-9]{1,})$/
        let E11Reg = /^(E11_)([0-9]{1,})$/
        let E12Reg = /^(E12_)([0-9]{1,})$/
        let E13Reg = /^(E13_)([0-9]{1,})$/
        let E14Reg = /^(E14_)([0-9]{1,})$/
        let E15Reg = /^(E15_)([0-9]{1,})$/
        let E16Reg = /^(E16_)([0-9]{1,})$/
        let E17Reg = /^(E17_)([0-9]{1,})$/
        let E18Reg = /^(E18_)([0-9]{1,})$/

        if (CIOReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(CIOReg) 
          addressData.dataArea = 'CIO'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (WRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(WRReg) 
          addressData.dataArea = 'WR'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (HRReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(HRReg) 
          addressData.dataArea = 'HR'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (ARReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ARReg) 
          addressData.dataArea = 'AR'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (DMReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(DMReg) 
          addressData.dataArea = 'DM'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (ECBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECBReg) 
          addressData.dataArea = 'EM current bank'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E0Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E0Reg) 
          addressData.dataArea = 'EM bank 0'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E1Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E1Reg) 
          addressData.dataArea = 'EM bank 1'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E2Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E2Reg) 
          addressData.dataArea = 'EM bank 2'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E3Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E3Reg) 
          addressData.dataArea = 'EM bank 3'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E4Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E4Reg) 
          addressData.dataArea = 'EM bank 4'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E5Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E5Reg) 
          addressData.dataArea = 'EM bank 5'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E6Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E6Reg) 
          addressData.dataArea = 'EM bank 6'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2]
        } else if (E7Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E7Reg) 
          addressData.dataArea = 'EM bank 7'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E8Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E8Reg) 
          addressData.dataArea = 'EM bank 8'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2]
        } else if (EAReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EAReg) 
          addressData.dataArea = 'EM bank A'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (EBReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EBReg) 
          addressData.dataArea = 'EM bank B'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (ECReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(ECReg) 
          addressData.dataArea = 'EM bank C'
          addressData.address = parseInt(arr[2])
          addressData.len = popupData.dataLen
          addressData.showList = [1,2]
        } else if (EDReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EDReg) 
          addressData.dataArea = 'EM bank D'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (EEReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EEReg) 
          addressData.dataArea = 'EM bank E'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (EFReg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(EFReg) 
          addressData.dataArea = 'EM bank F'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E10Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E10Reg) 
          addressData.dataArea = 'EM bank 10'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E11Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E11Reg) 
          addressData.dataArea = 'EM bank 11'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E12Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E12Reg) 
          addressData.dataArea = 'EM bank 12'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E13Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E13Reg) 
          addressData.dataArea = 'EM bank 13'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E14Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E14Reg) 
          addressData.dataArea = 'EM bank 14'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E15Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E15Reg) 
          addressData.dataArea = 'EM bank 15'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E16Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E16Reg) 
          addressData.dataArea = 'EM bank 16'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E17Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E17Reg) 
          addressData.dataArea = 'EM bank 17'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else if (E18Reg.test(popupData.dataValue)) {
          let arr = popupData.dataValue.match(E18Reg) 
          addressData.dataArea = 'EM bank 18'
          addressData.address = parseInt(arr[2])
          addressData.showList = [1,2]
        } else {
          e.target.value = ''
          popupData.dataValue = ''
          resetData()
          alert('输入格式不正确，请重新输入')
          return
        }

      }
    }

    formData = JSON.parse(JSON.stringify(addressData))
  }

  openPop()
  // 打开变量弹窗
  function openPop() {
    // let pop = document.getElementById('popup')
    // pop.style.display = 'block'
    addressData.len = popupData.dataLen
    formData.len =  popupData.dataLen
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
      renderS7_TCPHTML(formData.showList, formData, popupData.dataType)
    } else if (popupData.protocolName === 'Modbus_TCP') { //  渲染 Modbus_TCP弹窗
      // 1. 数据区域  2. 偏移地址   3.位  4. 长度
      let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754']
      formData.dataArea = formData.dataArea ? formData.dataArea : '线圈状态'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }  else if (types.includes(popupData.dataType)) {
        // 此处判断赋默认值还是回显值
        let areas = ['输入寄存器', '保持寄存器']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '输入寄存器'
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['输入寄存器', '保持寄存器']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '输入寄存器'
        formData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } 
      renderModbus_TCPHTML(formData.showList, formData, popupData.dataType)
    } else if (popupData.protocolName === 'MC3E_Binary_Etherent') { //  渲染 MC3E_Binary_Etherent 弹窗
      formData.dataArea = formData.dataArea ? formData.dataArea : '输入寄存器（X）'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      } else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '链接寄存器（W）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        formData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '链接寄存器（W）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }
      renderMBEHTML(formData.showList, formData, popupData.dataType)
    } else if (popupData.protocolName === 'MCA1E_Binary_Etherent') { //  渲染 MCA1E_Binary_Etherent 弹窗
      formData.dataArea = formData.dataArea ? formData.dataArea : '输入寄存器（X）'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }  else if (popupData.dataType === '字符串') {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '扩展寄存器（R）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        formData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        // 此处判断赋默认值还是回显值
        let areas = ['数据寄存器（D）', '扩展寄存器（R）', '定时器（当前值）（TN）', '计数器（当前值）（CN）']
        formData.dataArea = areas.includes(formData.dataArea) ? formData.dataArea : '数据寄存器（D）'
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }
      renderMABEHTML(formData.showList, formData, popupData.dataType)
    } else if (popupData.protocolName === 'Fins_TCP') { //  渲染 Fins_TCP 弹窗
      formData.dataArea = formData.dataArea ? formData.dataArea : 'CIO'
      if (popupData.dataType === '二进制变量') {
        formData.showList = formData.showList.length === 0 ?  [1,2,3] : formData.showList
      } else if (popupData.dataType === '字符串') {
        formData.showList = formData.showList.length === 0 ?  [1,2,4] : formData.showList
      } else {
        formData.showList = formData.showList.length === 0 ?  [1,2] : formData.showList
      }

      renderFins_TCPHTML(formData.showList, formData, popupData.dataType)
    } else if (popupData.protocolName === 'OPC_DA' || popupData.protocolName === 'OPC_UA') {
      renderOPCHTML(formData.showList, formData, popupData.dataType)
    }

  }

  // 关闭变量弹窗
  function closePop () {
    let pop = document.getElementById('popup')
    pop.style.display = 'none'
    formData = JSON.parse(JSON.stringify(addressData))
  }

  // 提交弹窗
  function confirmPop () {
    // 协议名称： S7_TCP   Modbus_TCP  OPC_DA  OPC_UA  MC3E_Binary_Etherent  MCA1E_Binary_Etherent  Fins_TCP
    addressData = JSON.parse(JSON.stringify(formData))
    console.log(addressData)
    let input = document.getElementById('address-input')
    let lenInpit = document.getElementById('len-innput')

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
    } else if (popupData.protocolName === 'MC3E_Binary_Etherent') {
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
      

    } else if (popupData.protocolName === 'MCA1E_Binary_Etherent') {
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
    
    console.log(popupData)
    input.value = popupData.dataValue
    lenInpit.value = addressData.len
    closePop()
  }

  // 判断两个数组是否相等
  function arrayEqual(arr1, arr2) {
    if (arr1 === arr2) return true;
    if (arr1.length != arr2.length) return false;
    for (var i = 0; i < arr1.length; ++i) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  // S7_TCP协议 弹窗渲染函数
  function renderS7_TCPHTML(items = [], data = {}, type) {
    // 1: 数据区域  2. 下拉块（M/DBX/I/Q/MB/DBB/IB/QB/MW/DBW/IW/QW/MD/DBD/ID/QD） 3.  DB号  4. 地址偏移量   5. 位   6. 长度   7.  地址类型 
  let wrap = document.getElementById('popup-body-wrap')
  let html = ``
    if (items.includes(1)) {
      html +=`
      <div class="PBW-block" >
          <div class="PBW-block-item" >
            <span>数据区域</span>
            <select onchange="changeData(event, 'dataArea', '${type}')" >
              <option value="位" ${data.dataArea === '位' ? 'selected' : ''} >位</option>
              <option value="DB" ${data.dataArea === 'DB' ? 'selected' : ''} >DB</option>
              <option value="输入" ${data.dataArea === '输入' ? 'selected' : ''} >输入</option>
              <option value="输出" ${data.dataArea === '输出' ? 'selected' : ''} >输出</option>
            </select>
          </div>
      </div>
      `.trim()
    }

    if (items.includes(2)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>${data.letters}</span>
            <input type="number" min="0" value="${data.lettleValue}" onblur="blurData(event, 'lettleValue', 'S7_TCP')" >
          </div>
        </div>
      `.trim()
    }

    if (items.includes(3)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>DB号</span>
            <input type="number" min="1" value="${data.DBNum}" onblur="blurData(event, 'DBNum', 'S7_TCP')" >
          </div>
        </div>
      `.trim()
    }

    if (items.includes(4)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>地址偏移量</span>
            <input type="number" min="1" value="${data.addressOffset}" onblur="blurData(event, 'addressOffset', 'S7_TCP')" >
          </div>
        </div>
      `.trim()
    }

    if (items.includes(5)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>位</span>
            <select onchange="changeData(event, 'bit', '${type}')">
              <option value="0" ${data.bit === '0' ? 'selected' : ''} >0</option>
              <option value="1" ${data.bit === '1' ? 'selected' : ''} >1</option>
              <option value="2" ${data.bit === '2' ? 'selected' : ''} >2</option>
              <option value="3" ${data.bit === '3' ? 'selected' : ''} >3</option>
              <option value="4" ${data.bit === '4' ? 'selected' : ''} >4</option>
              <option value="5" ${data.bit === '5' ? 'selected' : ''} >5</option>
              <option value="6" ${data.bit === '6' ? 'selected' : ''} >6</option>
              <option value="7" ${data.bit === '7' ? 'selected' : ''} >7</option>
            </select>
          </div>
        </div>
      `.trim()
    }

    if (items.includes(6)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>长度</span>
            <input type="number" min="1" max="255" value="${data.len}" onblur="blurData(event, 'len', 'S7_TCP')" >
          </div>
        </div>
      `.trim()
    }

    if (items.includes(7)) {
      let types = ['字符串', '宽字符串']
      if(types.includes(type)) {
        html += `
          <div class="PBW-block" >
            <div class="PBW-block-item">
              <span>地址类型</span>
              <select onchange="changeData(event, 'addressType', '${type}')">
                <option value="字节" ${data.addressType === '字节' ? 'selected' : ''} >字节</option>
                <option value="字" ${data.addressType === '字' ? 'selected' : ''} >字</option>
              </select>
            </div>
          </div>
        `.trim()
      } else {
        html += `
          <div class="PBW-block" >
            <div class="PBW-block-item">
              <span>地址类型</span>
              <select onchange="changeData(event, 'addressType', '${type}')">
                <option value="字节" ${data.addressType === '字节' ? 'selected' : ''} >字节</option>
                <option value="字" ${data.addressType === '字' ? 'selected' : ''} >字</option>
                <option value="双字" ${data.addressType === '双字' ? 'selected' : ''} >双字</option>
              </select>
            </div>
          </div>
        `.trim()
      }
    }

    configPane.appendChild(html)
  
  }

  // Modbus_TCP协议 弹窗渲染函数
  function renderModbus_TCPHTML (items = [], data = {}, type) {
    // 1. 数据区域  2. 偏移地址   3.位  4. 长度
    let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754', '字符串']
    /* 
      types 里面的内容数据区域部分只显示 输入寄存器 和 保持寄存器
    */
    let wrap = document.getElementById('popup-body-wrap')
    let html = ``
    if (items.includes(1)) {
      if (!types.includes(type)) {
        html +=`
        <div class="PBW-block" >
            <div class="PBW-block-item" >
              <span>数据区域</span>
              <select onchange="changeModbus_TCPData(event, 'dataArea', '${type}')" >
                <option value="线圈状态" ${data.dataArea === '线圈状态' ? 'selected' : ''} >线圈状态</option>
                <option value="离散输入状态" ${data.dataArea === '离散输入状态' ? 'selected' : ''} >离散输入状态</option>
                <option value="输入寄存器" ${data.dataArea === '输入寄存器' ? 'selected' : ''} >输入寄存器</option>
                <option value="保持寄存器" ${data.dataArea === '保持寄存器' ? 'selected' : ''} >保持寄存器</option>
              </select>
            </div>
        </div>
        `.trim()
      } else {
        html +=`
          <div class="PBW-block" >
              <div class="PBW-block-item" >
                <span>数据区域</span>
                <select onchange="changeModbus_TCPData(event, 'dataArea', '${type}')" >
                  <option value="输入寄存器" ${data.dataArea === '输入寄存器' ? 'selected' : ''} >输入寄存器</option>
                  <option value="保持寄存器" ${data.dataArea === '保持寄存器' ? 'selected' : ''} >保持寄存器</option>
                </select>
              </div>
          </div>
          `.trim()
      }
    }
    if (items.includes(2)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>偏移地址</span>
            <input type="number" min="0" value="${data.address}" onblur="blurData(event, 'address', 'Modbus_TCP')" >
          </div>
        </div>
      `.trim()
    }

    if (items.includes(3)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>位</span>
            <select onchange="changeModbus_TCPData(event, 'bit', '${type}')">
              <option value="0" ${data.bit === '0' ? 'selected' : ''} >0</option>
              <option value="1" ${data.bit === '1' ? 'selected' : ''} >1</option>
              <option value="2" ${data.bit === '2' ? 'selected' : ''} >2</option>
              <option value="3" ${data.bit === '3' ? 'selected' : ''} >3</option>
              <option value="4" ${data.bit === '4' ? 'selected' : ''} >4</option>
              <option value="5" ${data.bit === '5' ? 'selected' : ''} >5</option>
              <option value="6" ${data.bit === '6' ? 'selected' : ''} >6</option>
              <option value="7" ${data.bit === '7' ? 'selected' : ''} >7</option>
              <option value="8" ${data.bit === '8' ? 'selected' : ''} >8</option>
              <option value="9" ${data.bit === '9' ? 'selected' : ''} >9</option>
              <option value="10" ${data.bit === '10' ? 'selected' : ''} >10</option>
              <option value="11" ${data.bit === '11' ? 'selected' : ''} >11</option>
              <option value="12" ${data.bit === '12' ? 'selected' : ''} >12</option>
              <option value="13" ${data.bit === '13' ? 'selected' : ''} >13</option>
              <option value="14" ${data.bit === '14' ? 'selected' : ''} >14</option>
              <option value="15" ${data.bit === '15' ? 'selected' : ''} >15</option>
            </select>
          </div>
        </div>
      `.trim()
    }

    if (items.includes(4)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>长度</span>
            <input type="number" min="1" max="255" value="${data.len}" onblur="blurData(event, 'len', 'Modbus_TCP')" >
          </div>
        </div>
      `.trim()
    }

    configPane.appendChild(html)
  }

  // MC3E_Binary_Etherent协议 弹窗渲染函数
  function renderMBEHTML (items = [], data = {}, type) {
    // 1. 数据区域    2.  地址    3.  位    4. 长度
    let wrap = document.getElementById('popup-body-wrap')
    let html = ``
    if (items.includes(1)) {
        if (type === '二进制变量') {
          html +=`
          <div class="PBW-block" >
              <div class="PBW-block-item" >
                <span>数据区域</span>
                <select onchange="changeMBEData(event, 'dataArea', '${type}')" >
                  <option value="输入寄存器（X）" ${data.dataArea === '输入寄存器（X）' ? 'selected' : ''} >输入寄存器（X）</option>
                  <option value="输出寄存器（Y）" ${data.dataArea === '输出寄存器（Y）' ? 'selected' : ''} >输出寄存器（Y）</option>
                  <option value="内部继电器（M）" ${data.dataArea === '内部继电器（M）' ? 'selected' : ''} >内部继电器（M）</option>
                  <option value="定时器（触点）（TS）" ${data.dataArea === '定时器（触点）（TS）' ? 'selected' : ''} >定时器（触点）（TS）</option>
                  <option value="定时器（线圈）（TC）" ${data.dataArea === '定时器（线圈）（TC）' ? 'selected' : ''} >定时器（线圈）（TC）</option>
                  <option value="计数器（触点）（CS）" ${data.dataArea === '计数器（触点）（CS）' ? 'selected' : ''} >计数器（触点）（CS）</option>
                  <option value="计数器（线圈）（CC）" ${data.dataArea === '计数器（线圈）（CC）' ? 'selected' : ''} >计数器（线圈）（CC）</option>
                  <option value="数据寄存器（D）" ${data.dataArea === '数据寄存器（D）' ? 'selected' : ''} >数据寄存器（D）</option>
                  <option value="链接寄存器（W）" ${data.dataArea === '链接寄存器（W）' ? 'selected' : ''} >链接寄存器（W）</option>
                  <option value="定时器（当前值）（TN）" ${data.dataArea === '定时器（当前值）（TN）' ? 'selected' : ''} >定时器（当前值）（TN）</option>
                  <option value="计数器（当前值）（CN）" ${data.dataArea === '计数器（当前值）（CN）' ? 'selected' : ''} >计数器（当前值）（CN）</option>
                </select>
              </div>
          </div>
          `.trim()
        } else {
          html +=`
          <div class="PBW-block" >
              <div class="PBW-block-item" >
                <span>数据区域</span>
                <select onchange="changeMBEData(event, 'dataArea', '${type}')" >
                  <option value="数据寄存器（D）" ${data.dataArea === '数据寄存器（D）' ? 'selected' : ''} >数据寄存器（D）</option>
                  <option value="链接寄存器（W）" ${data.dataArea === '链接寄存器（W）' ? 'selected' : ''} >链接寄存器（W）</option>
                  <option value="定时器（当前值）（TN）" ${data.dataArea === '定时器（当前值）（TN）' ? 'selected' : ''} >定时器（当前值）（TN）</option>
                  <option value="计数器（当前值）（CN）" ${data.dataArea === '计数器（当前值）（CN）' ? 'selected' : ''} >计数器（当前值）（CN）</option>
                </select>
              </div>
          </div>
          `.trim()
        }
    }

    if (items.includes(2)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>偏移地址</span>
            <input type="number" min="0" value="${data.address}" onblur="blurData(event, 'address', 'MC3E_Binary_Etherent')" >
          </div>
        </div>
      `.trim()
    }

    if (items.includes(3)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>位</span>
            <select onchange="changeMBEData(event, 'bit', '${type}')">
              <option value="0" ${data.bit === '0' ? 'selected' : ''} >0</option>
              <option value="1" ${data.bit === '1' ? 'selected' : ''} >1</option>
              <option value="2" ${data.bit === '2' ? 'selected' : ''} >2</option>
              <option value="3" ${data.bit === '3' ? 'selected' : ''} >3</option>
              <option value="4" ${data.bit === '4' ? 'selected' : ''} >4</option>
              <option value="5" ${data.bit === '5' ? 'selected' : ''} >5</option>
              <option value="6" ${data.bit === '6' ? 'selected' : ''} >6</option>
              <option value="7" ${data.bit === '7' ? 'selected' : ''} >7</option>
              <option value="8" ${data.bit === '8' ? 'selected' : ''} >8</option>
              <option value="9" ${data.bit === '9' ? 'selected' : ''} >9</option>
              <option value="A" ${data.bit === 'A' ? 'selected' : ''} >A</option>
              <option value="B" ${data.bit === 'B' ? 'selected' : ''} >B</option>
              <option value="C" ${data.bit === 'C' ? 'selected' : ''} >C</option>
              <option value="D" ${data.bit === 'D' ? 'selected' : ''} >D</option>
              <option value="E" ${data.bit === 'E' ? 'selected' : ''} >E</option>
              <option value="F" ${data.bit === 'F' ? 'selected' : ''} >F</option>
            </select>
          </div>
        </div>
      `.trim()
    }

    if (items.includes(4)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>长度</span>
            <input type="number" min="1" max="255" value="${data.len}" onblur="blurData(event, 'len', 'MC3E_Binary_Etherent')" >
          </div>
        </div>
      `.trim()
    }
    configPane.appendChild(html)
  }

  // MCA1E_Binary_Etherent协议 弹窗渲染函数
  function renderMABEHTML(items = [], data = {}, type) {
    // 1. 数据区域    2.  地址    3.  位    4. 长度
    let wrap = document.getElementById('popup-body-wrap')
    let html = ``
    if (items.includes(1)) {
      if (type === '二进制变量') {
        html +=`
          <div class="PBW-block" >
              <div class="PBW-block-item" >
                <span>数据区域</span>
                <select onchange="changeMABEData(event, 'dataArea', '${type}')" >
                  <option value="输入寄存器（X）" ${data.dataArea === '输入寄存器（X）' ? 'selected' : ''} >输入寄存器（X）</option>
                  <option value="输出寄存器（Y）" ${data.dataArea === '输出寄存器（Y）' ? 'selected' : ''} >输出寄存器（Y）</option>
                  <option value="辅助继电器（M）" ${data.dataArea === '辅助继电器（M）' ? 'selected' : ''} >辅助继电器（M）</option>
                  <option value="状态（S）" ${data.dataArea === '状态（S）' ? 'selected' : ''} >状态（S）</option>
                  <option value="数据寄存器（D）" ${data.dataArea === '数据寄存器（D）' ? 'selected' : ''} >数据寄存器（D）</option>
                  <option value="扩展寄存器（R）" ${data.dataArea === '扩展寄存器（R）' ? 'selected' : ''} >扩展寄存器（R）</option>
                  <option value="定时器（触点）（TS）" ${data.dataArea === '定时器（触点）（TS）' ? 'selected' : ''} >定时器（触点）（TS）</option>
                  <option value="定时器（当前值）（TN）" ${data.dataArea === '定时器（当前值）（TN）' ? 'selected' : ''} >定时器（当前值）（TN）</option>
                  <option value="计数器（触点）（CS）" ${data.dataArea === '计数器（触点）（CS）' ? 'selected' : ''} >计数器（触点）（CS）</option>
                  <option value="计数器（当前值）（CN）" ${data.dataArea === '计数器（当前值）（CN）' ? 'selected' : ''} >计数器（当前值）（CN）</option>
                </select>
              </div>
          </div>
          `.trim()
      } else {
        html +=`
          <div class="PBW-block" >
              <div class="PBW-block-item" >
                <span>数据区域</span>
                <select onchange="changeMABEData(event, 'dataArea', '${type}')" >
                  <option value="数据寄存器（D）" ${data.dataArea === '数据寄存器（D）' ? 'selected' : ''} >数据寄存器（D）</option>
                  <option value="扩展寄存器（R）" ${data.dataArea === '扩展寄存器（R）' ? 'selected' : ''} >扩展寄存器（R）</option>
                  <option value="定时器（当前值）（TN）" ${data.dataArea === '定时器（当前值）（TN）' ? 'selected' : ''} >定时器（当前值）（TN）</option>
                  <option value="计数器（当前值）（CN）" ${data.dataArea === '计数器（当前值）（CN）' ? 'selected' : ''} >计数器（当前值）（CN）</option>
                </select>
              </div>
          </div>
          `.trim()
      }
    }

    if (items.includes(2)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>偏移地址</span>
            <input type="number" min="0" value="${data.address}" onblur="blurData(event, 'address', 'MCA1E_Binary_Etherent')" >
          </div>
        </div>
      `.trim()
    }

    if (items.includes(3)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>位</span>
            <select onchange="changeMABEData(event, 'bit', '${type}')">
              <option value="0" ${data.bit === '0' ? 'selected' : ''} >0</option>
              <option value="1" ${data.bit === '1' ? 'selected' : ''} >1</option>
              <option value="2" ${data.bit === '2' ? 'selected' : ''} >2</option>
              <option value="3" ${data.bit === '3' ? 'selected' : ''} >3</option>
              <option value="4" ${data.bit === '4' ? 'selected' : ''} >4</option>
              <option value="5" ${data.bit === '5' ? 'selected' : ''} >5</option>
              <option value="6" ${data.bit === '6' ? 'selected' : ''} >6</option>
              <option value="7" ${data.bit === '7' ? 'selected' : ''} >7</option>
              <option value="8" ${data.bit === '8' ? 'selected' : ''} >8</option>
              <option value="9" ${data.bit === '9' ? 'selected' : ''} >9</option>
              <option value="A" ${data.bit === 'A' ? 'selected' : ''} >A</option>
              <option value="B" ${data.bit === 'B' ? 'selected' : ''} >B</option>
              <option value="C" ${data.bit === 'C' ? 'selected' : ''} >C</option>
              <option value="D" ${data.bit === 'D' ? 'selected' : ''} >D</option>
              <option value="E" ${data.bit === 'E' ? 'selected' : ''} >E</option>
              <option value="F" ${data.bit === 'F' ? 'selected' : ''} >F</option>
            </select>
          </div>
        </div>
      `.trim()
    }

    if (items.includes(4)) {
      html += `
        <div class="PBW-block" >
          <div class="PBW-block-item">
            <span>长度</span>
            <input type="number" min="1" max="255" value="${data.len}" onblur="blurData(event, 'len', 'MCA1E_Binary_Etherent')" >
          </div>
        </div>
      `.trim()
    }
    configPane.appendChild(html)
  }

  // Fins_TCP协议 弹窗渲染函数
  function renderFins_TCPHTML(items = [], data = {}, type) {
    // 1. 数据区域    2.  地址    3.  位    4. 长度
    let wrap = document.getElementById('popup-body-wrap')
    let html = ``
    if (items.includes(1)) {
      let binaryarea = ['CIO','WR','HR','AR','TIM/CNT(Complettion Flag)','DM','EM current bank','EM bank 0','EM bank 1','EM bank 2','EM bank 3','EM bank 4','EM bank 5','EM bank 6','EM bank 7','EM bank 8','EM bank 9','EM bank A','EM bank B','EM bank C','EM bank D','EM bank E','EM bank F','EM bank 10','EM bank 11','EM bank 12','EM bank 13','EM bank 14','EM bank 15','EM bank 16','EM bank 17','EM bank 18'] 
      if (type === '二进制变量') {
          let str = ``
          binaryarea.forEach(item => {
            str +=  `<option value="${item}" ${data.dataArea === item ? 'selected' : ''} >${item}</option>`
          })
          html +=`
          <div class="PBW-block" >
              <div class="PBW-block-item" >
                <span>数据区域</span>
                <select onchange="changeFins_TCPData(event, 'dataArea', '${type}')" >
                  ${str}
                </select>
              </div>
          </div>
          `.trim()
        } else {
          let str = ``
          binaryarea.filter(f => f !== 'TIM/CNT(Complettion Flag)').forEach(item => {
            str +=  `<option value="${item}" ${data.dataArea === item ? 'selected' : ''} >${item}</option>`
          })
          html +=`
          <div class="PBW-block" >
              <div class="PBW-block-item" >
                <span>数据区域</span>
                <select onchange="changeFins_TCPData(event, 'dataArea', '${type}')" >
                  ${str}
                </select>
              </div>
          </div>
          `.trim()
        }
  }

  if (items.includes(2)) {
    html += `
      <div class="PBW-block" >
        <div class="PBW-block-item">
          <span>偏移地址</span>
          <input type="number" min="0" value="${data.address}" onblur="blurData(event, 'address', 'Fins_TCP')" >
        </div>
      </div>
    `.trim()
  }

  if (items.includes(3)) {
    html += `
      <div class="PBW-block" >
        <div class="PBW-block-item">
          <span>位</span>
          <select onchange="changeFins_TCPData(event, 'bit', '${type}')">
            <option value="0" ${data.bit === '0' ? 'selected' : ''} >0</option>
            <option value="1" ${data.bit === '1' ? 'selected' : ''} >1</option>
            <option value="2" ${data.bit === '2' ? 'selected' : ''} >2</option>
            <option value="3" ${data.bit === '3' ? 'selected' : ''} >3</option>
            <option value="4" ${data.bit === '4' ? 'selected' : ''} >4</option>
            <option value="5" ${data.bit === '5' ? 'selected' : ''} >5</option>
            <option value="6" ${data.bit === '6' ? 'selected' : ''} >6</option>
            <option value="7" ${data.bit === '7' ? 'selected' : ''} >7</option>
            <option value="8" ${data.bit === '8' ? 'selected' : ''} >8</option>
            <option value="9" ${data.bit === '9' ? 'selected' : ''} >9</option>
            <option value="10" ${data.bit === '10' ? 'selected' : ''} >10</option>
            <option value="11" ${data.bit === '11' ? 'selected' : ''} >11</option>
            <option value="12" ${data.bit === '12' ? 'selected' : ''} >12</option>
            <option value="13" ${data.bit === '13' ? 'selected' : ''} >13</option>
            <option value="14" ${data.bit === '14' ? 'selected' : ''} >14</option>
            <option value="15" ${data.bit === '15' ? 'selected' : ''} >15</option>
          </select>
        </div>
      </div>
    `.trim()
  }

  if (items.includes(4)) {
    html += `
      <div class="PBW-block" >
        <div class="PBW-block-item">
          <span>长度</span>
          <input type="number" min="1" max="255" value="${data.len}" onblur="blurData(event, 'len', 'Fins_TCP')" >
        </div>
      </div>
    `.trim()
  }
  configPane.appendChild(html)
  }

  // OPC DA协议、PC UA协议 弹窗渲染函数
  function renderOPCHTML(items = [], data = {}, type) {

  }

  // 选择下拉内容 -- S7_TCP协议
  function changeData (e, prop, type) {
    formData[prop] = e.target.value
    if (type === '二进制变量') {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '位') {
          formData.letters = 'M'
          formData.showList = [1,2,5]
        } else if (e.target.value === 'DB') {
          formData.letters = 'DBX'
          formData.showList = [1,2,3,5]
        } else if (e.target.value === '输入') {
          formData.letters = 'I'
          formData.showList = [1,2,5]
        } else if (e.target.value === '输出') {
          formData.letters = 'Q'
          formData.showList = [1,2,5]
        }
      }
    } else if (type === '有符号8位整型' || type === '无符号8位整型') {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '位') {
          formData.letters = 'MB'
          formData.showList = [1,2]
        } else if (e.target.value === 'DB') {
          formData.letters = 'DBB'
          formData.showList = [1,2,3]
        } else if (e.target.value === '输入') {
          formData.letters = 'IB'
          formData.showList = [1,2]
        } else if (e.target.value === '输出') {
          formData.letters = 'QB'
          formData.showList = [1,2]
        }
      }
    } else if (type === '有符号16位整型' || type === '无符号16位整型') {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '位') {
          formData.letters = 'MW'
          formData.showList = [1,2]
        } else if (e.target.value === 'DB') {
          formData.letters = 'DBW'
          formData.showList = [1,2,3]
        } else if (e.target.value === '输入') {
          formData.letters = 'IW'
          formData.showList = [1,2]
        } else if (e.target.value === '输出') {
          formData.letters = 'QW'
          formData.showList = [1,2]
        }
      }
    } else if (type === '有符号32位整型' || type === '无符号32位整型' || type === 'F32位浮点数IEEE754' || type === '定时器') {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '位') {
          formData.letters = 'MD'
          formData.showList = [1,2]
        } else if (e.target.value === 'DB') {
          formData.letters = 'DBD'
          formData.showList = [1,2,3]
        } else if (e.target.value === '输入') {
          formData.letters = 'ID'
          formData.showList = [1,2]
        } else if (e.target.value === '输出') {
          formData.letters = 'QD'
          formData.showList = [1,2]
        }
      }
    } else if (type === '有符号64位整型' || type === '无符号64位整型' || type === 'F64位浮点数IEEE754' || type === '日期'|| type === '时间'|| type === '日期时间') {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '位') {
          formData.showList = [1,4,7]
        } else if (e.target.value === 'DB') {
          formData.showList = [1,3,4,7]
        } else if (e.target.value === '输入') {
          formData.showList = [1,4,7]
        } else if (e.target.value === '输出') {
          formData.showList = [1,4,7]
        }
      }
    } else if (type === '文本变量8位字符集' || type === '文本变量16位字符集') {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '位') {
          formData.showList = [1,4,6]
        } else if (e.target.value === 'DB') {
          formData.showList = [1,3,4,6]
        } else if (e.target.value === '输入') {
          formData.showList = [1,4,6]
        } else if (e.target.value === '输出') {
          formData.showList = [1,4,6]
        }
      }
    } else if (type === '字符串' || type === '宽字符串') {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '位') {
          formData.showList = [1,4,6,7]
        } else if (e.target.value === 'DB') {
          formData.showList = [1,3,4,6,7]
        } else if (e.target.value === '输入') {
          formData.showList = [1,4,6,7]
        } else if (e.target.value === '输出') {
          formData.showList = [1,4,6,7]
        }
      }
    }
    renderS7_TCPHTML(formData.showList, formData, type)
  }

  // 选择下拉内容 -- Modbus_TCP协议
  function changeModbus_TCPData (e, prop, type) {
    let types = ['有符号8位整型','有符号16位整型','有符号32位整型','有符号64位整型','无符号8位整型','无符号16位整型','无符号32位整型','无符号64位整型','F32位浮点数IEEE754','F64位浮点数IEEE754']
    formData[prop] = e.target.value
    if (type === '二进制变量') {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '线圈状态') {
          formData.showList = [1,2]
        } else if (e.target.value === '离散输入状态') {
          formData.showList = [1,2]
        } else if (e.target.value === '输入寄存器') {
          formData.showList = [1,2,3]
        } else if (e.target.value === '保持寄存器') {
          formData.showList = [1,2,3]
        }
      }
    } else if (types.includes(type)) {
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (e.target.value === '输入寄存器') {
          formData.showList = [1,2]
        } else if (e.target.value === '保持寄存器') {
          formData.showList = [1,2]
        }
      }
    }
    renderModbus_TCPHTML(formData.showList, formData, type)
  }

  // 选择下拉内容 -- MC3E_Binary_Etherent协议
  function changeMBEData (e, prop, type) {
    formData[prop] = e.target.value
    if (type === '二进制变量') {
      let types = ['输入寄存器（X）','输出寄存器（Y）','内部继电器（M）','定时器（触点）（TS）','定时器（线圈）（TC）','计数器（触点）（CS）','计数器（线圈）（CC）']
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (types.includes(e.target.value)) {
          formData.showList = [1,2]
        } else {
          formData.showList = [1,2,3]
        }
      }
    }

    renderMBEHTML(formData.showList, formData, type)
  }

  // 选择下拉内容 -- MCA1E_Binary_Etherent协议
  function changeMABEData (e, prop, type) {
    formData[prop] = e.target.value
    if (type === '二进制变量') {
      let types = ['输入寄存器（X）','输出寄存器（Y）','辅助继电器（M）','状态（S）','定时器（触点）（TS）','计数器（触点）（CS）']
      if (prop === 'dataArea') {  // 数据区域部分需要重新渲染弹窗html元素
        if (types.includes(e.target.value)) {
          formData.showList = [1,2]
        } else {
          formData.showList = [1,2,3]
        }
      }
    }

    renderMABEHTML(formData.showList, formData, type)
  }

  // 选择下拉内容 -- Fins_TCP协议
  function changeFins_TCPData (e, prop, type) {
    formData[prop] = e.target.value
    if (type === '二进制变量') {
      if (e.target.value === 'TIM/CNT(Complettion Flag)') {
        formData.showList = [1,2]
      } else {
        formData.showList = [1,2,3]
      }
    }

    renderFins_TCPHTML(formData.showList, formData, type)
  }

  function blurData (e, prop, protocal) {
    let types = ['DBNum','addressOffset']
    if (prop === 'lettleValue') {
      // 必填，0或正整数；
      if (!e.target.value) {
        e.target.value = 0
      } else if (e.target.value < 0) {
        e.target.value = 0
      }
    } else if (types.includes(prop)) {
      // 必填，大于0的正整数
      if (!e.target.value) {
        e.target.value = 1
      } else if (e.target.value < 1) {
        e.target.value = 1
      }
    } else if (prop === 'len') {
      // 必填，1-255的正整数
      if (!e.target.value) {
        e.target.value = 1
      } else if (e.target.value <= 1) {
        e.target.value = 1
      } else if (e.target.value >= 255) {
        e.target.value = 255
      }
    } else if (prop === 'address') {
      if (protocal === 'Modbus_TCP') {
        // 必填，1-65536的正整数；
        if (!e.target.value) {
          e.target.value = 1
        } else if (e.target.value <= 1) {
          e.target.value = 1
        } else if (e.target.value >= 65536) {
          e.target.value = 65536
        }
      } else if (protocal === 'MC3E_Binary_Etherent') {
        // 必填，0或正整数，八进制格式；
        if (!e.target.value) {
          e.target.value = 0
        } else if (e.target.value <= 0) {
          e.target.value = 0
        } 
      } else if (protocal === 'MCA1E_Binary_Etherent') {
        // 必填，正整数，八进制格式；
        if (!e.target.value) {
          e.target.value = 0
        } else if (e.target.value <= 0) {
          e.target.value = 0
        } 
      } else if (protocal === 'MCA1E_Binary_Etherent') {
        // 必填，0或正整数；
        if (!e.target.value) {
          e.target.value = 0
        } else if (e.target.value <= 0) {
          e.target.value = 0
        } 
      }
    }
    e.target.value = parseInt(e.target.value)
    formData[prop] = e.target.value
  }

  return configPane
}