// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** Upload Avatar 上传用户头像

- 支持格式: jpg, jpeg, png, gif, webp
- 最大文件大小: 10MB
- 自动替换旧头像 POST /api/v1/upload/avatar */
export async function uploadAvatarApiV1UploadAvatarPost(
  body: API.BodyUploadAvatarApiV1UploadAvatarPost,
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ApiResponseDict_>('/api/v1/upload/avatar', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** Upload Boat Images 上传船艇图片（批量）

- 支持多张图片上传
- 用于船艇信息展示 POST /api/v1/upload/boat/images */
export async function uploadBoatImagesApiV1UploadBoatImagesPost(
  body: API.BodyUploadBoatImagesApiV1UploadBoatImagesPost,
  files?: File[],
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (files) {
    files.forEach((f) => formData.append('files', f || ''))
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ApiResponseDict_>('/api/v1/upload/boat/images', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** Delete File 删除指定的文件

- 只能删除自己上传的文件 DELETE /api/v1/upload/file */
export async function deleteFileApiV1UploadFileDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFileApiV1UploadFileDeleteParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/upload/file', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** Get File Info 获取文件信息 GET /api/v1/upload/file/info */
export async function getFileInfoApiV1UploadFileInfoGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFileInfoApiV1UploadFileInfoGetParams,
  options?: { [key: string]: any }
) {
  return request<API.ApiResponseDict_>('/api/v1/upload/file/info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** Upload Identity Back Image 上传身份证背面照片

用于实名认证 POST /api/v1/upload/identity/back */
export async function uploadIdentityBackImageApiV1UploadIdentityBackPost(
  body: API.BodyUploadIdentityBackImageApiV1UploadIdentityBackPost,
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ApiResponseDict_>('/api/v1/upload/identity/back', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** Upload Identity Front Image 上传身份证正面照片

用于实名认证 POST /api/v1/upload/identity/front */
export async function uploadIdentityFrontImageApiV1UploadIdentityFrontPost(
  body: API.BodyUploadIdentityFrontImageApiV1UploadIdentityFrontPost,
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ApiResponseDict_>('/api/v1/upload/identity/front', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** Upload Product Images 上传农产品图片（批量）

- 支持多张图片上传
- 用于农产品信息展示 POST /api/v1/upload/product/images */
export async function uploadProductImagesApiV1UploadProductImagesPost(
  body: API.BodyUploadProductImagesApiV1UploadProductImagesPost,
  files?: File[],
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (files) {
    files.forEach((f) => formData.append('files', f || ''))
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ApiResponseDict_>('/api/v1/upload/product/images', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** Upload Review Images 上传评价图片（批量）

- 支持多张图片上传
- 用于评价展示 POST /api/v1/upload/review/images */
export async function uploadReviewImagesApiV1UploadReviewImagesPost(
  body: API.BodyUploadReviewImagesApiV1UploadReviewImagesPost,
  files?: File[],
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (files) {
    files.forEach((f) => formData.append('files', f || ''))
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ApiResponseDict_>('/api/v1/upload/review/images', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** Upload Service Images 上传服务图片（批量）

- 支持多张图片上传
- 用于服务信息展示 POST /api/v1/upload/service/images */
export async function uploadServiceImagesApiV1UploadServiceImagesPost(
  body: API.BodyUploadServiceImagesApiV1UploadServiceImagesPost,
  files?: File[],
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (files) {
    files.forEach((f) => formData.append('files', f || ''))
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ApiResponseDict_>('/api/v1/upload/service/images', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
