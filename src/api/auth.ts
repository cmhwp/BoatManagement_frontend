import { http } from '@/utils/request'
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
  ChangePasswordRequest
} from '@/types'

// 用户登录
export const login = (data: LoginRequest) => {
  return http.post<LoginResponse>('/auth/login', data)
}

// 用户注册
export const register = (data: RegisterRequest) => {
  return http.post<User>('/auth/register', data)
}

// 获取当前用户信息
export const getCurrentUser = () => {
  return http.get<User>('/auth/me')
}

// 用户登出
export const logout = () => {
  return http.post('/auth/logout')
}

// 修改密码
export const changePassword = (data: ChangePasswordRequest) => {
  return http.post('/auth/change-password', data)
}
