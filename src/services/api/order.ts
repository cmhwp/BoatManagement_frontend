// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 创建订单 创建新的预约订单

- **order_type**: 订单类型（service/product）
- **service_id**: 服务ID（服务订单必需）
- **scheduled_at**: 预约服务时间
- **participants**: 参与人数
- **contact_name**: 联系人姓名
- **contact_phone**: 联系电话 POST /api/v1/orders/ */
export async function createOrderApiV1OrdersPost(
  body: API.OrderCreate,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseOrderResponse_>('/api/v1/orders/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 船员更新订单状态 船员更新订单状态（如确认接单、开始服务等） PUT /api/v1/orders/crew/${param0}/status */
export async function updateCrewOrderStatusApiV1OrdersCrewOrderIdStatusPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCrewOrderStatusApiV1OrdersCrewOrderIdStatusPutParams,
  body: API.OrderStatusUpdate,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponse_>(`/api/v1/orders/crew/${param0}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 获取我的船员订单 获取分配给当前船员的订单 GET /api/v1/orders/crew/my */
export async function getMyCrewOrdersApiV1OrdersCrewMyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyCrewOrdersApiV1OrdersCrewMyGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseListOrderListResponse_>('/api/v1/orders/crew/my', {
    method: 'GET',
    params: {
      // limit has a default value: 20
      limit: '20',
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取商家订单 获取商家的所有订单 GET /api/v1/orders/merchant */
export async function getMerchantOrdersApiV1OrdersMerchantGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantOrdersApiV1OrdersMerchantGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseListOrderListResponse_>('/api/v1/orders/merchant', {
    method: 'GET',
    params: {
      // limit has a default value: 20
      limit: '20',
      ...params,
    },
    ...(options || {}),
  })
}

/** 派单给船员 为订单指派船员（核心派单功能）

- **crew_id**: 指派的船员ID
- **boat_id**: 指定的船艇ID（可选）
- **notes**: 派单备注 POST /api/v1/orders/merchant/${param0}/assign-crew */
export async function assignCrewToOrderApiV1OrdersMerchantOrderIdAssignCrewPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.assignCrewToOrderApiV1OrdersMerchantOrderIdAssignCrewPostParams,
  body: API.OrderAssignCrew,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponse_>(`/api/v1/orders/merchant/${param0}/assign-crew`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 获取可派单船员 获取订单可用的船员列表 GET /api/v1/orders/merchant/${param0}/available-crews */
export async function getAvailableCrewsForOrderApiV1OrdersMerchantOrderIdAvailableCrewsGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAvailableCrewsForOrderApiV1OrdersMerchantOrderIdAvailableCrewsGetParams,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseList_>(`/api/v1/orders/merchant/${param0}/available-crews`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 更新订单状态 商家更新订单状态 PUT /api/v1/orders/merchant/${param0}/status */
export async function updateMerchantOrderStatusApiV1OrdersMerchantOrderIdStatusPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateMerchantOrderStatusApiV1OrdersMerchantOrderIdStatusPutParams,
  body: API.OrderStatusUpdate,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponse_>(`/api/v1/orders/merchant/${param0}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 商家订单统计 获取商家订单统计数据 GET /api/v1/orders/merchant/stats */
export async function getMerchantOrderStatsApiV1OrdersMerchantStatsGet(options?: {
  [key: string]: any
}) {
  return request<API.ApiResponseOrderStats_>('/api/v1/orders/merchant/stats', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取我的订单 获取当前用户的所有订单 GET /api/v1/orders/my */
export async function getMyOrdersApiV1OrdersMyGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyOrdersApiV1OrdersMyGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseListOrderListResponse_>('/api/v1/orders/my', {
    method: 'GET',
    params: {
      // limit has a default value: 20
      limit: '20',
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取订单详情 获取订单详细信息 GET /api/v1/orders/my/${param0} */
export async function getMyOrderDetailApiV1OrdersMyOrderIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyOrderDetailApiV1OrdersMyOrderIdGetParams,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponse_>(`/api/v1/orders/my/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 取消订单 取消订单 POST /api/v1/orders/my/${param0}/cancel */
export async function cancelMyOrderApiV1OrdersMyOrderIdCancelPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.cancelMyOrderApiV1OrdersMyOrderIdCancelPostParams,
  options?: { [key: string]: any }
) {
  const { order_id: param0, ...queryParams } = params
  return request<API.ApiResponseOrderResponse_>(`/api/v1/orders/my/${param0}/cancel`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
