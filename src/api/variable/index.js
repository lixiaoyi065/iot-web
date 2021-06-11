import service from 'utils/request'

//获取设备列表
export function getEquList() {
  return service({
    url: '/VariableManage/GetTreeStructure',
    method: 'get'
  })
}
//获取设备
export function getEqu(deviceId){
  return service({
    url: '/VariableManage/GetDevice',
    params: {
      deviceId
    },
    method: 'get'
  })
}
//添加分组
export function addGroup(data) {
  console.log(data)
  return service({
    url: '/VariableManage/AddGroup',
    data,
    method: 'post'
  })
}
//添加设备
export function addEqu(data) {
  return service({
    url: '/VariableManage/AddDevice',
    data, 
    method: 'post',
  })
}
//修改设备
export function modifyEqu(data) {
  return service({
    url: '​/VariableManage​/ModifyDevice',
    data,
    method: 'put'
  })
}
//删除设备
export function delEqu(id) {
  return service({
    url: "/VariableManage/DeleteDevice",
    data: {
      id
    },
    method: 'delete',
  })
}
//修改分组
export function modifyGroup(data) {
  return service({
    url: '/VariableManage/ModifyGroup',
    data,
    method: 'put'
  })
}
//删除分组
export function delGroup(id) {
  return service({
    url: '/VariableManage/DeleteGroup',
    data: {
      id
    },
    method: 'delete'
  })
}
//获取变量列表
export function getVariableList(nodeId,page){
  return service({
    url: "",
    data:{
      nodeId,
      page
    },
    method: "post"
  })
}
//删除变量
export function delVariable(nodeId){
  return service({
    url: "",
    params:{
      nodeId
    },
    method: "delete"
  })
}
//保存变量修改
export function saveLists(nodeId){
  return service({
    url: "",
    data:{
      nodeId
    },
    method: "post"
  })
}
//获取数据类型
export function getDataType(){
  return service({
    url: "",
    method: "get"
  })
}