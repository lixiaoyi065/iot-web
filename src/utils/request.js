import { message } from 'antd'
import axios from 'axios'
import {getCookie, setCookie} from 'utils'

console.log(process.env)
const service = axios.create({
  baseURL:  process.env.NODE_ENV === 'production'? "/api": "/api1/api",
  timeout: 50000,
  async: true,
  //允许跨域
  crossDomain: true,
  retry: 4,
  retryDelay: 1000
})

service.interceptors.request.use(
  config => {
    let token = getCookie("accessToken")
    let url = config.url
    if (url.substring(1, 6) === "Login") {
      return config;
    } else {
      if (token) {
        config.headers['Authorization'] = token;
      } else if(token === ""){
        setCookie("login", -1)
      }
      return config;
    }
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.Code === 4002) {
      setCookie('login', '', -1)
      return []
    } else {
      return res
    }
  },
  error => {
    const { config, code, msg } = error
    console.log(config, code, message)
    //请求超时
    if (code === 'ECONNABORTED' || msg === 'Network Error'){
      message.error(`请求超时，将在${ config.retryDelay / 1000}秒后重试`)
      return new Promise(resolve => {
          setTimeout(async _ => {
              resolve(await service.request(config))
              }, config.retryDelay) // 设置发送间隔
          })
    }else if (error.response) {
      switch (error.response.status) {
        case 401:
          setCookie('login', '', -1)
          break;
        case 504:
          message.error("服务器未响应")
          break;
        default:
          break;
      }
      return Promise.reject(error.response.data)
    }
    
    return Promise.reject(error)
  }
)

export default service
