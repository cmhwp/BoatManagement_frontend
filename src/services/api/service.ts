// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取服务列表 获取服务列表 GET /api/v1/services/ */
export async function getServicesApiV1ServicesGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getServicesApiV1ServicesGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseListServiceListResponse_>('/api/v1/services/', {
    method: 'GET',
    params: {
      // limit has a default value: 20
      limit: '20',
      ...params,
    },
    ...(options || {}),
  })
}

/** 创建服务 创建新服务 POST /api/v1/services/ */
export async function createServiceApiV1ServicesPost(
  body: API.ServiceCreate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseServiceResponse_>('/api/v1/services/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取服务详情 获取服务详细信息 GET /api/v1/services/${param0} */
export async function getServiceDetailApiV1ServicesServiceIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getServiceDetailApiV1ServicesServiceIdGetParams,
  options?: { [key: string]: any }
) {
  const { service_id: param0, ...queryParams } = params
  return request<API.ApiResponseServiceResponse_>(`/api/v1/services/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新服务信息 更新服务信息 PUT /api/v1/services/${param0} */
export async function updateServiceApiV1ServicesServiceIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateServiceApiV1ServicesServiceIdPutParams,
  body: API.ServiceUpdate,
  options?: { [key: string]: any }
) {
  const { service_id: param0, ...queryParams } = params
  return request<API.ApiResponseServiceResponse_>(`/api/v1/services/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 删除服务 删除服务 DELETE /api/v1/services/${param0} */
export async function deleteServiceApiV1ServicesServiceIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteServiceApiV1ServicesServiceIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { service_id: param0, ...queryParams } = params
  return request<API.ApiResponseDict_>(`/api/v1/services/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 获取可用服务 获取可用服务列表 GET /api/v1/services/available */
export async function getAvailableServicesApiV1ServicesAvailableGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAvailableServicesApiV1ServicesAvailableGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseListServiceListResponse_>('/api/v1/services/available', {
    method: 'GET',
    params: {
      // limit has a default value: 20
      limit: '20',
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取我的服务 获取当前商家的服务列表 GET /api/v1/services/my */
export async function getMyServicesApiV1ServicesMyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyServicesApiV1ServicesMyGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseListServiceListResponse_>('/api/v1/services/my', {
    method: 'GET',
    params: {
      // limit has a default value: 20
      limit: '20',
      ...params,
    },
    ...(options || {}),
  })
}
