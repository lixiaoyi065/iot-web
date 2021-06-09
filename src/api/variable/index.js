import service from 'utils/request'

export function getEquList() {
  return service({
    url: '/VariableManage/GetTreeStructure',
    method: 'get'
  })
}

export function addGroup(data) {
  return service({
    url: '/VariableManage/AddGroup',
    data,
    method: 'post'
  })
}

export function addEqu(data) {
  return service({
    url: '/VariableManage/AddDevice',
    data,
    method: 'post'
  })
}

export function delEqu(DeviceId) {
  return service({
    url: '/VariableManage/DeleteDevice',
    params: {
      DeviceId
    },
    method: 'delete'
  })
}