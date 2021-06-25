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
    } else {
      message.error("你还没有登录哦, 确认将跳转登录界面进行登录!")
      return 
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
    const res = response
    
    return res.data
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service
