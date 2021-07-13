import axios from 'axios'
import notification from 'ant-design-vue'

// 创建 axios 实例
const service = axios.create({
  baseURL: '', // api base_url
  timeout: 12000, // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message,
      })
    }
    if (error.response.status === 401) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed',
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use((config) => {
  // config.withCredentials = true
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response
}, err)

export { service }
