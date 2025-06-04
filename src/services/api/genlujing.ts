// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** Root 根路径欢迎信息 GET / */
export async function rootGet(options?: { [key: string]: any }) {
  return request<any>('/', {
    method: 'GET',
    ...(options || {}),
  })
}
