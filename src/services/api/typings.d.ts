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

  type ApiResponseDict_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    /** Data */
    data?: Record<string, any> | null
  }

  type ApiResponseDictStr_Any_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    /** Data */
    data?: Record<string, any> | null
  }

  type ApiResponseIdentityVerificationResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: IdentityVerificationResponse | null
  }

  type ApiResponseList_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    /** Data */
    data?: any[] | null
  }

  type ApiResponseListOrderListResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    /** Data */
    data?: OrderListResponse[] | null
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

  type ApiResponseOrderResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: OrderResponse | null
  }

  type ApiResponseOrderStats_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: OrderStats | null
  }

  type ApiResponseToken_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: Token | null
  }

  type ApiResponseUnionIdentityVerificationResponse_NoneType_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: IdentityVerificationResponse | null
  }

  type ApiResponseUserResponse_ = {
    /** Success */
    success?: boolean
    /** Message */
    message?: string
    data?: UserResponse | null
  }

  type assignCrewToOrderApiV1OrdersMerchantOrderIdAssignCrewPostParams = {
    order_id: number
  }

  type batchUserOperationApiV1AdminUsersBatchOperationPostParams = {
    /** 用户ID列表 */
    user_ids: number[]
    /** 操作类型: activate, suspend, soft_delete */
    operation: string
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

  type BoatInfo = {
    /** Id */
    id: number
    /** Name */
    name: string
    /** Boat Type */
    boat_type: string
    /** Capacity */
    capacity?: number | null
    /** Status */
    status: string
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

  type BodyUploadAvatarApiV1UploadAvatarPost = {
    /** File 头像文件 */
    file: string
  }

  type BodyUploadBoatImagesApiV1UploadBoatImagesPost = {
    /** Files 船艇图片列表 */
    files: string[]
  }

  type BodyUploadIdentityBackImageApiV1UploadIdentityBackPost = {
    /** File 身份证背面照片 */
    file: string
  }

  type BodyUploadIdentityFrontImageApiV1UploadIdentityFrontPost = {
    /** File 身份证正面照片 */
    file: string
  }

  type BodyUploadProductImagesApiV1UploadProductImagesPost = {
    /** Files 产品图片列表 */
    files: string[]
  }

  type BodyUploadReviewImagesApiV1UploadReviewImagesPost = {
    /** Files 评价图片列表 */
    files: string[]
  }

  type BodyUploadServiceImagesApiV1UploadServiceImagesPost = {
    /** Files 服务图片列表 */
    files: string[]
  }

  type cancelMyOrderApiV1OrdersMyOrderIdCancelPostParams = {
    order_id: number
    reason?: string | null
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

  type CrewInfo = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** License No */
    license_no?: string | null
    /** License Type */
    license_type?: string | null
    /** Rating */
    rating?: string | null
    /** Is Available */
    is_available: boolean
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

  type deleteFileApiV1UploadFileDeleteParams = {
    file_url: string
  }

  type deleteMerchantInfoApiV1MerchantsMerchantIdDeleteParams = {
    merchant_id: number
  }

  type deleteUserByIdApiV1AdminUsersUserIdDeleteParams = {
    user_id: number
  }

  type getAvailableCrewsForOrderApiV1OrdersMerchantOrderIdAvailableCrewsGetParams = {
    order_id: number
  }

  type getBoatDetailApiV1BoatsBoatIdGetParams = {
    boat_id: number
  }

  type getCrewDetailApiV1CrewsCrewIdGetParams = {
    crew_id: number
  }

  type getFileInfoApiV1UploadFileInfoGetParams = {
    file_url: string
  }

  type getIdentityVerificationApiV1IdentityVerificationVerificationIdGetParams = {
    verification_id: number
  }

  type getIdentityVerificationsApiV1IdentityVerificationGetParams = {
    /** 跳过记录数 */
    skip?: number
    /** 每页记录数 */
    limit?: number
    /** 认证状态筛选 */
    status?: VerificationStatus | null
  }

  type getMerchantDetailApiV1MerchantsMerchantIdGetParams = {
    merchant_id: number
  }

  type getMerchantOrdersApiV1OrdersMerchantGetParams = {
    /** 订单状态筛选 */
    status?: OrderStatus | null
    /** 跳过数量 */
    skip?: number
    /** 返回数量 */
    limit?: number
  }

  type getMyCrewOrdersApiV1OrdersCrewMyGetParams = {
    /** 订单状态筛选 */
    status?: OrderStatus | null
    /** 跳过数量 */
    skip?: number
    /** 返回数量 */
    limit?: number
  }

  type getMyOrderDetailApiV1OrdersMyOrderIdGetParams = {
    order_id: number
  }

  type getMyOrdersApiV1OrdersMyGetParams = {
    /** 订单状态筛选 */
    status?: OrderStatus | null
    /** 跳过数量 */
    skip?: number
    /** 返回数量 */
    limit?: number
  }

  type getRecentUserActivitiesApiV1AdminUsersRecentActivitiesGetParams = {
    /** 查询最近天数 */
    days?: number
  }

  type getUserDetailApiV1AdminUsersUserIdGetParams = {
    user_id: number
  }

  type getUserDetailApiV1UsersUserIdGetParams = {
    user_id: number
  }

  type HTTPValidationError = {
    /** Detail */
    detail?: ValidationError[]
  }

  type IdentityType = 'id_card' | 'passport' | 'driver_license' | 'other'

  type IdentityVerificationCreate = {
    /** Real Name 真实姓名 */
    real_name: string
    /** 证件类型 */
    identity_type?: IdentityType
    /** Identity Number 证件号码 */
    identity_number: string
    /** Front Image 证件正面照片URL */
    front_image?: string | null
    /** Back Image 证件背面照片URL */
    back_image?: string | null
  }

  type IdentityVerificationResponse = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Real Name */
    real_name: string
    identity_type: IdentityType
    /** Identity Number */
    identity_number: string
    /** Front Image */
    front_image?: string | null
    /** Back Image */
    back_image?: string | null
    status: VerificationStatus
    /** Reject Reason */
    reject_reason?: string | null
    /** Verified At */
    verified_at?: string | null
    /** Expires At */
    expires_at?: string | null
    /** Reviewer Id */
    reviewer_id?: number | null
    /** Reviewed At */
    reviewed_at?: string | null
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
  }

  type IdentityVerificationReview = {
    /** 审核状态 */
    status: VerificationStatus
    /** Reject Reason 拒绝原因 */
    reject_reason?: string | null
    /** Expires At 认证过期时间 */
    expires_at?: string | null
  }

  type IdentityVerificationSummary = {
    /** Id */
    id: number
    /** User Id */
    user_id: number
    /** Real Name */
    real_name: string
    identity_type: IdentityType
    status: VerificationStatus
    /** Created At */
    created_at: string
    /** Reviewed At */
    reviewed_at?: string | null
  }

  type IdentityVerificationUpdate = {
    /** Real Name 真实姓名 */
    real_name?: string | null
    /** 证件类型 */
    identity_type?: IdentityType | null
    /** Identity Number 证件号码 */
    identity_number?: string | null
    /** Front Image 证件正面照片URL */
    front_image?: string | null
    /** Back Image 证件背面照片URL */
    back_image?: string | null
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

  type MerchantInfo = {
    /** Id */
    id: number
    /** Business Name */
    business_name: string
    /** Contact Name */
    contact_name?: string | null
    /** Contact Phone */
    contact_phone?: string | null
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

  type OrderAssignCrew = {
    /** Crew Id 指派的船员ID */
    crew_id: number
    /** Boat Id 指定的船艇ID */
    boat_id?: number | null
    /** Notes 派单备注 */
    notes?: string | null
  }

  type OrderCreate = {
    /** 订单类型 */
    order_type: OrderType
    /** Service Id 服务ID */
    service_id?: number | null
    /** Product Id 农产品ID */
    product_id?: number | null
    /** Quantity 数量 */
    quantity?: number
    /** Participants 参与人数 */
    participants?: number | null
    /** Scheduled At 预约服务时间 */
    scheduled_at: string
    /** Contact Name 联系人姓名 */
    contact_name?: string | null
    /** Contact Phone 联系电话 */
    contact_phone?: string | null
    /** Special Requirements 特殊需求 */
    special_requirements?: string | null
    /** Notes 备注 */
    notes?: string | null
    /** Coupon Id 使用的优惠券ID */
    coupon_id?: number | null
  }

  type OrderListResponse = {
    /** Id */
    id: number
    /** Order No */
    order_no: string
    order_type: OrderType
    status: OrderStatus
    /** Service Name */
    service_name?: string | null
    /** Total Price */
    total_price: string
    /** Scheduled At */
    scheduled_at: string
    /** Created At */
    created_at: string
    /** User Name */
    user_name?: string | null
    /** Merchant Name */
    merchant_name?: string | null
    /** Crew Name */
    crew_name?: string | null
  }

  type OrderResponse = {
    /** Id */
    id: number
    /** Order No */
    order_no: string
    /** User Id */
    user_id: number
    /** Merchant Id */
    merchant_id: number
    order_type: OrderType
    status: OrderStatus
    /** Service Id */
    service_id?: number | null
    /** Product Id */
    product_id?: number | null
    /** Boat Id */
    boat_id?: number | null
    /** Crew Id */
    crew_id?: number | null
    /** Quantity */
    quantity: number
    /** Unit Price */
    unit_price: string
    /** Subtotal */
    subtotal: string
    /** Discount Amount */
    discount_amount: string
    /** Total Price */
    total_price: string
    /** Scheduled At */
    scheduled_at: string
    /** Service Date */
    service_date?: string | null
    /** Service Time */
    service_time?: string | null
    /** Duration */
    duration?: number | null
    /** Participants */
    participants?: number | null
    /** Contact Name */
    contact_name?: string | null
    /** Contact Phone */
    contact_phone?: string | null
    /** Special Requirements */
    special_requirements?: string | null
    /** Notes */
    notes?: string | null
    /** Coupon Id */
    coupon_id?: number | null
    /** Created At */
    created_at: string
    /** Updated At */
    updated_at: string
    /** Confirmed At */
    confirmed_at?: string | null
    /** Assigned At */
    assigned_at?: string | null
    /** Started At */
    started_at?: string | null
    /** Completed At */
    completed_at?: string | null
    /** Cancelled At */
    cancelled_at?: string | null
    user?: UserInfo | null
    merchant?: MerchantInfo | null
    service?: ServiceInfo | null
    crew?: CrewInfo | null
    boat?: BoatInfo | null
  }

  type OrderStats = {
    /** Total Orders 总订单数 */
    total_orders?: number
    /** Pending Orders 待付款订单数 */
    pending_orders?: number
    /** Paid Orders 已付款订单数 */
    paid_orders?: number
    /** Pending Assignment Orders 待派单订单数 */
    pending_assignment_orders?: number
    /** Confirmed Orders 已确认订单数 */
    confirmed_orders?: number
    /** In Progress Orders 进行中订单数 */
    in_progress_orders?: number
    /** Completed Orders 已完成订单数 */
    completed_orders?: number
    /** Cancelled Orders 已取消订单数 */
    cancelled_orders?: number
    /** Total Revenue 总营收 */
    total_revenue?: string
    /** Today Orders 今日订单数 */
    today_orders?: number
    /** Today Revenue 今日营收 */
    today_revenue?: string
  }

  type OrderStatus =
    | 'pending'
    | 'paid'
    | 'pending_assignment'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'awaiting_review'
    | 'cancelled'
    | 'refunded'

  type OrderStatusUpdate = {
    /** 新状态 */
    status: OrderStatus
    /** Notes 状态变更备注 */
    notes?: string | null
  }

  type OrderType = 'service' | 'product'

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

  type PaginatedResponseIdentityVerificationSummary_ = {
    /** Items */
    items: IdentityVerificationSummary[]
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

  type reviewIdentityVerificationApiV1IdentityVerificationVerificationIdReviewPostParams = {
    verification_id: number
  }

  type ServiceInfo = {
    /** Id */
    id: number
    /** Name */
    name: string
    /** Service Type */
    service_type: string
    /** Base Price */
    base_price: string
    /** Duration */
    duration?: number | null
    /** Max Participants */
    max_participants?: number | null
  }

  type softDeleteUserApiV1AdminUsersUserIdSoftDeletePostParams = {
    user_id: number
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

  type updateCrewOrderStatusApiV1OrdersCrewOrderIdStatusPutParams = {
    order_id: number
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

  type updateMerchantOrderStatusApiV1OrdersMerchantOrderIdStatusPutParams = {
    order_id: number
  }

  type updateUserInfoApiV1AdminUsersUserIdPutParams = {
    user_id: number
  }

  type updateUserInfoApiV1UsersUserIdPutParams = {
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

  type UserInfo = {
    /** Id */
    id: number
    /** Username */
    username: string
    /** Real Name */
    real_name?: string | null
    /** Phone */
    phone?: string | null
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

  type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired'

  type verifyMerchantInfoApiV1MerchantsMerchantIdVerifyPostParams = {
    merchant_id: number
  }

  type verifyUserApiV1AdminUsersUserIdVerifyPutParams = {
    user_id: number
    /** 是否验证 */
    is_verified: boolean
  }
}
