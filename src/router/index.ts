import { createRouter, createWebHashHistory } from 'vue-router'
import { constRoutes } from './routes'
import { ElNotification } from 'element-plus'
import pinia from '@/store'
import useUserStore from '@/store/user'
import setting from '@/setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

nprogress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constRoutes,
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})

let userStore = null

router.beforeEach(async (to, from, next) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  if (!userStore) {
    userStore = useUserStore(pinia)
  }
  const token = userStore.token
  const username = userStore.username

  if (token) {
    if (to.path == '/login') {
      try {
        await userStore.userSelf()
        next({ path: '/' })
      } catch (error) {
        next()
      }
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userSelf()
          next()
        } catch (error) {
          userStore.logout()
          next({ name: 'login', replace: true })
          ElNotification({
            type: 'error',
            message: '请重新登录'
          })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach(() => {
  nprogress.done()
})

export default router
