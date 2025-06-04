// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** List Merchants 获取商家列表（管理员） GET /api/v1/merchants/ */
export async function listMerchantsApiV1MerchantsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMerchantsApiV1MerchantsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedResponseMerchantListResponse_>('/api/v1/merchants/', {
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

/** Create Merchant Info 创建商家信息 POST /api/v1/merchants/ */
export async function createMerchantInfoApiV1MerchantsPost(
  body: API.MerchantCreate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseMerchantResponse_>('/api/v1/merchants/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get Merchant Detail 获取商家详情 GET /api/v1/merchants/${param0} */
export async function getMerchantDetailApiV1MerchantsMerchantIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantDetailApiV1MerchantsMerchantIdGetParams,
  options?: { [key: string]: any }
) {
  const { merchant_id: param0, ...queryParams } = params
  return request<API.ApiResponseMerchantResponse_>(`/api/v1/merchants/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Merchant Info 更新商家信息（管理员） PUT /api/v1/merchants/${param0} */
export async function updateMerchantInfoApiV1MerchantsMerchantIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateMerchantInfoApiV1MerchantsMerchantIdPutParams,
  body: API.MerchantUpdate,
  options?: { [key: string]: any }
) {
  const { merchant_id: param0, ...queryParams } = params
  return request<API.ApiResponseMerchantResponse_>(`/api/v1/merchants/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Delete Merchant Info 删除商家（管理员） DELETE /api/v1/merchants/${param0} */
export async function deleteMerchantInfoApiV1MerchantsMerchantIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMerchantInfoApiV1MerchantsMerchantIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { merchant_id: param0, ...queryParams } = params
  return request<API.ApiResponseMessageResponse_>(`/api/v1/merchants/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Activate Merchant Account 激活/停用商家（管理员） POST /api/v1/merchants/${param0}/activate */
export async function activateMerchantAccountApiV1MerchantsMerchantIdActivatePost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.activateMerchantAccountApiV1MerchantsMerchantIdActivatePostParams,
  options?: { [key: string]: any }
) {
  const { merchant_id: param0, ...queryParams } = params
  return request<API.ApiResponseMerchantResponse_>(`/api/v1/merchants/${param0}/activate`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** Verify Merchant Info 认证商家（管理员） POST /api/v1/merchants/${param0}/verify */
export async function verifyMerchantInfoApiV1MerchantsMerchantIdVerifyPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.verifyMerchantInfoApiV1MerchantsMerchantIdVerifyPostParams,
  body: API.MerchantVerification,
  options?: { [key: string]: any }
) {
  const { merchant_id: param0, ...queryParams } = params
  return request<API.ApiResponseMerchantResponse_>(`/api/v1/merchants/${param0}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Get My Merchant Info 获取当前用户的商家信息 GET /api/v1/merchants/me */
export async function getMyMerchantInfoApiV1MerchantsMeGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseMerchantResponse_>('/api/v1/merchants/me', {
    method: 'GET',
    ...(options || {}),
  })
}

/** Update My Merchant Info 更新当前用户的商家信息 PUT /api/v1/merchants/me */
export async function updateMyMerchantInfoApiV1MerchantsMePut(
  body: API.MerchantUpdate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseMerchantResponse_>('/api/v1/merchants/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
