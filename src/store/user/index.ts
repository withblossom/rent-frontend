import { defineStore } from 'pinia'
import { getUserSelf, login, logout } from '@/api/user'
import type { loginformInter } from '@/api/type'
import router from '@/router'

const useUserStore = defineStore('user', {
  state() {
    return {
      token: localStorage.getItem('token'),
      phoneNumber: '',
      username: '',
      avatar: ''
    }
  },
  actions: {
    async userLogin(data: loginformInter) {
      return new Promise((resolve, reject) => {
        login(data)
          .then((result) => {
            this.token = result.data
            localStorage.setItem('token', result.data)
            resolve('ok')
          })
          .catch((error) => reject(error))
      })
    },
    async userSelf() {
      return new Promise((resolve, reject) => {
        getUserSelf()
          .then((result) => {
            this.avatar = result.data.avatar
            this.username = result.data.username
            this.phoneNumber = result.data.phoneNumber
            resolve('ok')
          })
          .catch((error) => reject(error))
      })
    },
    async logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            localStorage.removeItem('token')
            this.token = ''
            this.phoneNumber = ''
            this.username = ''
            this.avatar = ''
            resolve('ok')
          })
          .catch((error) => reject(error))
      })
    },
    toLogin() {
      router.replace({ name: 'login' })
    },
    toUserInfoPage(id) {
      router.push({ name: 'userInfo', query: { userId: id } })
    }
  }
})
export default useUserStore
