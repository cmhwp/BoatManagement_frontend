declare namespace API {
  type activateMerchantAccountApiV1MerchantsMerchantIdActivatePostParams = {
    merchant_id: number
    is_active: boolean
  }

  type ApiResponseBoatResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: BoatResponse | null
  }

  type ApiResponseCrewResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: CrewResponse | null
  }

  type ApiResponseDictStr_Any_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    /** Data */
    data?: Record<string, any> | null
  }

  type ApiResponseMerchantResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: MerchantResponse | null
  }

  type ApiResponseMessageResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: MessageResponse | null
  }

  type ApiResponseToken_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: Token | null
  }

  type ApiResponseUserResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: UserResponse | null
  }

  type BoatCreate = {
    /** Name */
    name: string
    boat_type: BoatType
    /** Registration No */
    registration_no: string
    /** License No */
    license_no?: string | null
    /** Length */
    length?: number | string | null
    /** Width */
    width?: number | string | null
    /** Passenger Capacity */
    passenger_capacity?: number | null
    /** Engine Power */
    engine_power?: string | null
    /** Current Location */
    current_location?: string | null
    /** Safety Equipment */
    safety_equipment?: string | null
    /** Insurance No */
    insurance_no?: string | null
    /** Insurance Expiry */
    insurance_expiry?: string | null
    /** Daily Rate */
    daily_rate?: number | string | null
    /** Hourly Rate */
    hourly_rate?: number | string | null
    /** Description */
    description?: string | null
    /** Images */
    images?: string | null
    /** Merchant Id */
    merchant_id: number
  }

  type BoatListResponse = {
    /** Id */
    id: number
    /** Name */
    name: string
    boat_type: BoatType
    /** Registration No */
    registration_no: string
    /** Passenger Capacity */
    passenger_capacity?: number | null
    status: BoatStatus
    /** Is Available */
    is_available: boolean
    /** Daily Rate */
    daily_rate?: string | null
    /** Current Location */
    current_location?: string | null
  }

  type BoatResponse = {
    /** Name */
    name: string
    boat_type: BoatType
    /** Registration No */
    registration_no: string
    /** License No */
    license_no?: string | null
    /** Length */
    length?: string | null
    /** Width */
    width?: string | null
    /** Passenger Capacity */
    passenger_capacity?: number | null
    /** Engine Power */
    engine_power?: string | null
    /** Current Location */
    current_location?: string | null
    /** Safety Equipment */
    safety_equipment?: string | null
    /** Insurance No */
    insurance_no?: string | null
    /** Insurance Expiry */
    insurance_expiry?: string | null
    /** Daily Rate */
    daily_rate?: string | null
    /** Hourly Rate */
    hourly_rate?: string | null
    /** Description */
    description?: string | null
    /** Images */
    images?: string | null
    /** Id */
    id: number
    /** Merchant Id */
    merchant_id: number
    status: BoatStatus
    /** Is Available */
    is_available: boolean
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type BoatStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service'

  type BoatStatusUpdate = {
    status: BoatStatus
    /** Is Available */
    is_available: boolean
    /** Current Location */
    current_location?: string | null
  }

  type BoatType = 'tourist' | 'fishing' | 'cargo' | 'speedboat'

  type BoatUpdate = {
    /** Name */
    name?: string | null
    boat_type?: BoatType | null
    /** License No */
    license_no?: string | null
    /** Length */
    length?: number | string | null
    /** Width */
    width?: number | string | null
    /** Passenger Capacity */
    passenger_capacity?: number | null
    /** Engine Power */
    engine_power?: string | null
    /** Current Location */
    current_location?: string | null
    /** Safety Equipment */
    safety_equipment?: string | null
    /** Insurance No */
    insurance_no?: string | null
    /** Insurance Expiry */
    insurance_expiry?: string | null
    /** Daily Rate */
    daily_rate?: number | string | null
    /** Hourly Rate */
    hourly_rate?: number | string | null
    /** Description */
    description?: string | null
    /** Images */
    images?: string | null
    status?: BoatStatus | null
    /** Is Available */
    is_available?: boolean | null
  }

  type CrewCreate = {
    /** Id Card No */
    id_card_no: string
    /** License No */
    license_no?: string | null
    /** License Type */
    license_type?: string | null
    /** License Expiry */
    license_expiry?: string | null
    /** Years Of Experience */
    years_of_experience?: number
    /** Specialties */
    specialties?: string | null
    /** Emergency Contact */
    emergency_contact?: string | null
    /** Emergency Phone */
    emergency_phone?: string | null
    /** User Id */
    user_id: number
  }

  type CrewListResponse = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** License No */
    license_no?: string | null
    /** License Type */
    license_type?: string | null
    /** Years Of Experience */
    years_of_experience: number
    /** Is Available */
    is_available: boolean
    /** Current Status */
    current_status: string
    /** Rating */
    rating: number
    /** Total Services */
    total_services: number
  }

  type CrewResponse = {
    /** Id Card No */
    id_card_no: string
    /** License No */
    license_no?: string | null
    /** License Type */
    license_type?: string | null
    /** License Expiry */
    license_expiry?: string | null
    /** Years Of Experience */
    years_of_experience?: number
    /** Specialties */
    specialties?: string | null
    /** Emergency Contact */
    emergency_contact?: string | null
    /** Emergency Phone */
    emergency_phone?: string | null
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Is Available */
    is_available: boolean
    /** Current Status */
    current_status: string
    /** Rating */
    rating: number
    /** Total Services */
    total_services: number
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type CrewStatusUpdate = {
    /** Is Available */
    is_available: boolean
    /** Current Status */
    current_status: string
  }

  type CrewUpdate = {
    /** License No */
    license_no?: string | null
    /** License Type */
    license_type?: string | null
    /** License Expiry */
    license_expiry?: string | null
    /** Years Of Experience */
    years_of_experience?: number | null
    /** Specialties */
    specialties?: string | null
    /** Emergency Contact */
    emergency_contact?: string | null
    /** Emergency Phone */
    emergency_phone?: string | null
    /** Is Available */
    is_available?: boolean | null
    /** Current Status */
    current_status?: string | null
  }

  type deleteBoatInfoApiV1BoatsBoatIdDeleteParams = {
    boat_id: number
  }

  type deleteCrewInfoApiV1CrewsCrewIdDeleteParams = {
    crew_id: number
  }

  type deleteMerchantInfoApiV1MerchantsMerchantIdDeleteParams = {
    merchant_id: number
  }

  type getBoatDetailApiV1BoatsBoatIdGetParams = {
    boat_id: number
  }

  type getCrewDetailApiV1CrewsCrewIdGetParams = {
    crew_id: number
  }

  type getMerchantDetailApiV1MerchantsMerchantIdGetParams = {
    merchant_id: number
  }

  type getUserDetailApiV1AdminUsersUserIdGetParams = {
    user_id: number
  }

  type getUserDetailUsersUserIdGetParams = {
    user_id: number
  }

  type HTTPValidationError = {
    /** Detail */
    detail?: ValidationError[]
  }

  type listAllUsersApiV1AdminUsersGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 用户角色 */
    role?: UserRole | null
    /** 用户状态 */
    status?: UserStatus | null
    /** 是否已验证 */
    is_verified?: boolean | null
    /** 搜索关键词 */
    search?: string | null
  }

  type listAvailableBoatsApiV1BoatsAvailableGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 船艇类型 */
    boat_type?: BoatType | null
    /** 最小载客量 */
    min_capacity?: number | null
    /** 位置 */
    location?: string | null
  }

  type listAvailableCrewsApiV1CrewsAvailableGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 证书类型 */
    license_type?: string | null
  }

  type listBoatsApiV1BoatsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 商家ID */
    merchant_id?: number | null
    /** 船艇类型 */
    boat_type?: BoatType | null
    /** 船艇状态 */
    status?: BoatStatus | null
    /** 是否可用 */
    is_available?: boolean | null
    /** 最小载客量 */
    min_capacity?: number | null
    /** 搜索关键词 */
    search?: string | null
  }

  type listCrewsApiV1CrewsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 是否可用 */
    is_available?: boolean | null
    /** 证书类型 */
    license_type?: string | null
    /** 最少从业年限 */
    min_experience?: number | null
    /** 搜索关键词 */
    search?: string | null
  }

  type listMerchantsApiV1MerchantsGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 是否已认证 */
    is_verified?: boolean | null
    /** 是否活跃 */
    is_active?: boolean | null
    /** 搜索关键词 */
    search?: string | null
  }

  type listMyBoatsApiV1BoatsMyGetParams = {
    /** 页码 */
    page?: number
    /** 每页数量 */
    page_size?: number
    /** 船艇状态 */
    status?: BoatStatus | null
  }

  type MerchantCreate = {
    /** Company Name */
    company_name: string
    /** Business License No */
    business_license_no: string
    /** Legal Representative */
    legal_representative?: string | null
    /** Registration Address */
    registration_address?: string | null
    /** Business Address */
    business_address?: string | null
    /** Contact Person */
    contact_person?: string | null
    /** Contact Phone */
    contact_phone?: string | null
    /** Contact Email */
    contact_email?: string | null
    /** User Id */
    user_id: number
  }

  type MerchantListResponse = {
    /** Id */
    id: number
    /** Company Name */
    company_name: string
    /** Is Verified */
    is_verified: boolean
    /** Rating */
    rating: number
    /** Total Orders */
    total_orders: number
    /** Contact Phone */
    contact_phone?: string | null
  }

  type MerchantResponse = {
    /** Company Name */
    company_name: string
    /** Business License No */
    business_license_no: string
    /** Legal Representative */
    legal_representative?: string | null
    /** Registration Address */
    registration_address?: string | null
    /** Business Address */
    business_address?: string | null
    /** Contact Person */
    contact_person?: string | null
    /** Contact Phone */
    contact_phone?: string | null
    /** Contact Email */
    contact_email?: string | null
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Is Verified */
    is_verified: boolean
    /** Verification Date */
    verification_date?: string | null
    /** Is Active */
    is_active: boolean
    /** Rating */
    rating: number
    /** Total Orders */
    total_orders: number
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type MerchantUpdate = {
    /** Company Name */
    company_name?: string | null
    /** Business License No */
    business_license_no?: string | null
    /** Legal Representative */
    legal_representative?: string | null
    /** Registration Address */
    registration_address?: string | null
    /** Business Address */
    business_address?: string | null
    /** Contact Person */
    contact_person?: string | null
    /** Contact Phone */
    contact_phone?: string | null
    /** Contact Email */
    contact_email?: string | null
  }

  type MerchantVerification = {
    /** Merchant Id */
    merchant_id: number
    /** Is Verified */
    is_verified: boolean
    /** Verification Note */
    verification_note?: string | null
  }

  type MessageResponse = {
    /** Message */
    message: string
  }

  type PaginatedResponseBoatListResponse_ = {
    /** Items */
    items: BoatListResponse[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Pages */
    pages: number
  }

  type PaginatedResponseCrewListResponse_ = {
    /** Items */
    items: CrewListResponse[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Pages */
    pages: number
  }

  type PaginatedResponseMerchantListResponse_ = {
    /** Items */
    items: MerchantListResponse[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Pages */
    pages: number
  }

  type PaginatedResponseUserResponse_ = {
    /** Items */
    items: UserResponse[]
    /** Total */
    total: number
    /** Page */
    page: number
    /** Page Size */
    page_size: number
    /** Pages */
    pages: number
  }

  type Token = {
    /** Access Token */
    access_token: string
    /** Token Type */
    token_type: string
    /** Expires In */
    expires_in: number
    user: UserResponse
  }

  type updateBoatInfoApiV1BoatsBoatIdPutParams = {
    boat_id: number
  }

  type updateBoatLocationInfoApiV1BoatsBoatIdLocationPutParams = {
    boat_id: number
    /** 位置信息 */
    location: string
  }

  type updateBoatStatusInfoApiV1BoatsBoatIdStatusPutParams = {
    boat_id: number
  }

  type updateCrewInfoApiV1CrewsCrewIdPutParams = {
    crew_id: number
  }

  type updateCrewRatingInfoApiV1CrewsCrewIdRatingPutParams = {
    crew_id: number
    /** 评分(0-5) */
    rating: number
  }

  type updateCrewStatusInfoApiV1CrewsCrewIdStatusPutParams = {
    crew_id: number
  }

  type updateMerchantInfoApiV1MerchantsMerchantIdPutParams = {
    merchant_id: number
  }

  type updateUserInfoApiV1AdminUsersUserIdPutParams = {
    user_id: number
  }

  type updateUserInfoUsersUserIdPutParams = {
    user_id: number
  }

  type updateUserRoleApiV1AdminUsersUserIdRolePutParams = {
    user_id: number
    new_role: UserRole
  }

  type updateUserStatusApiV1AdminUsersUserIdStatusPutParams = {
    user_id: number
    new_status: UserStatus
  }

  type UserCreate = {
    /** Username */
    username: string
    /** Email */
    email: string
    /** Phone */
    phone?: string | null
    /** Real Name */
    real_name?: string | null
    /** Gender */
    gender?: string | null
    /** Address */
    address?: string | null
    /** Password */
    password: string
    role?: UserRole
  }

  type UserLogin = {
    /** Username */
    username: string
    /** Password */
    password: string
  }

  type UserResponse = {
    /** Username */
    username: string
    /** Email */
    email: string
    /** Phone */
    phone?: string | null
    /** Real Name */
    real_name?: string | null
    /** Gender */
    gender?: string | null
    /** Address */
    address?: string | null
    /** Id */
    id: number
    role: UserRole
    status: UserStatus
    /** Is Verified */
    is_verified: boolean
    /** Avatar */
    avatar?: string | null
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
    /** Last Login At */
    last_login_at?: string | null
  }

  type UserRole = 'admin' | 'merchant' | 'user' | 'crew'

  type UserStatus = 'active' | 'inactive' | 'suspended' | 'deleted'

  type UserUpdate = {
    /** Username */
    username?: string | null
    /** Email */
    email?: string | null
    /** Phone */
    phone?: string | null
    /** Real Name */
    real_name?: string | null
    /** Gender */
    gender?: string | null
    /** Address */
    address?: string | null
    /** Avatar */
    avatar?: string | null
    role?: UserRole | null
    status?: UserStatus | null
    /** Is Verified */
    is_verified?: boolean | null
  }

  type ValidationError = {
    /** Location */
    loc: (string | number)[]
    /** Message */
    msg: string
    /** Error Type */
    type: string
  }

  type verifyMerchantInfoApiV1MerchantsMerchantIdVerifyPostParams = {
    merchant_id: number
  }

  type verifyUserApiV1AdminUsersUserIdVerifyPutParams = {
    user_id: number
    /** 是否验证 */
    is_verified: boolean
  }
}
