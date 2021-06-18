import service from 'utils/request'

//获取整棵设备列表树结构
export function GetTreeStructure() {
  return service({
    url: '/VariableManage/GetTreeStructure',
    method: 'get'
  })
}
export function GetTreeStructure2() {
  return service({
    baseURL:"https://www.fastmock.site/mock/252af95046512548bd771bcf6a08b05b/src_iot",
    url: '/equList',
    method: 'get'
  })
}
//获取设备
export function GetDevice(deviceId){
  return service({
    url: '/VariableManage/GetDevice',
    params: {
      deviceId
    },
    method: 'get'
  })
}
//添加设备
export function AddDevice(data) {
  return service({
    url: '/VariableManage/AddDevice',
    data, 
    method: 'post',
  })
}
//修改设备信息
export function ModifyDevice(data) {
  return service({
    url: '/VariableManage/ModifyDevice',
    data,
    method: 'put'
  })
}
//删除设备
export function DeleteDevice(id) {
  return service({
    url: "/VariableManage/DeleteDevice",
    data: {
      id
    },
    method: 'delete',
  })
}
//添加分组
export function AddGroup(data) {
  return service({
    url: '/VariableManage/AddGroup',
    data,
    method: 'post'
  })
}
//修改分组
export function ModifyGroup(data) {
  return service({
    url: '/VariableManage/ModifyGroup',
    data,
    method: 'put'
  })
}
//删除分组
export function DelGroup(id) {
  return service({
    url: '/VariableManage/DeleteGroup',
    data: {
      id
    },
    method: 'delete'
  })
}
//查询变量
export function QueryTags(data) {
  return service({
    url: "/VariableManage/QueryTags",
    params: data,
    method: 'get'
  })
}
//导出
export function ExportTags(data){
  return service({
    url: '/VariableManage/ExportTags',
    params: data,
    method: 'get'
  })
}
//初次加载变量
export function InitTags(data) {
  return service({
    url: "/VariableManage/InitTags",
    params: data,
    method: 'get'
  })
}
//校验变量名是否格式正确、重复
//params: object
export function VerifyTagName(params) {
  return service({
    url: "/VariableManage/VerifyTagName",
    params,
    method: 'get'
  })
}
//校验IO变量地址是否合法
//params: object
export function VerifyAddress(params) {
  return service({
    url: "/VariableManage/VerifyAddress",
    params,
    method: 'get'
  })
}
//获取地址编辑信息
//params: object
export function GetAddressEditInfo(params) {
  return service({
    url: "/VariableManage/GetAddressEditInfo",
    params,
    method: 'get'
  })
}
//保存变量
//data: object
export function SaveTags(data) {
  return service({
    url: "/VariableManage/SaveTags",
    data,
    method: 'post'
  })
}
//获取保存变量任务状态
//id: string
export function GetSaveTagsTaskProgress(id) {
  return service({
    url: "/VariableManage/GetSaveTagsTaskProgress",
    params: {
      id
    },
    method: 'get'
  })
}
//删除分组
//ids: Array
export function DeleteTags(ids) {
  return service({
    url: '/VariableManage/DeleteTags',
    data: {
      ids
    },
    method: 'delete'
  })
}