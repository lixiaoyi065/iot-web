import service from 'utils/request'

export function getEquList() {
  return service({
    url: '/VariableManage/GetTreeStructure',
    method: 'get'
  })
}

export function addGroup(group) {
  return service({
    url: '/api/VariableManage/AddGroup',
    params: {
      ...group
    },
    method: 'post'
  })
}

export function addEqu(group) {
  return service({
    url: '/api/VariableManage/AddEqu',
    params: {
      ...group
    },
    method: 'post'
  })
}