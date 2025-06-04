import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  loginApiV1AuthLoginPost,
  logoutApiV1AuthLogoutPost,
  getCurrentUserInfoApiV1AuthMeGet
} from '@/services/api/renzheng'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<API.UserResponse | null>(null)
  const token = ref<string>(localStorage.getItem('access_token') || '')
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isMerchant = computed(() => userRole.value === 'merchant')
  const isUser = computed(() => userRole.value === 'user')
  const isCrew = computed(() => userRole.value === 'crew')

  // 设置token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('access_token', newToken)
  }

  // 设置用户信息
  const setUser = (userInfo: API.UserResponse) => {
    user.value = userInfo
    localStorage.setItem('user_info', JSON.stringify(userInfo))
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
  }

  // 登录
  const login = async (loginForm: API.UserLogin) => {
    try {
      loading.value = true
      const response = await loginApiV1AuthLoginPost(loginForm)

      if (response.data?.success) {
        const tokenData = response.data.data!
        const { access_token, user: userInfo } = tokenData

        setToken(access_token)
        setUser(userInfo)
        message.success('登录成功')
        return true
      } else {
        message.error(response.data?.message || '登录失败')
        return false
      }
    } catch (error: any) {
      message.error(error.message || '登录失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      await logoutApiV1AuthLogoutPost()
    } catch (error) {
      console.error('登出接口调用失败:', error)
    } finally {
      clearUser()
      message.success('已退出登录')
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      if (!token.value) return false

      const response = await getCurrentUserInfoApiV1AuthMeGet()
      if (response.data?.success) {
        setUser(response.data.data!)
        return true
      } else {
        clearUser()
        return false
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      clearUser()
      return false
    }
  }

  // 初始化用户信息
  const initUserInfo = () => {
    const savedToken = localStorage.getItem('access_token')
    const savedUserInfo = localStorage.getItem('user_info')

    if (savedUserInfo && savedToken) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUserInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        clearUser()
      }
    }
  }

  return {
    // 状态
    user,
    token,
    loading,
    // 计算属性
    isLoggedIn,
    userRole,
    isAdmin,
    isMerchant,
    isUser,
    isCrew,
    // 方法
    login,
    logout,
    setUser,
    clearUser,
    fetchUserInfo,
    initUserInfo
  }
})
