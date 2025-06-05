<template>
  <div class="admin-users">
    <AdminTable
      ref="adminTableRef"
      title="用户管理"
      subtitle="管理平台所有用户账户"
      :columns="columns"
      :search-config="searchConfig"
      :action-config="actionConfig"
      :detail-config="detailConfig"
      :api-config="apiConfig"
      @create="handleCreate"
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

    <!-- 创建用户弹窗 -->
    <a-modal
      v-model:open="createModalVisible"
      title="创建新用户"
      width="600px"
      @ok="handleCreateSubmit"
      @cancel="createModalVisible = false"
      :confirm-loading="createLoading"
    >
      <a-form
        :model="createForm"
        layout="vertical"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名" required>
              <a-input v-model:value="createForm.username" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱" required>
              <a-input v-model:value="createForm.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="密码" required>
              <a-input-password v-model:value="createForm.password" placeholder="请输入密码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色" required>
              <a-select v-model:value="createForm.role" placeholder="请选择角色">
                <a-select-option value="user">普通用户</a-select-option>
                <a-select-option value="merchant">商家</a-select-option>
                <a-select-option value="crew">船员</a-select-option>
                <a-select-option value="admin">管理员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="真实姓名">
              <a-input v-model:value="createForm.real_name" placeholder="请输入真实姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号">
              <a-input v-model:value="createForm.phone" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="性别">
              <a-select v-model:value="createForm.gender" placeholder="请选择性别" allow-clear>
                <a-select-option value="male">男</a-select-option>
                <a-select-option value="female">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地址">
              <a-input v-model:value="createForm.address" placeholder="请输入地址" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 编辑用户弹窗 -->
    <a-modal
      v-model:open="editModalVisible"
      title="编辑用户信息"
      width="600px"
      @ok="handleEditSubmit"
      @cancel="editModalVisible = false"
      :confirm-loading="editLoading"
    >
      <a-form
        :model="editForm"
        layout="vertical"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名">
              <a-input v-model:value="editForm.username" disabled placeholder="用户名不可修改" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱" required>
              <a-input v-model:value="editForm.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="真实姓名">
              <a-input v-model:value="editForm.real_name" placeholder="请输入真实姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号">
              <a-input v-model:value="editForm.phone" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="性别">
              <a-select v-model:value="editForm.gender" placeholder="请选择性别" allow-clear>
                <a-select-option value="male">男</a-select-option>
                <a-select-option value="female">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地址">
              <a-input v-model:value="editForm.address" placeholder="请输入地址" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 修改角色弹窗 -->
    <a-modal
      v-model:open="roleModalVisible"
      title="修改用户角色"
      @ok="handleRoleSubmit"
      @cancel="roleModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="选择新角色" required>
          <a-select v-model:value="roleForm.new_role" placeholder="请选择角色">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="merchant">商家</a-select-option>
            <a-select-option value="crew">船员</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 修改状态弹窗 -->
    <a-modal
      v-model:open="statusModalVisible"
      title="修改用户状态"
      @ok="handleStatusSubmit"
      @cancel="statusModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="选择新状态" required>
          <a-select v-model:value="statusForm.new_status" placeholder="请选择状态">
            <a-select-option value="active">活跃</a-select-option>
            <a-select-option value="inactive">未激活</a-select-option>
            <a-select-option value="suspended">已暂停</a-select-option>
            <a-select-option value="deleted">已删除</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import AdminTable from '@/components/AdminTable.vue'
import {
  listAllUsersApiV1AdminUsersGet,
  createNewUserApiV1AdminUsersPost,
  getUserDetailApiV1AdminUsersUserIdGet,
  updateUserInfoApiV1AdminUsersUserIdPut,
  deleteUserByIdApiV1AdminUsersUserIdDelete,
  updateUserRoleApiV1AdminUsersUserIdRolePut,
  updateUserStatusApiV1AdminUsersUserIdStatusPut
} from '@/services/api/admin'

// 组件状态
const adminTableRef = ref<InstanceType<typeof AdminTable>>()
const editModalVisible = ref(false)
const createModalVisible = ref(false)
const roleModalVisible = ref(false)
const statusModalVisible = ref(false)
const editLoading = ref(false)
const createLoading = ref(false)
const currentUser = ref<API.UserResponse | null>(null)

// 编辑用户表单
const editForm = reactive<API.UserUpdate>({
  username: '',
  email: '',
  real_name: '',
  phone: '',
  gender: '',
  address: ''
})

// 创建用户表单
const createForm = reactive<API.UserCreate>({
  username: '',
  email: '',
  password: '',
  real_name: '',
  phone: '',
  gender: '',
  address: '',
  role: 'user'
})

// 角色更新表单
const roleForm = reactive({
  user_id: 0,
  new_role: 'user' as API.UserRole
})

// 状态更新表单
const statusForm = reactive({
  user_id: 0,
  new_status: 'active' as API.UserStatus
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
  showCreate: true,
  moreActions: [
    { key: 'changeRole', label: '修改角色' },
    { key: 'changeStatus', label: '修改状态' },
    { key: 'delete', label: '删除用户', danger: true }
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
  detail: getUserDetailApiV1AdminUsersUserIdGet,
  listParams: (searchForm: any, pagination: any) => ({
    page: pagination.current,
    page_size: pagination.pageSize,
    search: searchForm.search || undefined,
    role: searchForm.role as API.UserRole || undefined,
    status: searchForm.status as API.UserStatus || undefined
  }),
  detailParams: (record: API.UserResponse) => ({ user_id: record.id })
}

// 处理编辑用户
const handleEdit = (user: API.UserResponse) => {
  currentUser.value = user
  Object.assign(editForm, {
    username: user.username,
    email: user.email,
    real_name: user.real_name || '',
    phone: user.phone || '',
    gender: user.gender || '',
    address: user.address || ''
  })
  editModalVisible.value = true
}

// 处理创建用户
const handleCreate = () => {
  Object.assign(createForm, {
    username: '',
    email: '',
    password: '',
    real_name: '',
    phone: '',
    gender: '',
    address: '',
    role: 'user'
  })
  createModalVisible.value = true
}

// 提交创建用户
const handleCreateSubmit = async () => {
  try {
    createLoading.value = true
    const response = await createNewUserApiV1AdminUsersPost(createForm)
    if (response.data?.success) {
      message.success('用户创建成功')
      createModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '创建用户失败')
  } finally {
    createLoading.value = false
  }
}

// 提交编辑用户
const handleEditSubmit = async () => {
  if (!currentUser.value) return

  try {
    editLoading.value = true
    const response = await updateUserInfoApiV1AdminUsersUserIdPut(
      { user_id: currentUser.value.id },
      editForm
    )
    if (response.data?.success) {
      message.success('用户信息更新成功')
      editModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '更新用户信息失败')
  } finally {
    editLoading.value = false
  }
}

// 处理角色更改
const handleChangeRole = (user: API.UserResponse) => {
  roleForm.user_id = user.id
  roleForm.new_role = user.role
  roleModalVisible.value = true
}

// 提交角色更改
const handleRoleSubmit = async () => {
  try {
    const response = await updateUserRoleApiV1AdminUsersUserIdRolePut({
      user_id: roleForm.user_id,
      new_role: roleForm.new_role
    })
    if (response.data?.success) {
      message.success('用户角色更新成功')
      roleModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '更新用户角色失败')
  }
}

// 处理状态更改
const handleChangeStatus = (user: API.UserResponse) => {
  statusForm.user_id = user.id
  statusForm.new_status = user.status
  statusModalVisible.value = true
}

// 提交状态更改
const handleStatusSubmit = async () => {
  try {
    const response = await updateUserStatusApiV1AdminUsersUserIdStatusPut({
      user_id: statusForm.user_id,
      new_status: statusForm.new_status
    })
    if (response.data?.success) {
      message.success('用户状态更新成功')
      statusModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '更新用户状态失败')
  }
}

// 处理删除用户
const handleDelete = (user: API.UserResponse) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${user.username}" 吗？此操作不可恢复。`,
    okType: 'danger',
    onOk: async () => {
      try {
        const response = await deleteUserByIdApiV1AdminUsersUserIdDelete({
          user_id: user.id
        })
        if (response.data?.success) {
          message.success('用户删除成功')
          adminTableRef.value?.refresh()
        }
      } catch (error: any) {
        message.error(error.message || '删除用户失败')
      }
    }
  })
}

// 处理菜单操作
const handleMenuAction = (key: string, user: API.UserResponse) => {
  switch (key) {
    case 'changeRole':
      handleChangeRole(user)
      break
    case 'changeStatus':
      handleChangeStatus(user)
      break
    case 'delete':
      handleDelete(user)
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
