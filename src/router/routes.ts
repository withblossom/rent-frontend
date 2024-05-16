export const constRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true,
      icon: 'Promotion'
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: ''
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home.vue'),
        name: 'home',
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled'
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/rent',
    component: () => import('@/layout/index.vue'),
    name: 'rent',
    meta: {
      title: '系统实体管理',
      hidden: false,
      icon: 'Operation'
    },
    redirect: '/rent/all-user',
    children: [
      {
        path: '/rent/all-user',
        component: () => import('@/views/allUser.vue'),
        name: 'allUser',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User'
        }
      },
      {
        path: '/rent/all-house',
        component: () => import('@/views/allHouse.vue'),
        name: 'allHouse',
        meta: {
          title: '房产管理',
          hidden: false,
          icon: 'House'
        }
      },
      {
        path: '/rent/all-rent',
        component: () => import('@/views/allRent.vue'),
        name: 'allRent',
        meta: {
          title: '交易信息管理',
          hidden: false,
          icon: 'Files'
        }
      }
    ]
  },
  {
    path: '/info',
    component: () => import('@/layout/index.vue'),
    name: 'info',
    meta: {
      title: '',
      hidden: true,
      icon: ''
    },
    redirect: '/home',
    children: [
      {
        path: '/user-info',
        component: () => import('@/views/userInfo.vue'),
        name: 'userInfo',
        meta: {
          title: '用户信息',
          hidden: true,
          icon: 'User'
        }
      },
      {
        path: '/house-info',
        component: () => import('@/views/houseInfo.vue'),
        name: 'houseInfo',
        meta: {
          title: '房产信息',
          hidden: true,
          icon: 'House'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: 'any',
      hidden: true,
      icon: ''
    }
  }
]
