import { ElMessage } from 'element-plus'
import useUserStore from '@/store/user'
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 2000
})

let userStore = null

request.interceptors.request.use((config) => {
  if (!userStore) {
    userStore = useUserStore()
  }
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    if (!userStore) {
      userStore = useUserStore()
    }
    let message = ''
    const status = error.response.status
    switch (status) {
      case 304:
        return 'ok'
      case 401:
        message = '身份信息过期'
        await userStore.logout()
        userStore.toLogin()
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = error.response.data.errMessage
        break
      default:
        message = '网络出现问题'
        break
    }
    ElMessage({
      type: 'error',
      message
    })
    return Promise.reject(error)
  }
)

export default request
