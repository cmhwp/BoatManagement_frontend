// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** List Boats 获取船艇列表（管理员） GET /api/v1/boats/ */
export async function listBoatsApiV1BoatsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listBoatsApiV1BoatsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedResponseBoatListResponse_>('/api/v1/boats/', {
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

/** Create Boat Info 创建船艇信息 POST /api/v1/boats/ */
export async function createBoatInfoApiV1BoatsPost(
  body: API.BoatCreate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseBoatResponse_>('/api/v1/boats/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get Boat Detail 获取船艇详情 GET /api/v1/boats/${param0} */
export async function getBoatDetailApiV1BoatsBoatIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBoatDetailApiV1BoatsBoatIdGetParams,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseBoatResponse_>(`/api/v1/boats/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Boat Info 更新船艇信息 PUT /api/v1/boats/${param0} */
export async function updateBoatInfoApiV1BoatsBoatIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBoatInfoApiV1BoatsBoatIdPutParams,
  body: API.BoatUpdate,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseBoatResponse_>(`/api/v1/boats/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Delete Boat Info 删除船艇 DELETE /api/v1/boats/${param0} */
export async function deleteBoatInfoApiV1BoatsBoatIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBoatInfoApiV1BoatsBoatIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseMessageResponse_>(`/api/v1/boats/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Boat Location Info 更新船艇位置 PUT /api/v1/boats/${param0}/location */
export async function updateBoatLocationInfoApiV1BoatsBoatIdLocationPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBoatLocationInfoApiV1BoatsBoatIdLocationPutParams,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseBoatResponse_>(`/api/v1/boats/${param0}/location`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** Update Boat Status Info 更新船艇状态 PUT /api/v1/boats/${param0}/status */
export async function updateBoatStatusInfoApiV1BoatsBoatIdStatusPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBoatStatusInfoApiV1BoatsBoatIdStatusPutParams,
  body: API.BoatStatusUpdate,
  options?: { [key: string]: any }
) {
  const { boat_id: param0, ...queryParams } = params
  return request<API.ApiResponseBoatResponse_>(`/api/v1/boats/${param0}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** List Available Boats 获取可用船艇列表 GET /api/v1/boats/available */
export async function listAvailableBoatsApiV1BoatsAvailableGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listAvailableBoatsApiV1BoatsAvailableGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedResponseBoatListResponse_>('/api/v1/boats/available', {
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

/** List My Boats 获取当前商家的船艇列表 GET /api/v1/boats/my */
export async function listMyBoatsApiV1BoatsMyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMyBoatsApiV1BoatsMyGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedResponseBoatListResponse_>('/api/v1/boats/my', {
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
