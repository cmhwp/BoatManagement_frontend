// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取用户详情 获取指定用户的详细信息

权限要求：管理员或商家 GET /api/v1/users/${param0} */
export async function getUserDetailApiV1UsersUserIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserDetailApiV1UsersUserIdGetParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponse_>(`/api/v1/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新用户信息 更新指定用户的信息

权限要求：管理员 PUT /api/v1/users/${param0} */
export async function updateUserInfoApiV1UsersUserIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserInfoApiV1UsersUserIdPutParams,
  body: API.UserUpdate,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponse_>(`/api/v1/users/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 更新当前用户信息 更新当前登录用户的信息

- **username**: 用户名
- **email**: 邮箱地址
- **phone**: 手机号
- **real_name**: 真实姓名
- **gender**: 性别
- **address**: 地址
- **avatar**: 头像URL PUT /api/v1/users/me */
export async function updateCurrentUserApiV1UsersMePut(
  body: API.UserUpdate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseUserResponse_>('/api/v1/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
