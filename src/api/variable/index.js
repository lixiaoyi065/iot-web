import service from 'utils/request'

export function getEquList() {
  return service({
    url: '/VariableManage/GetTreeStructure',
    method: 'get'
  })
}