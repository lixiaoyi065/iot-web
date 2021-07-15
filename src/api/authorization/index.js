import axios from 'utils/request'

export function GetSerialNumber() {
  return axios({
    url: "/AuthorizationManage/GetSerialNumber",
    method: 'get'
  })
}

export function GetAuthState() {
  return axios({
    url: "/AuthorizationManage/GetAuthState",
    method: "get"
  })
}

export function UploadAuthFile(data) {
  return axios({
    url: "/AuthorizationManage/UploadAuthFile",
    data: data.formData,
    method: "post",
    processData: false, //不处理发送的数据
    contentType: false, //不设置Content-Type请求头  
  })
}