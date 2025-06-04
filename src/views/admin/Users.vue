<template>
  <div class="admin-users">
    <AdminTable
      title="用户管理"
      subtitle="管理平台所有用户账户"
      :columns="columns"
      :search-config="searchConfig"
      :action-config="actionConfig"
      :detail-config="detailConfig"
      :api-config="apiConfig"
      @edit="handleEdit"
      @menu-action="handleMenuAction"
    >
      <!-- 自定义列渲染 -->
      <template #bodyCell="{ column, record }">
        <!-- 用户信息 -->
        <template v-if="column.key === 'user'">
          <div class="user-info">
            <a-avatar size="small" :src="record.avatar">
              {{ record.username.charAt(0).toUpperCase() }}
            </a-avatar>
            <div class="user-details">
              <div class="username">{{ record.username }}</div>
              <div class="email">{{ record.email }}</div>
            </div>
          </div>
        </template>

        <!-- 角色标签 -->
        <template v-else-if="column.key === 'role'">
          <a-tag :color="getRoleColor(record.role)">
            {{ getRoleText(record.role) }}
          </a-tag>
        </template>

        <!-- 状态标签 -->
        <template v-else-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>

        <!-- 最后登录时间 -->
        <template v-else-if="column.key === 'last_login'">
          <span v-if="record.last_login_at">
            {{ formatDate(record.last_login_at) }}
          </span>
          <span v-else class="text-muted">从未登录</span>
        </template>

        <!-- 注册时间 -->
        <template v-else-if="column.key === 'created_at'">
          {{ formatDate(record.created_at) }}
        </template>
      </template>

      <!-- 自定义详情页面 -->
      <template #detail="{ record }">
        <div v-if="record" class="user-detail">
          <div class="detail-section">
            <h4>基本信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="用户名">
                {{ record.username }}
              </a-descriptions-item>
              <a-descriptions-item label="邮箱">
                {{ record.email }}
              </a-descriptions-item>
              <a-descriptions-item label="真实姓名">
                {{ record.real_name || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="手机号">
                {{ record.phone || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="角色">
                <a-tag :color="getRoleColor(record.role)">
                  {{ getRoleText(record.role) }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusText(record.status) }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="注册时间">
                {{ formatDate(record.created_at) }}
              </a-descriptions-item>
              <a-descriptions-item label="最后登录">
                {{ record.last_login_at ? formatDate(record.last_login_at) : '从未登录' }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </template>
    </AdminTable>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import AdminTable from '@/components/AdminTable.vue'
import { listAllUsersApiV1AdminUsersGet } from '@/services/api/admin'

// 表格列配置
const columns = [
  {
    title: '用户',
    key: 'user',
    width: 200
  },
  {
    title: '真实姓名',
    dataIndex: 'real_name',
    key: 'real_name',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 120
  },
  {
    title: '角色',
    key: 'role',
    width: 100
  },
  {
    title: '状态',
    key: 'status',
    width: 100
  },
  {
    title: '最后登录',
    key: 'last_login',
    width: 150
  },
  {
    title: '注册时间',
    key: 'created_at',
    width: 150
  }
]

// 搜索配置
const searchConfig = {
  placeholder: '搜索用户名、邮箱或姓名',
  filters: [
    {
      key: 'role',
      placeholder: '选择角色',
      options: [
        { label: '全部角色', value: '' },
        { label: '管理员', value: 'admin' },
        { label: '商家', value: 'merchant' },
        { label: '普通用户', value: 'user' },
        { label: '船员', value: 'crew' }
      ]
    },
    {
      key: 'status',
      placeholder: '选择状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '活跃', value: 'active' },
        { label: '未激活', value: 'inactive' },
        { label: '已暂停', value: 'suspended' }
      ]
    }
  ]
}

// 操作配置
const actionConfig = {
  moreActions: [
    { key: 'resetPassword', label: '重置密码' },
    { key: 'suspend', label: '暂停账户' },
    { key: 'activate', label: '激活账户' }
  ]
}

// 详情配置
const detailConfig = {
  title: '用户详情',
  width: 480,
  fields: []
}

// API配置
const apiConfig = {
  list: listAllUsersApiV1AdminUsersGet,
  listParams: (searchForm: any, pagination: any) => ({
    page: pagination.current,
    page_size: pagination.pageSize,
    search: searchForm.search || undefined,
    role: searchForm.role as API.UserRole || undefined,
    status: searchForm.status as API.UserStatus || undefined
  })
}

// 处理编辑用户
const handleEdit = (user: API.UserResponse) => {
  message.info('编辑功能开发中...')
}

// 处理菜单操作
const handleMenuAction = (key: string, user: API.UserResponse) => {
  switch (key) {
    case 'resetPassword':
      message.info('重置密码功能开发中...')
      break
    case 'suspend':
      message.info('暂停账户功能开发中...')
      break
    case 'activate':
      message.info('激活账户功能开发中...')
      break
  }
}

// 获取角色颜色
const getRoleColor = (role: API.UserRole) => {
  const colors = {
    admin: 'red',
    merchant: 'blue',
    user: 'green',
    crew: 'orange'
  }
  return colors[role] || 'default'
}

// 获取角色文本
const getRoleText = (role: API.UserRole) => {
  const texts = {
    admin: '管理员',
    merchant: '商家',
    user: '普通用户',
    crew: '船员'
  }
  return texts[role] || role
}

// 获取状态颜色
const getStatusColor = (status: API.UserStatus) => {
  const colors = {
    active: 'green',
    inactive: 'orange',
    suspended: 'red',
    deleted: 'red'
  }
  return colors[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: API.UserStatus) => {
  const texts = {
    active: '活跃',
    inactive: '未激活',
    suspended: '已暂停',
    deleted: '已删除'
  }
  return texts[status] || status
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.admin-users {
  /* 移除padding，让AdminTable组件处理 */
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  color: #333;
}

.email {
  font-size: 12px;
  color: #666;
}

.text-muted {
  color: #999;
}

.user-detail {
  padding: 16px 0;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}
</style>
