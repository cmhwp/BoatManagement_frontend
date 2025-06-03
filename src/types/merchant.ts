// 商家状态枚举
export enum MerchantStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// 商家信息
export interface Merchant {
  id: number
  user_id: number
  business_name: string
  business_license: string
  contact_person: string
  contact_phone: string
  address: string
  description?: string
  logo?: string
  status: MerchantStatus
  is_verified: boolean
  rating: number
  created_at: string
  updated_at: string
}

// 创建商家请求
export interface CreateMerchantRequest {
  business_name: string
  business_license: string
  contact_person: string
  contact_phone: string
  address: string
  description?: string
  logo?: string
}

// 更新商家请求
export interface UpdateMerchantRequest {
  business_name?: string
  business_license?: string
  contact_person?: string
  contact_phone?: string
  address?: string
  description?: string
  logo?: string
}

// 商家查询参数
export interface MerchantQuery {
  page?: number
  size?: number
  status?: MerchantStatus
  is_verified?: boolean
  search?: string
}
