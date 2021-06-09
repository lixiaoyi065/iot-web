import service from 'utils/request'
//获取设备列表
export function getEquList() {
  return service({
    url: '/VariableManage/GetTreeStructure',
    method: 'get'
  })
}
//添加分组
export function addGroup(data) {
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
    method: 'post'
  })
}
//删除设备
export function delEqu(DeviceId) {
  return service({
    url: '/VariableManage/DeleteDevice',
    params: {
      DeviceId
    },
    method: 'delete'
  })
}
//获取设备列表
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