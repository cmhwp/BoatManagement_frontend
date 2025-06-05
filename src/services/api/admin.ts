// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** Get Admin Dashboard 获取管理员仪表板数据 GET /api/v1/admin/dashboard */
export async function getAdminDashboardApiV1AdminDashboardGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseDictStr_Any_>('/api/v1/admin/dashboard', {
    method: 'GET',
    ...(options || {}),
  })
}

/** Get System Stats 获取系统统计信息（管理员） GET /api/v1/admin/system/stats */
export async function getSystemStatsApiV1AdminSystemStatsGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseDictStr_Any_>('/api/v1/admin/system/stats', {
    method: 'GET',
    ...(options || {}),
  })
}

/** List All Users 获取所有用户列表（管理员） GET /api/v1/admin/users */
export async function listAllUsersApiV1AdminUsersGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listAllUsersApiV1AdminUsersGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedResponseUserResponse_>('/api/v1/admin/users', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 20
      page_size: '20',

      ...params,
    },
    ...(options || {}),
  })
}

/** Create New User 创建新用户（管理员） POST /api/v1/admin/users */
export async function createNewUserApiV1AdminUsersPost(
  body: API.UserCreate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseUserResponse_>('/api/v1/admin/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get User Detail 获取用户详情（管理员） GET /api/v1/admin/users/${param0} */
export async function getUserDetailApiV1AdminUsersUserIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserDetailApiV1AdminUsersUserIdGetParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponse_>(`/api/v1/admin/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update User Info 更新用户信息（管理员） PUT /api/v1/admin/users/${param0} */
export async function updateUserInfoApiV1AdminUsersUserIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserInfoApiV1AdminUsersUserIdPutParams,
  body: API.UserUpdate,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponse_>(`/api/v1/admin/users/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Delete User By Id 删除用户（管理员） DELETE /api/v1/admin/users/${param0} */
export async function deleteUserByIdApiV1AdminUsersUserIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserByIdApiV1AdminUsersUserIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseDict_>(`/api/v1/admin/users/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update User Role 更新用户角色（管理员） PUT /api/v1/admin/users/${param0}/role */
export async function updateUserRoleApiV1AdminUsersUserIdRolePut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserRoleApiV1AdminUsersUserIdRolePutParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponse_>(`/api/v1/admin/users/${param0}/role`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** Soft Delete User 软删除用户（将状态设置为已删除）（管理员） POST /api/v1/admin/users/${param0}/soft-delete */
export async function softDeleteUserApiV1AdminUsersUserIdSoftDeletePost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.softDeleteUserApiV1AdminUsersUserIdSoftDeletePostParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponse_>(`/api/v1/admin/users/${param0}/soft-delete`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update User Status 更新用户状态（管理员） PUT /api/v1/admin/users/${param0}/status */
export async function updateUserStatusApiV1AdminUsersUserIdStatusPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserStatusApiV1AdminUsersUserIdStatusPutParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponse_>(`/api/v1/admin/users/${param0}/status`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** Verify User 验证用户（管理员） PUT /api/v1/admin/users/${param0}/verify */
export async function verifyUserApiV1AdminUsersUserIdVerifyPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.verifyUserApiV1AdminUsersUserIdVerifyPutParams,
  options?: { [key: string]: any }
) {
  const { user_id: param0, ...queryParams } = params
  return request<API.ApiResponseUserResponse_>(`/api/v1/admin/users/${param0}/verify`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** Batch User Operation 批量用户操作（管理员） POST /api/v1/admin/users/batch-operation */
export async function batchUserOperationApiV1AdminUsersBatchOperationPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.batchUserOperationApiV1AdminUsersBatchOperationPostParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/admin/users/batch-operation', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** Get Recent User Activities 获取最近用户活动统计（管理员） GET /api/v1/admin/users/recent-activities */
export async function getRecentUserActivitiesApiV1AdminUsersRecentActivitiesGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRecentUserActivitiesApiV1AdminUsersRecentActivitiesGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDictStr_Any_>('/api/v1/admin/users/recent-activities', {
    method: 'GET',
    params: {
      // days has a default value: 7
      days: '7',
      ...params,
    },
    ...(options || {}),
  })
}

/** Get User Status Summary 获取用户状态汇总（管理员） GET /api/v1/admin/users/status-summary */
export async function getUserStatusSummaryApiV1AdminUsersStatusSummaryGet(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponseDictStr_Any_>('/api/v1/admin/users/status-summary', {
    method: 'GET',
    ...(options || {}),
  })
}
