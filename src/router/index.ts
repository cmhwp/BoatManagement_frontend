import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      requiresAuth: false,
      title: '注册'
    }
  },
  {
    path: '/',
    name: 'Root',
    redirect: (to) => {
      // 在路由重定向时，我们无法直接使用 userStore，
      // 所以这里先重定向到 dashboard，在路由守卫中处理角色判断
      return '/dashboard'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      requiresAuth: true,
      title: '仪表板'
    },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: ['admin'],
      title: '管理中心'
    },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: {
          title: '管理面板'
        }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'merchants',
        name: 'AdminMerchants',
        component: () => import('@/views/admin/Merchants.vue'),
        meta: {
          title: '商家管理'
        }
      },
      {
        path: 'boats',
        name: 'AdminBoats',
        component: () => import('@/views/admin/Boats.vue'),
        meta: {
          title: '船舶管理'
        }
      },
      {
        path: 'crews',
        name: 'AdminCrews',
        component: () => import('@/views/admin/Crews.vue'),
        meta: {
          title: '船员管理'
        }
      }
    ]
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      requiresAuth: true,
      title: '订单管理'
    },
    children: [
      {
        path: '',
        redirect: '/orders/my'
      },
      // 用户订单页面
      {
        path: 'my',
        name: 'MyOrders',
        component: () => import('@/views/orders/MyOrders.vue'),
        meta: {
          title: '我的订单'
        }
      },
      {
        path: 'booking',
        name: 'OrderBooking',
        component: () => import('@/views/orders/Booking.vue'),
        meta: {
          title: '预约服务'
        }
      },
      // 商家订单管理
      {
        path: 'merchant',
        name: 'MerchantOrders',
        component: () => import('@/views/orders/MerchantOrders.vue'),
        meta: {
          requiresRole: ['merchant', 'admin'],
          title: '商家订单'
        }
      },
      // 船员订单页面
      {
        path: 'crew',
        name: 'CrewOrders',
        component: () => import('@/views/orders/CrewOrders.vue'),
        meta: {
          requiresRole: ['crew', 'admin'],
          title: '船员订单'
        }
      }
    ]
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      requiresAuth: true,
      title: '服务管理'
    },
    children: [
      {
        path: '',
        name: 'ServiceList',
        component: () => import('@/views/services/List.vue'),
        meta: {
          title: '服务列表'
        }
      },
      {
        path: 'my',
        name: 'MyServices',
        component: () => import('@/views/services/MyServices.vue'),
        meta: {
          requiresRole: ['merchant', 'admin'],
          title: '我的服务'
        }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      requiresAuth: true,
      title: '个人中心'
    },
    children: [
      {
        path: '',
        name: 'ProfileIndex',
        component: () => import('@/views/profile/Index.vue'),
        meta: {
          title: '个人信息'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 绿色智能船艇平台`
  }

  // 检查是否需要登录
  if (to.meta?.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 确保用户信息存在
    if (!userStore.user) {
      const success = await userStore.fetchUserInfo()
      if (!success) {
        next({ path: '/login' })
        return
      }
    }

    // 特殊处理：如果用户是admin且访问的是dashboard，重定向到admin页面
    if (userStore.isAdmin && to.path === '/dashboard') {
      next({ path: '/admin/dashboard' })
      return
    }

    // 检查角色权限
    if (to.meta.requiresRole) {
      const allowedRoles = to.meta.requiresRole as API.UserRole[]
      if (!userStore.userRole || !allowedRoles.includes(userStore.userRole)) {
        // 无权限访问，根据用户角色跳转到相应页面
        if (userStore.isAdmin) {
          next({ path: '/admin/dashboard' })
        } else {
          next({ path: '/dashboard' })
        }
        return
      }
    }
  } else {
    // 不需要登录的页面，如果已登录则根据角色跳转到相应首页
    if (userStore.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
      if (userStore.isAdmin) {
        next({ path: '/admin/dashboard' })
      } else {
        next({ path: '/dashboard' })
      }
      return
    }
  }

  next()
})

export default router
