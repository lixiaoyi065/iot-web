import axios from 'utils/request'

export function GetList(pageIndex, deviceId) {
  return axios({
    baseURL: "https://www.fastmock.site/mock/252af95046512548bd771bcf6a08b05b/src_iot",
    url: "/realTime",
    params: {
      pageIndex,
      deviceId
    },
    method: 'get'
  })
}