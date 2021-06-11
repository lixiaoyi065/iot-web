import axios from 'axios'

const service = axios.create({
  baseURL: "http://localhost:3000/api1/api",
  timeout: 5000,
  async: true,
  //允许跨域
  crossDomain: true, 
})

service.interceptors.request.use(
  config => {
    let token = window.localStorage.getItem("accessToken")
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
    const res = response
    
    return res.data
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service
