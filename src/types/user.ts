// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  USER = 'user',
  CREW = 'crew'
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// 基础用户信息
export interface User {
  id: number
  username: string
  email: string
  real_name?: string
  phone?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
  last_login?: string
}

// 登录请求参数
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求参数
export interface RegisterRequest {
  username: string
  email: string
  password: string
  real_name?: string
  phone?: string
  role?: UserRole
}

// 登录响应
export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// 更新用户信息请求
export interface UpdateUserRequest {
  full_name?: string
  phone?: string
  avatar?: string
  email?: string
}

// 修改密码请求
export interface ChangePasswordRequest {
  old_password: string
  new_password: string
  confirm_password: string
}
