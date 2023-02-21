import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://43.139.223.94:8889/api/private/v1/'
const instance = axios.create({

  // baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  // 请求超时时间 5s
  timeout: 5000
})
// 发送request
instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    NProgress.done()
    return res
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)
export default instance
