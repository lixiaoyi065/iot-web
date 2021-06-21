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