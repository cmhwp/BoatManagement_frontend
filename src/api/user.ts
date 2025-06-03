import { http } from '@/utils/request'
import type {
  User,
  UpdateUserRequest,
  PaginatedResponse,
  PaginationQuery
} from '@/types'

// 更新个人信息
export const updateProfile = (data: UpdateUserRequest) => {
  return http.put<User>('/users/me', data)
}

// 获取用户详情
export const getUserById = (userId: number) => {
  return http.get<User>(`/users/${userId}`)
}

// 更新用户信息(管理员)
export const updateUser = (userId: number, data: UpdateUserRequest) => {
  return http.put<User>(`/users/${userId}`, data)
}

// 获取用户列表(管理员)
export const getUserList = (params?: PaginationQuery & { search?: string }) => {
  return http.get<PaginatedResponse<User>>('/users', { params })
}
