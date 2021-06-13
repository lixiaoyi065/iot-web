import service from 'utils/request'

//获取整棵设备列表树结构
export function GetTreeStructure() {
  return service({
    url: '/VariableManage/GetTreeStructure',
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
    url: '​/VariableManage​/ModifyDevice',
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
  console.log(data)
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



//获取设备列表
export function getEquList() {
  return service({
    url: '/VariableManage/GetTreeStructure',
    method: 'get'
  })
}
//获取设备
export function getEqu(){
  
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