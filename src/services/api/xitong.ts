// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** Api Info API信息接口 GET /api/info */
export async function apiInfoApiInfoGet(options?: { [key: string]: any }) {
  return request<any>('/api/info', {
    method: 'GET',
    ...(options || {}),
  })
}

/** Health Check 健康检查接口 GET /health */
export async function healthCheckHealthGet(options?: { [key: string]: any }) {
  return request<any>('/health', {
    method: 'GET',
    ...(options || {}),
  })
}
