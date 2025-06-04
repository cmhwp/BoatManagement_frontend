// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 用户登录 用户登录接口

- **username**: 用户名、邮箱或手机号
- **password**: 密码

返回访问令牌和用户信息 POST /api/v1/auth/login */
export async function loginApiV1AuthLoginPost(
  body: API.UserLogin,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseToken_>('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户登出 用户登出接口

注意：JWT令牌是无状态的，无法在服务端主动失效。
客户端应该删除本地存储的令牌。 POST /api/v1/auth/logout */
export async function logoutApiV1AuthLogoutPost(options?: { [key: string]: any }) {
  return request<API.MessageResponse>('/api/v1/auth/logout', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 获取当前用户信息 获取当前登录用户的详细信息 GET /api/v1/auth/me */
export async function getCurrentUserInfoApiV1AuthMeGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseUserResponse_>('/api/v1/auth/me', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 用户注册 用户注册接口

- **username**: 用户名（3位以上）
- **email**: 邮箱地址
- **password**: 密码（6位以上）
- **phone**: 手机号（可选）
- **real_name**: 真实姓名（可选）
- **role**: 用户角色，默认为普通用户 POST /api/v1/auth/register */
export async function registerApiV1AuthRegisterPost(
  body: API.UserCreate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseUserResponse_>('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
