// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** List Crews 获取船员列表（管理员） GET /api/v1/crews/ */
export async function listCrewsApiV1CrewsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listCrewsApiV1CrewsGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedResponseCrewListResponse_>('/api/v1/crews/', {
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

/** Create Crew Info 创建船员信息 POST /api/v1/crews/ */
export async function createCrewInfoApiV1CrewsPost(
  body: API.CrewCreate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseCrewResponse_>('/api/v1/crews/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** Get Crew Detail 获取船员详情 GET /api/v1/crews/${param0} */
export async function getCrewDetailApiV1CrewsCrewIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCrewDetailApiV1CrewsCrewIdGetParams,
  options?: { [key: string]: any }
) {
  const { crew_id: param0, ...queryParams } = params
  return request<API.ApiResponseCrewResponse_>(`/api/v1/crews/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Crew Info 更新船员信息（管理员） PUT /api/v1/crews/${param0} */
export async function updateCrewInfoApiV1CrewsCrewIdPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCrewInfoApiV1CrewsCrewIdPutParams,
  body: API.CrewUpdate,
  options?: { [key: string]: any }
) {
  const { crew_id: param0, ...queryParams } = params
  return request<API.ApiResponseCrewResponse_>(`/api/v1/crews/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** Delete Crew Info 删除船员（管理员） DELETE /api/v1/crews/${param0} */
export async function deleteCrewInfoApiV1CrewsCrewIdDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCrewInfoApiV1CrewsCrewIdDeleteParams,
  options?: { [key: string]: any }
) {
  const { crew_id: param0, ...queryParams } = params
  return request<API.ApiResponseMessageResponse_>(`/api/v1/crews/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** Update Crew Rating Info 更新船员评分 PUT /api/v1/crews/${param0}/rating */
export async function updateCrewRatingInfoApiV1CrewsCrewIdRatingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCrewRatingInfoApiV1CrewsCrewIdRatingPutParams,
  options?: { [key: string]: any }
) {
  const { crew_id: param0, ...queryParams } = params
  return request<API.ApiResponseCrewResponse_>(`/api/v1/crews/${param0}/rating`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** Update Crew Status Info 更新船员状态 PUT /api/v1/crews/${param0}/status */
export async function updateCrewStatusInfoApiV1CrewsCrewIdStatusPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCrewStatusInfoApiV1CrewsCrewIdStatusPutParams,
  body: API.CrewStatusUpdate,
  options?: { [key: string]: any }
) {
  const { crew_id: param0, ...queryParams } = params
  return request<API.ApiResponseCrewResponse_>(`/api/v1/crews/${param0}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** List Available Crews 获取可用船员列表 GET /api/v1/crews/available */
export async function listAvailableCrewsApiV1CrewsAvailableGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listAvailableCrewsApiV1CrewsAvailableGetParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedResponseCrewListResponse_>('/api/v1/crews/available', {
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

/** Get My Crew Info 获取当前用户的船员信息 GET /api/v1/crews/me */
export async function getMyCrewInfoApiV1CrewsMeGet(options?: { [key: string]: any }) {
  return request<API.ApiResponseCrewResponse_>('/api/v1/crews/me', {
    method: 'GET',
    ...(options || {}),
  })
}

/** Update My Crew Info 更新当前用户的船员信息 PUT /api/v1/crews/me */
export async function updateMyCrewInfoApiV1CrewsMePut(
  body: API.CrewUpdate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseCrewResponse_>('/api/v1/crews/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
