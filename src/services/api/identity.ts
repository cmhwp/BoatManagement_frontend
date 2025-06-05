// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** Get Identity Verifications 获取实名认证列表（管理员）

管理员可以查看所有用户的实名认证申请 GET /api/v1/identity-verification/ */
export async function getIdentityVerificationsApiV1IdentityVerificationGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getIdentityVerificationsApiV1IdentityVerificationGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedResponseIdentityVerificationSummary_>(
    '/api/v1/identity-verification/',
    {
      method: 'GET',
      params: {
        // limit has a default value: 10
        limit: '10',
        ...params,
      },
      ...(options || {}),
    }
  )
}

/** Create Identity Verification 提交实名认证申请

用户提交实名认证信息，等待管理员审核 POST /api/v1/identity-verification/ */
export async function createIdentityVerificationApiV1IdentityVerificationPost(
  body: API.IdentityVerificationCreate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseIdentityVerificationResponse_>('/api/v1/identity-verification/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get Identity Verification 获取实名认证详情（管理员） GET /api/v1/identity-verification/${param0} */
export async function getIdentityVerificationApiV1IdentityVerificationVerificationIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getIdentityVerificationApiV1IdentityVerificationVerificationIdGetParams,
  options?: { [key: string]: any }
) {
  const { verification_id: param0, ...queryParams } = params
  return request<API.ApiResponseIdentityVerificationResponse_>(
    `/api/v1/identity-verification/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  )
}

/** Review Identity Verification 审核实名认证（管理员）

管理员可以通过或拒绝用户的实名认证申请 POST /api/v1/identity-verification/${param0}/review */
export async function reviewIdentityVerificationApiV1IdentityVerificationVerificationIdReviewPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.reviewIdentityVerificationApiV1IdentityVerificationVerificationIdReviewPostParams,
  body: API.IdentityVerificationReview,
  options?: { [key: string]: any }
) {
  const { verification_id: param0, ...queryParams } = params
  return request<API.ApiResponseIdentityVerificationResponse_>(
    `/api/v1/identity-verification/${param0}/review`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  )
}

/** Check Expired Verifications 检查并处理过期的实名认证（管理员） POST /api/v1/identity-verification/check-expired */
export async function checkExpiredVerificationsApiV1IdentityVerificationCheckExpiredPost(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponseDict_>('/api/v1/identity-verification/check-expired', {
    method: 'POST',
    ...(options || {}),
  })
}

/** Get My Identity Verification 获取我的实名认证信息 GET /api/v1/identity-verification/me */
export async function getMyIdentityVerificationApiV1IdentityVerificationMeGet(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponseUnionIdentityVerificationResponse_NoneType_>(
    '/api/v1/identity-verification/me',
    {
      method: 'GET',
      ...(options || {}),
    }
  )
}

/** Update My Identity Verification 更新我的实名认证信息

只能更新待审核状态的实名认证 PUT /api/v1/identity-verification/me */
export async function updateMyIdentityVerificationApiV1IdentityVerificationMePut(
  body: API.IdentityVerificationUpdate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseIdentityVerificationResponse_>('/api/v1/identity-verification/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get Verification Statistics 获取实名认证统计信息（管理员） GET /api/v1/identity-verification/statistics/overview */
export async function getVerificationStatisticsApiV1IdentityVerificationStatisticsOverviewGet(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponseDict_>('/api/v1/identity-verification/statistics/overview', {
    method: 'GET',
    ...(options || {}),
  })
}
