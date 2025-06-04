<template>
  <div class="profile-page">
    <div class="profile-header">
      <h2>个人中心</h2>
      <p>管理您的个人信息和账户设置</p>
    </div>

    <a-row :gutter="[24, 24]">
      <!-- 左侧个人信息 -->
      <a-col :xs="24" :lg="16">
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
                {{ userStore.user?.last_login_at  ? formatDate(userStore.user.last_login_at) : '当前会话' }}
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
  QuestionCircleOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { updateCurrentUserUsersMePut } from '@/services/api/yonghuguanli'

const router = useRouter()
const userStore = useUserStore()

// 加载状态
const updateLoading = ref(false)
const passwordLoading = ref(false)

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

// 初始化表单数据
const initFormData = () => {
  if (userStore.user) {
    profileForm.username = userStore.user.username
    profileForm.email = userStore.user.email
    profileForm.real_name = userStore.user.real_name || ''
    profileForm.phone = userStore.user.phone || ''
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

    const response = await updateCurrentUserUsersMePut(updateData)
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
  message.info('已重置表单')
}

// 修改密码
const handleChangePassword = async () => {
  message.info('修改密码功能暂未实现，请联系管理员')
}

// 处理头像上传
const handleAvatarUpload = () => {
  message.info('头像上传功能开发中...')
}

// 快捷操作
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

// 获取角色颜色
const getRoleColor = (role?:API.UserRole) => {
  if (!role) return 'default'
  const colors = {
    admin: 'red',
    merchant: 'blue',
    user: 'green',
    crew: 'orange'
  }
  return colors[role] || 'default'
}

// 获取角色文本
const getRoleText = (role?: API.UserRole) => {
  if (!role) return '未知'
  const texts = {
    admin: '管理员',
    merchant: '商家',
    user: '普通用户',
    crew: '船员'
  }
  return texts[role] || role
}

// 获取状态颜色
const getStatusColor = (status?: API.UserStatus) => {
  if (!status) return 'default'
  const colors = {
    active: 'green',
    inactive: 'orange',
    suspended: 'red',
    deleted: 'red'
  }
  return colors[status] || 'default'
}

// 获取状态文本
const getStatusText = (status?: API.UserStatus) => {
  if (!status) return '未知'
  const texts = {
    active: '活跃',
    inactive: '未激活',
    suspended: '已暂停',
    deleted: '已删除'
  }
  return texts[status] || status
}

// 格式化日期
const formatDate = (date?: string) => {
  if (!date) return '未知'
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
})
</script>

<style scoped>
.profile-page {
  padding: 24px;
}

.profile-header {
  margin-bottom: 24px;
}

.profile-header h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.profile-header p {
  margin: 0;
  color: #666;
}

.profile-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-info-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.user-avatar-section {
  text-align: center;
  padding: 16px 0;
}

.user-avatar {
  margin-bottom: 16px;
}

.user-info h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.user-stats h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.quick-actions-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.quick-actions-card :deep(.ant-btn) {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
