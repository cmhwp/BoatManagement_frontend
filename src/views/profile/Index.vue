<template>
  <div class="profile-page">
    <div class="profile-header">
      <h2>个人中心</h2>
      <p>管理您的个人信息和账户设置</p>
    </div>

    <a-row :gutter="[24, 24]">
      <!-- 左侧内容 -->
      <a-col :xs="24" :lg="16">
        <!-- 基本信息卡片 -->
        <a-card title="基本信息" class="profile-card">
          <a-form
            :model="profileForm"
            :rules="profileRules"
            layout="vertical"
            @finish="handleUpdateProfile"
          >
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="用户名" name="username">
                  <a-input
                    v-model:value="profileForm.username"
                    disabled
                    placeholder="用户名不可修改"
                  />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :sm="12">
                <a-form-item label="邮箱" name="email">
                  <a-input
                    v-model:value="profileForm.email"
                    placeholder="请输入邮箱"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="真实姓名" name="real_name">
                  <a-input
                    v-model:value="profileForm.real_name"
                    placeholder="请输入真实姓名"
                  />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :sm="12">
                <a-form-item label="手机号" name="phone">
                  <a-input
                    v-model:value="profileForm.phone"
                    placeholder="请输入手机号"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item>
              <a-space>
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading="updateLoading"
                >
                  保存修改
                </a-button>
                <a-button @click="handleReset">
                  重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 实名认证卡片 -->
        <a-card title="实名认证" class="profile-card">
          <template #extra>
            <a-tag
              :color="getVerificationStatusColor(verificationInfo?.status)"
              style="margin: 0;"
            >
              {{ getVerificationStatusText(verificationInfo?.status) }}
            </a-tag>
          </template>

          <div v-if="!verificationInfo" class="verification-empty">
            <a-empty
              description="您还未提交实名认证申请"
              :image="$emptyImage"
            >
              <a-button
                type="primary"
                @click="handleStartVerification"
                :loading="verificationLoading"
              >
                <IdcardOutlined />
                开始实名认证
              </a-button>
            </a-empty>
          </div>

          <div v-else class="verification-content">
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="真实姓名">
                {{ verificationInfo.real_name }}
              </a-descriptions-item>
              <a-descriptions-item label="证件类型">
                {{ getIdentityTypeText(verificationInfo.identity_type) }}
              </a-descriptions-item>
              <a-descriptions-item label="证件号码">
                {{ maskIdentityNumber(verificationInfo.identity_number) }}
              </a-descriptions-item>
              <a-descriptions-item label="提交时间">
                {{ formatDate(verificationInfo.created_at) }}
              </a-descriptions-item>
              <a-descriptions-item v-if="verificationInfo.reviewed_at" label="审核时间">
                {{ formatDate(verificationInfo.reviewed_at) }}
              </a-descriptions-item>
              <a-descriptions-item v-if="verificationInfo.verified_at" label="认证时间">
                {{ formatDate(verificationInfo.verified_at) }}
              </a-descriptions-item>
              <a-descriptions-item v-if="verificationInfo.expires_at" label="有效期至">
                {{ formatDate(verificationInfo.expires_at) }}
              </a-descriptions-item>
              <a-descriptions-item v-if="verificationInfo.reject_reason" label="拒绝原因">
                <span style="color: #ff4d4f;">{{ verificationInfo.reject_reason }}</span>
              </a-descriptions-item>
            </a-descriptions>

            <div class="verification-actions" style="margin-top: 16px;">
              <a-space>
                <a-button
                  v-if="verificationInfo.status === 'pending'"
                  @click="handleEditVerification"
                  :loading="verificationLoading"
                >
                  <EditOutlined />
                  修改认证信息
                </a-button>
                <a-button
                  v-if="verificationInfo.status === 'rejected'"
                  type="primary"
                  @click="handleResubmitVerification"
                  :loading="verificationLoading"
                >
                  <ReloadOutlined />
                  重新提交认证
                </a-button>
                <a-button
                  v-if="verificationInfo.status === 'approved'"
                  type="primary"
                  ghost
                  disabled
                >
                  <CheckCircleOutlined />
                  认证已通过
                </a-button>
              </a-space>
            </div>
          </div>
        </a-card>

        <!-- 角色申请卡片 -->
        <a-card title="角色申请" class="profile-card">
          <div class="role-application">
            <a-alert
              message="角色申请说明"
              description="普通用户可以申请成为商家或船员。申请时需要完成实名认证，并提供相关资质证明。"
              type="info"
              show-icon
              style="margin-bottom: 16px;"
            />

            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-card size="small" class="role-card">
                  <div class="role-content">
                    <ShopOutlined class="role-icon" />
                    <h4>商家认证</h4>
                    <p>申请成为船艇服务商家，可以发布船艇信息并接受预订</p>
                    <a-button
                      type="primary"
                      block
                      :disabled="!userStore.user?.is_verified || userStore.user?.role !== 'user'"
                      @click="handleApplyMerchant"
                    >
                      {{ userStore.user?.role === 'merchant' ? '已是商家' : '申请商家认证' }}
                    </a-button>
                  </div>
                </a-card>
              </a-col>

              <a-col :xs="24" :sm="12">
                <a-card size="small" class="role-card">
                  <div class="role-content">
                    <TeamOutlined class="role-icon" />
                    <h4>船员认证</h4>
                    <p>申请成为专业船员，可以为船艇服务提供专业操作</p>
                    <a-button
                      type="primary"
                      block
                      :disabled="!userStore.user?.is_verified || userStore.user?.role !== 'user'"
                      @click="handleApplyCrew"
                    >
                      {{ userStore.user?.role === 'crew' ? '已是船员' : '申请船员认证' }}
                    </a-button>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>
        </a-card>

        <!-- 修改密码 -->
        <a-card title="修改密码" class="profile-card">
          <a-form
            :model="passwordForm"
            :rules="passwordRules"
            layout="vertical"
            @finish="handleChangePassword"
          >
            <a-form-item label="当前密码" name="old_password">
              <a-input-password
                v-model:value="passwordForm.old_password"
                placeholder="请输入当前密码"
              />
            </a-form-item>

            <a-form-item label="新密码" name="new_password">
              <a-input-password
                v-model:value="passwordForm.new_password"
                placeholder="请输入新密码"
              />
            </a-form-item>

            <a-form-item label="确认新密码" name="confirm_password">
              <a-input-password
                v-model:value="passwordForm.confirm_password"
                placeholder="请再次输入新密码"
              />
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                :loading="passwordLoading"
              >
                修改密码
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <!-- 右侧用户信息展示 -->
      <a-col :xs="24" :lg="8">
        <a-card class="user-info-card">
          <div class="user-avatar-section">
            <a-avatar
              :size="80"
              :src="userStore.user?.avatar"
              class="user-avatar"
            >
              {{ userStore.user?.username?.charAt(0).toUpperCase() }}
            </a-avatar>
            <div class="user-info">
              <h3>{{ userStore.user?.real_name || userStore.user?.username }}</h3>
              <a-tag :color="getRoleColor(userStore.user?.role)">
                {{ getRoleText(userStore.user?.role) }}
              </a-tag>
              <div class="verification-badge">
                <a-tag
                  v-if="userStore.user?.is_verified"
                  color="green"
                  style="margin-top: 8px;"
                >
                  <CheckCircleOutlined />
                  已实名认证
                </a-tag>
                <a-tag
                  v-else
                  color="orange"
                  style="margin-top: 8px;"
                >
                  <ExclamationCircleOutlined />
                  未实名认证
                </a-tag>
              </div>
            </div>
            <a-button type="link" size="small" @click="handleAvatarUpload">
              更换头像
            </a-button>
          </div>

          <a-divider />

          <div class="user-stats">
            <h4>账户信息</h4>
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="注册时间">
                {{ formatDate(userStore.user?.created_at) }}
              </a-descriptions-item>
              <a-descriptions-item label="最后登录">
                {{ userStore.user?.last_login_at ? formatDate(userStore.user.last_login_at) : '当前会话' }}
              </a-descriptions-item>
              <a-descriptions-item label="账户状态">
                <a-tag :color="getStatusColor(userStore.user?.status)">
                  {{ getStatusText(userStore.user?.status) }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </a-card>

        <!-- 快捷操作 -->
        <a-card title="快捷操作" class="quick-actions-card">
          <a-space direction="vertical" style="width: 100%">
            <a-button
              v-if="userStore.isMerchant"
              block
              @click="handleGoToMerchant"
            >
              <ShopOutlined />
              商家中心
            </a-button>

            <a-button
              v-if="userStore.isCrew"
              block
              @click="handleGoToCrew"
            >
              <TeamOutlined />
              船员中心
            </a-button>

            <a-button block @click="handleGoToBookings">
              <CalendarOutlined />
              我的预订
            </a-button>

            <a-button block @click="handleGoToHelp">
              <QuestionCircleOutlined />
              帮助中心
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <!-- 实名认证弹窗 -->
    <a-modal
      v-model:open="verificationModalVisible"
      :title="isEditingVerification ? '修改实名认证信息' : '实名认证申请'"
      width="600px"
      @ok="handleVerificationSubmit"
      @cancel="handleVerificationCancel"
      :confirm-loading="verificationLoading"
    >
      <a-form
        :model="verificationForm"
        :rules="verificationRules"
        layout="vertical"
        ref="verificationFormRef"
      >
        <a-form-item label="真实姓名" name="real_name">
          <a-input
            v-model:value="verificationForm.real_name"
            placeholder="请输入真实姓名"
          />
        </a-form-item>

        <a-form-item label="证件类型" name="identity_type">
          <a-select
            v-model:value="verificationForm.identity_type"
            placeholder="请选择证件类型"
          >
            <a-select-option value="id_card">身份证</a-select-option>
            <a-select-option value="passport">护照</a-select-option>
            <a-select-option value="driver_license">驾驶证</a-select-option>
            <a-select-option value="other">其他</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="证件号码" name="identity_number">
          <a-input
            v-model:value="verificationForm.identity_number"
            placeholder="请输入证件号码"
          />
        </a-form-item>

        <a-form-item label="证件正面照" name="front_image">
          <a-upload
            v-model:file-list="frontImageList"
            :before-upload="handleBeforeFrontUpload"
            :custom-request="handleFrontUpload"
            list-type="picture-card"
            :max-count="1"
            accept="image/*"
          >
            <div v-if="frontImageList.length < 1">
              <PlusOutlined />
              <div style="margin-top: 8px">上传正面照</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="证件背面照" name="back_image">
          <a-upload
            v-model:file-list="backImageList"
            :before-upload="handleBeforeBackUpload"
            :custom-request="handleBackUpload"
            list-type="picture-card"
            :max-count="1"
            accept="image/*"
          >
            <div v-if="backImageList.length < 1">
              <PlusOutlined />
              <div style="margin-top: 8px">上传背面照</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ShopOutlined,
  TeamOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  IdcardOutlined,
  EditOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { updateCurrentUserApiV1UsersMePut } from '@/services/api/users'
import {
  getMyIdentityVerificationApiV1IdentityVerificationMeGet,
  createIdentityVerificationApiV1IdentityVerificationPost,
  updateMyIdentityVerificationApiV1IdentityVerificationMePut
} from '@/services/api/identity'
import {
  uploadIdentityFrontImageApiV1UploadIdentityFrontPost,
  uploadIdentityBackImageApiV1UploadIdentityBackPost
} from '@/services/api/upload'

const router = useRouter()
const userStore = useUserStore()

// 加载状态
const updateLoading = ref(false)
const passwordLoading = ref(false)
const verificationLoading = ref(false)
const verificationModalVisible = ref(false)
const isEditingVerification = ref(false)

// 实名认证信息
const verificationInfo = ref<API.IdentityVerificationResponse | null>(null)

// 表单引用
const verificationFormRef = ref()

// 个人信息表单
const profileForm = reactive<API.UserUpdate & { username: string }>({
  username: '',
  email: '',
  real_name: '',
  phone: ''
})

// 密码修改表单
const passwordForm = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

// 实名认证表单
const verificationForm = reactive<API.IdentityVerificationCreate>({
  real_name: '',
  identity_type: 'id_card',
  identity_number: '',
  front_image: '',
  back_image: ''
})

// 图片上传
const frontImageList = ref([])
const backImageList = ref([])
const frontImageUploading = ref(false)
const backImageUploading = ref(false)

// 表单验证规则
const profileRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  real_name: [
    { max: 50, message: '姓名长度不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const passwordRules = {
  old_password: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string) => {
        if (value && value !== passwordForm.new_password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ]
}

const verificationRules = {
  real_name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { max: 50, message: '姓名长度不能超过50个字符', trigger: 'blur' }
  ],
  identity_type: [
    { required: true, message: '请选择证件类型', trigger: 'change' }
  ],
  identity_number: [
    { required: true, message: '请输入证件号码', trigger: 'blur' },
    { max: 30, message: '证件号码长度不能超过30个字符', trigger: 'blur' }
  ]
}

// 初始化表单数据
const initFormData = () => {
  if (userStore.user) {
    profileForm.username = userStore.user.username
    profileForm.email = userStore.user.email
    profileForm.real_name = userStore.user.real_name || ''
    profileForm.phone = userStore.user.phone || ''
  }
}

// 加载实名认证信息
const loadVerificationInfo = async () => {
  try {
    const response = await getMyIdentityVerificationApiV1IdentityVerificationMeGet()
    if (response.data?.success) {
      verificationInfo.value = response.data.data
    }
  } catch (error: any) {
    console.error('加载实名认证信息失败:', error)
  }
}

// 更新个人信息
const handleUpdateProfile = async () => {
  try {
    updateLoading.value = true

    const updateData: API.UserUpdate = {
      email: profileForm.email,
      real_name: profileForm.real_name || undefined,
      phone: profileForm.phone || undefined
    }

    const response = await updateCurrentUserApiV1UsersMePut(updateData)
    if (response.data?.success) {
      userStore.setUser(response.data.data!)
      message.success('个人信息更新成功')
    }
  } catch (error: any) {
    message.error(error.message || '更新失败')
  } finally {
    updateLoading.value = false
  }
}

// 重置表单
const handleReset = () => {
  initFormData()
}

// 修改密码
const handleChangePassword = async () => {
  try {
    passwordLoading.value = true
    // TODO: 实现修改密码接口
    message.success('密码修改成功')

    // 清空表单
    Object.assign(passwordForm, {
      old_password: '',
      new_password: '',
      confirm_password: ''
    })
  } catch (error: any) {
    message.error(error.message || '修改密码失败')
  } finally {
    passwordLoading.value = false
  }
}

// 开始实名认证
const handleStartVerification = () => {
  // 预填充表单
  verificationForm.real_name = userStore.user?.real_name || ''
  isEditingVerification.value = false
  verificationModalVisible.value = true
}

// 编辑实名认证
const handleEditVerification = () => {
  if (verificationInfo.value) {
    Object.assign(verificationForm, {
      real_name: verificationInfo.value.real_name,
      identity_type: verificationInfo.value.identity_type,
      identity_number: verificationInfo.value.identity_number,
      front_image: verificationInfo.value.front_image || '',
      back_image: verificationInfo.value.back_image || ''
    })

    // 设置已上传的图片到文件列表
    frontImageList.value = verificationInfo.value.front_image ? [{
      uid: '-1',
      name: 'front-image.jpg',
      status: 'done',
      url: verificationInfo.value.front_image
    }] : []

    backImageList.value = verificationInfo.value.back_image ? [{
      uid: '-2',
      name: 'back-image.jpg',
      status: 'done',
      url: verificationInfo.value.back_image
    }] : []

    isEditingVerification.value = true
    verificationModalVisible.value = true
  }
}

// 重新提交认证
const handleResubmitVerification = () => {
  handleStartVerification()
}

// 提交实名认证
const handleVerificationSubmit = async () => {
  try {
    await verificationFormRef.value?.validate()
    verificationLoading.value = true

    if (isEditingVerification.value) {
      // 更新实名认证信息
      const response = await updateMyIdentityVerificationApiV1IdentityVerificationMePut(verificationForm)
      if (response.data?.success) {
        message.success('实名认证信息更新成功')
        verificationInfo.value = response.data.data
        verificationModalVisible.value = false
      }
    } else {
      // 创建实名认证申请
      const response = await createIdentityVerificationApiV1IdentityVerificationPost(verificationForm)
      if (response.data?.success) {
        message.success('实名认证申请提交成功，请等待审核')
        verificationInfo.value = response.data.data
        verificationModalVisible.value = false
      }
    }
  } catch (error: any) {
    if (error.errorFields) {
      message.error('请完善表单信息')
    } else {
      message.error(error.message || '提交失败')
    }
  } finally {
    verificationLoading.value = false
  }
}

// 取消实名认证弹窗
const handleVerificationCancel = () => {
  verificationModalVisible.value = false
  // 重置表单
  verificationFormRef.value?.resetFields()
  frontImageList.value = []
  backImageList.value = []
}

// 文件上传前的检查
const handleBeforeFrontUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }

  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('图片大小不能超过10MB!')
    return false
  }

  return true
}

const handleBeforeBackUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }

  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('图片大小不能超过10MB!')
    return false
  }

  return true
}

// 自定义上传逻辑
const handleFrontUpload = async (options: any) => {
  const { file, onSuccess, onError, onProgress } = options

  try {
    frontImageUploading.value = true
    onProgress({ percent: 50 })

    // 直接传递文件对象，不传body参数
    const response = await uploadIdentityFrontImageApiV1UploadIdentityFrontPost(
      {},  // 空的body对象
      file // 实际文件对象
    )
    console.log(response)
    if (response.data?.success && response.data.data?.image_url) {
      verificationForm.front_image = response.data.data.image_url
      message.success('正面照片上传成功')
      onProgress({ percent: 100 })
      onSuccess(response.data.data, file)
    } else {
      throw new Error(response.data?.message || '上传失败')
    }
  } catch (error: any) {
    message.error(error.message || '正面照片上传失败')
    onError(error)
  } finally {
    frontImageUploading.value = false
  }
}

const handleBackUpload = async (options: any) => {
  const { file, onSuccess, onError, onProgress } = options

  try {
    backImageUploading.value = true
    onProgress({ percent: 50 })

    // 直接传递文件对象，不传body参数
    const response = await uploadIdentityBackImageApiV1UploadIdentityBackPost(
      {},  // 空的body对象
      file // 实际文件对象
    )

    if (response.data?.success && response.data.data?.image_url) {
      verificationForm.back_image = response.data.data.image_url
      message.success('背面照片上传成功')
      onProgress({ percent: 100 })
      onSuccess(response.data.data, file)
    } else {
      throw new Error(response.data?.message || '上传失败')
    }
  } catch (error: any) {
    message.error(error.message || '背面照片上传失败')
    onError(error)
  } finally {
    backImageUploading.value = false
  }
}

// 申请商家角色
const handleApplyMerchant = () => {
  router.push('/merchant/apply')
}

// 申请船员角色
const handleApplyCrew = () => {
  router.push('/crew/apply')
}

// 其他操作
const handleAvatarUpload = () => {
  message.info('头像上传功能开发中...')
}

const handleGoToMerchant = () => {
  router.push('/merchant')
}

const handleGoToCrew = () => {
  router.push('/crew')
}

const handleGoToBookings = () => {
  router.push('/bookings')
}

const handleGoToHelp = () => {
  router.push('/help')
}

// 工具函数
const getRoleColor = (role: API.UserRole) => {
  const colors = {
    admin: 'red',
    merchant: 'blue',
    user: 'green',
    crew: 'orange'
  }
  return colors[role] || 'default'
}

const getRoleText = (role: API.UserRole) => {
  const texts = {
    admin: '管理员',
    merchant: '商家',
    user: '普通用户',
    crew: '船员'
  }
  return texts[role] || role
}

const getStatusColor = (status: API.UserStatus) => {
  const colors = {
    active: 'green',
    inactive: 'orange',
    suspended: 'red',
    deleted: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: API.UserStatus) => {
  const texts = {
    active: '活跃',
    inactive: '未激活',
    suspended: '已暂停',
    deleted: '已删除'
  }
  return texts[status] || status
}

const getVerificationStatusColor = (status?: string) => {
  const colors = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
    expired: 'gray'
  }
  return colors[status || ''] || 'default'
}

const getVerificationStatusText = (status?: string) => {
  const texts = {
    pending: '审核中',
    approved: '已认证',
    rejected: '已拒绝',
    expired: '已过期'
  }
  return texts[status || ''] || '未认证'
}

const getIdentityTypeText = (type?: string) => {
  const texts = {
    id_card: '身份证',
    passport: '护照',
    driver_license: '驾驶证',
    other: '其他'
  }
  return texts[type || ''] || type
}

const maskIdentityNumber = (number?: string) => {
  if (!number) return ''
  if (number.length <= 6) return number
  return number.substring(0, 3) + '****' + number.substring(number.length - 3)
}

const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  initFormData()
  loadVerificationInfo()
})
</script>

<style scoped>
.profile-page {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.profile-header {
  margin-bottom: 24px;
  text-align: center;
}

.profile-header h2 {
  margin: 0 0 8px 0;
  color: #262626;
  font-size: 28px;
  font-weight: 600;
}

.profile-header p {
  margin: 0;
  color: #8c8c8c;
  font-size: 16px;
}

.profile-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.quick-actions-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar-section {
  text-align: center;
  padding: 16px 0;
}

.user-avatar {
  margin-bottom: 16px;
}

.user-info {
  margin-bottom: 16px;
}

.user-info h3 {
  margin: 0 0 8px 0;
  color: #262626;
  font-size: 18px;
  font-weight: 500;
}

.verification-badge {
  margin-top: 8px;
}

.verification-empty {
  padding: 40px 0;
  text-align: center;
}

.verification-content {
  padding: 16px 0;
}

.verification-actions {
  text-align: center;
}

.role-application {
  padding: 16px 0;
}

.role-card {
  height: 180px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.role-content {
  text-align: center;
  padding: 16px;
}

.role-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 12px;
  display: block;
}

.role-content h4 {
  margin: 0 0 8px 0;
  color: #262626;
  font-size: 16px;
  font-weight: 600;
}

.role-content p {
  margin: 0 0 16px 0;
  color: #8c8c8c;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }

  .profile-header h2 {
    font-size: 24px;
  }

  .role-card {
    margin-bottom: 16px;
  }
}
</style>
