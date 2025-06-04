<template>
  <div class="admin-users">
    <div class="page-header">
      <h2>用户管理</h2>
      <p>管理平台所有用户账户</p>
    </div>

    <!-- 搜索和操作栏 -->
    <a-card class="search-card">
      <a-row :gutter="[16, 16]" align="middle">
        <a-col :xs="24" :sm="8">
          <a-input-search
            v-model:value="searchForm.search"
            placeholder="搜索用户名、邮箱或姓名"
            @search="handleSearch"
            @pressEnter="handleSearch"
          />
        </a-col>

        <a-col :xs="24" :sm="6">
          <a-select
            v-model:value="searchForm.role"
            placeholder="选择角色"
            allowClear
            @change="handleSearch"
          >
            <a-select-option value="">全部角色</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="merchant">商家</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="crew">船员</a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="24" :sm="6">
          <a-select
            v-model:value="searchForm.status"
            placeholder="选择状态"
            allowClear
            @change="handleSearch"
          >
            <a-select-option value="">全部状态</a-select-option>
            <a-select-option value="active">活跃</a-select-option>
            <a-select-option value="inactive">未激活</a-select-option>
            <a-select-option value="suspended">已暂停</a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="24" :sm="4">
          <a-button type="primary" @click="handleSearch" :loading="loading">
            搜索
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- 用户列表 -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="userList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
      >
        <!-- 用户信息 -->
        <template #bodyCell="{ column, record }">
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
            <span v-if="record.last_login">
              {{ formatDate(record.last_login) }}
            </span>
            <span v-else class="text-muted">从未登录</span>
          </template>

          <!-- 操作按钮 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button size="small" @click="handleView(record)">
                查看
              </a-button>
              <a-button
                size="small"
                type="primary"
                @click="handleEdit(record)"
                :disabled="record.role === 'admin'"
              >
                编辑
              </a-button>
              <a-dropdown>
                <a-button size="small">
                  更多
                  <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu @click="(info: any) => handleMenuAction(info.key, record)">
                    <a-menu-item
                      key="resetPassword"
                      :disabled="record.role === 'admin'"
                    >
                      重置密码
                    </a-menu-item>
                    <a-menu-item
                      :key="record.status === 'active' ? 'suspend' : 'activate'"
                      :disabled="record.role === 'admin'"
                    >
                      {{ record.status === 'active' ? '暂停账户' : '激活账户' }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 用户详情抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      title="用户详情"
      width="480"
      @close="handleDrawerClose"
    >
      <div v-if="selectedUser" class="user-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="用户名">
              {{ selectedUser.username }}
            </a-descriptions-item>
            <a-descriptions-item label="邮箱">
              {{ selectedUser.email }}
            </a-descriptions-item>
            <a-descriptions-item label="真实姓名">
              {{ selectedUser.real_name || '未设置' }}
            </a-descriptions-item>
            <a-descriptions-item label="手机号">
              {{ selectedUser.phone || '未设置' }}
            </a-descriptions-item>
            <a-descriptions-item label="角色">
              <a-tag :color="getRoleColor(selectedUser.role)">
                {{ getRoleText(selectedUser.role) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              <a-tag :color="getStatusColor(selectedUser.status)">
                {{ getStatusText(selectedUser.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="注册时间">
              {{ formatDate(selectedUser.created_at) }}
            </a-descriptions-item>
            <a-descriptions-item label="最后登录">
              {{ selectedUser.last_login ? formatDate(selectedUser.last_login) : '从未登录' }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { getUserList } from '@/api'
import type { User, UserRole, UserStatus, PaginationQuery } from '@/types'

// 状态管理
const loading = ref(false)
const userList = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const drawerVisible = ref(false)

// 搜索表单
const searchForm = reactive({
  search: '',
  role: '',
  status: ''
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
})

// 表格列配置
const columns = [
  {
    title: '用户',
    key: 'user',
    width: 200
  },
  {
    title: '真实姓名',
    dataIndex: 'full_name',
    key: 'full_name',
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
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
    customRender: ({ text }: { text: string }) => formatDate(text)
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 加载用户列表
const loadUsers = async () => {
  try {
    loading.value = true
    const params: PaginationQuery & { search?: string; role?: string; status?: string } = {
      page: pagination.current,
      size: pagination.pageSize,
      search: searchForm.search || undefined,
      role: searchForm.role || undefined,
      status: searchForm.status || undefined
    }

    const response = await getUserList(params)
    if (response.success) {
      userList.value = response.data.items
      pagination.total = response.data.total
    }
  } catch (error: any) {
    message.error(error.message || '加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  loadUsers()
}

// 处理表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadUsers()
}

// 处理查看用户
const handleView = (user: User) => {
  selectedUser.value = user
  drawerVisible.value = true
}

// 处理编辑用户
const handleEdit = (user: User) => {
  message.info('编辑功能开发中...')
}

// 处理菜单操作
const handleMenuAction = (key: string, user: User) => {
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

// 关闭抽屉
const handleDrawerClose = () => {
  drawerVisible.value = false
  selectedUser.value = null
}

// 获取角色颜色
const getRoleColor = (role: UserRole) => {
  const colors = {
    admin: 'red',
    merchant: 'blue',
    user: 'green',
    crew: 'orange'
  }
  return colors[role] || 'default'
}

// 获取角色文本
const getRoleText = (role: UserRole) => {
  const texts = {
    admin: '管理员',
    merchant: '商家',
    user: '普通用户',
    crew: '船员'
  }
  return texts[role] || role
}

// 获取状态颜色
const getStatusColor = (status: UserStatus) => {
  const colors = {
    active: 'green',
    inactive: 'orange',
    suspended: 'red'
  }
  return colors[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: UserStatus) => {
  const texts = {
    active: '活跃',
    inactive: '未激活',
    suspended: '已暂停'
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

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.admin-users {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
}

.search-card {
  margin-bottom: 24px;
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
