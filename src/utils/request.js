import { message } from 'antd'
import axios from 'axios'
import {getCookie} from 'utils'

const service = axios.create({
  baseURL: "http://localhost:3000/api1/api",
  timeout: 5000,
  async: true,
  //允许跨域
  crossDomain: true, 
})

service.interceptors.request.use(
  config => {
    let token = getCookie("accessToken")
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.Code === 4002) {
      message.error("登录失效，请重新登录")
      return []
    } else {
      return res
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error("登录失效，请重新登录")
          break;
        default:
          break;
      }
    }
    return Promise.reject(error.response.data)
  }
)

export default service
