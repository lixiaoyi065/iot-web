import axios from 'axios'

const service = axios.create({
  baseURL: "http://localhost:3000/api1/api",
  timeout: 5000,
  async: true,
  //允许跨域
  crossDomain: true, 
  'Content-Type': 'application/x-www-form-urlencoded'
})

service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    
    return res.data
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service
