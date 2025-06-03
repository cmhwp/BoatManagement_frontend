<template>
  <div class="admin-merchants">
    <div class="page-header">
      <h2>商家管理</h2>
      <p>管理平台所有商家账户和认证</p>
    </div>

    <!-- 搜索和操作栏 -->
    <a-card class="search-card">
      <a-row :gutter="[16, 16]" align="middle">
        <a-col :xs="24" :sm="8">
          <a-input-search
            v-model:value="searchForm.search"
            placeholder="搜索商家名称、联系人或地址"
            @search="handleSearch"
            @pressEnter="handleSearch"
          />
        </a-col>

        <a-col :xs="24" :sm="6">
          <a-select
            v-model:value="searchForm.status"
            placeholder="选择状态"
            allowClear
            @change="handleSearch"
          >
            <a-select-option value="">全部状态</a-select-option>
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="verified">已认证</a-select-option>
            <a-select-option value="active">活跃</a-select-option>
            <a-select-option value="inactive">未激活</a-select-option>
            <a-select-option value="suspended">已暂停</a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="24" :sm="6">
          <a-select
            v-model:value="searchForm.is_verified"
            placeholder="认证状态"
            allowClear
            @change="handleSearch"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="true">已认证</a-select-option>
            <a-select-option :value="false">未认证</a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="24" :sm="4">
          <a-button type="primary" @click="handleSearch" :loading="loading">
            搜索
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- 商家列表 -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="merchantList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <!-- 商家信息 -->
          <template v-if="column.key === 'merchant'">
            <div class="merchant-info">
              <a-avatar size="small" :src="record.logo" shape="square">
                {{ record.business_name.charAt(0) }}
              </a-avatar>
              <div class="merchant-details">
                <div class="business-name">{{ record.business_name }}</div>
                <div class="contact-person">{{ record.contact_person }}</div>
              </div>
            </div>
          </template>

          <!-- 状态标签 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>

          <!-- 认证状态 -->
          <template v-else-if="column.key === 'is_verified'">
            <a-tag :color="record.is_verified ? 'green' : 'orange'">
              {{ record.is_verified ? '已认证' : '未认证' }}
            </a-tag>
          </template>

          <!-- 评分 -->
          <template v-else-if="column.key === 'rating'">
            <a-rate :value="record.rating" disabled allow-half />
            <span class="rating-text">({{ record.rating.toFixed(1) }})</span>
          </template>

          <!-- 创建时间 -->
          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
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
                      key="verify"
                      v-if="!record.is_verified"
                    >
                      认证通过
                    </a-menu-item>
                    <a-menu-item
                      key="unverify"
                      v-if="record.is_verified"
                    >
                      取消认证
                    </a-menu-item>
                    <a-menu-item
                      :key="record.status === 'active' ? 'suspend' : 'activate'"
                    >
                      {{ record.status === 'active' ? '暂停商家' : '激活商家' }}
                    </a-menu-item>
                    <a-menu-item key="delete" class="danger-action">
                      删除商家
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 商家详情抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      title="商家详情"
      width="600"
      @close="handleDrawerClose"
    >
      <div v-if="selectedMerchant" class="merchant-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="商家名称">
              {{ selectedMerchant.business_name }}
            </a-descriptions-item>
            <a-descriptions-item label="营业执照">
              {{ selectedMerchant.business_license }}
            </a-descriptions-item>
            <a-descriptions-item label="联系人">
              {{ selectedMerchant.contact_person }}
            </a-descriptions-item>
            <a-descriptions-item label="联系电话">
              {{ selectedMerchant.contact_phone }}
            </a-descriptions-item>
            <a-descriptions-item label="地址">
              {{ selectedMerchant.address }}
            </a-descriptions-item>
            <a-descriptions-item label="商家状态">
              <a-tag :color="getStatusColor(selectedMerchant.status)">
                {{ getStatusText(selectedMerchant.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="认证状态">
              <a-tag :color="selectedMerchant.is_verified ? 'green' : 'orange'">
                {{ selectedMerchant.is_verified ? '已认证' : '未认证' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="评分">
              <a-rate :value="selectedMerchant.rating" disabled allow-half />
              <span class="rating-text">({{ selectedMerchant.rating.toFixed(1) }})</span>
            </a-descriptions-item>
            <a-descriptions-item label="注册时间">
              {{ formatDate(selectedMerchant.created_at) }}
            </a-descriptions-item>
            <a-descriptions-item label="更新时间">
              {{ formatDate(selectedMerchant.updated_at) }}
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <div v-if="selectedMerchant.description" class="detail-section">
          <h4>商家描述</h4>
          <p>{{ selectedMerchant.description }}</p>
        </div>

        <div v-if="selectedMerchant.logo" class="detail-section">
          <h4>商家Logo</h4>
          <a-image
            :src="selectedMerchant.logo"
            :width="200"
            :preview="true"
          />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import type { Merchant, MerchantStatus, MerchantQuery } from '@/types'

// 状态管理
const loading = ref(false)
const merchantList = ref<Merchant[]>([])
const selectedMerchant = ref<Merchant | null>(null)
const drawerVisible = ref(false)

// 搜索表单
const searchForm = reactive({
  search: '',
  status: '',
  is_verified: undefined as boolean | undefined
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
    title: '商家',
    key: 'merchant',
    width: 250
  },
  {
    title: '联系电话',
    dataIndex: 'contact_phone',
    key: 'contact_phone',
    width: 120
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: 200,
    ellipsis: true
  },
  {
    title: '状态',
    key: 'status',
    width: 100
  },
  {
    title: '认证状态',
    key: 'is_verified',
    width: 100
  },
  {
    title: '评分',
    key: 'rating',
    width: 150
  },
  {
    title: '注册时间',
    key: 'created_at',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 加载商家列表（模拟数据）
const loadMerchants = async () => {
  try {
    loading.value = true

    // 模拟API调用
    setTimeout(() => {
      const mockData: Merchant[] = [
        {
          id: 1,
          user_id: 2,
          business_name: '海上风帆游艇公司',
          business_license: '91110000123456789X',
          contact_person: '张经理',
          contact_phone: '138-0000-1111',
          address: '北京市朝阳区海淀路123号',
          description: '专业提供豪华游艇租赁服务',
          logo: '',
          status: 'active' as MerchantStatus,
          is_verified: true,
          rating: 4.8,
          created_at: '2024-01-15T08:30:00Z',
          updated_at: '2024-01-20T10:15:00Z'
        },
        {
          id: 2,
          user_id: 3,
          business_name: '蓝海船艇服务中心',
          business_license: '91110000987654321Y',
          contact_person: '李总',
          contact_phone: '139-0000-2222',
          address: '上海市浦东新区滨海大道456号',
          description: '提供各类船艇租赁和维护服务',
          logo: '',
          status: 'pending' as MerchantStatus,
          is_verified: false,
          rating: 4.2,
          created_at: '2024-01-18T14:20:00Z',
          updated_at: '2024-01-18T14:20:00Z'
        }
      ]

      merchantList.value = mockData
      pagination.total = mockData.length
      loading.value = false
    }, 1000)
  } catch (error: any) {
    message.error(error.message || '加载商家列表失败')
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  loadMerchants()
}

// 处理表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadMerchants()
}

// 处理查看商家
const handleView = (merchant: Merchant) => {
  selectedMerchant.value = merchant
  drawerVisible.value = true
}

// 处理编辑商家
const handleEdit = (merchant: Merchant) => {
  message.info('编辑功能开发中...')
}

// 处理菜单操作
const handleMenuAction = (key: string, merchant: Merchant) => {
  switch (key) {
    case 'verify':
      handleVerifyMerchant(merchant)
      break
    case 'unverify':
      handleUnverifyMerchant(merchant)
      break
    case 'suspend':
      handleSuspendMerchant(merchant)
      break
    case 'activate':
      handleActivateMerchant(merchant)
      break
    case 'delete':
      handleDeleteMerchant(merchant)
      break
  }
}

// 认证商家
const handleVerifyMerchant = (merchant: Merchant) => {
  Modal.confirm({
    title: '确认认证',
    content: `确定要认证商家"${merchant.business_name}"吗？`,
    icon: () => h(ExclamationCircleOutlined),
    onOk() {
      message.success('商家认证成功')
      loadMerchants()
    }
  })
}

// 取消认证
const handleUnverifyMerchant = (merchant: Merchant) => {
  Modal.confirm({
    title: '取消认证',
    content: `确定要取消商家"${merchant.business_name}"的认证吗？`,
    icon: () => h(ExclamationCircleOutlined),
    onOk() {
      message.success('已取消商家认证')
      loadMerchants()
    }
  })
}

// 暂停商家
const handleSuspendMerchant = (merchant: Merchant) => {
  Modal.confirm({
    title: '暂停商家',
    content: `确定要暂停商家"${merchant.business_name}"吗？`,
    icon: () => h(ExclamationCircleOutlined),
    onOk() {
      message.success('商家已暂停')
      loadMerchants()
    }
  })
}

// 激活商家
const handleActivateMerchant = (merchant: Merchant) => {
  message.success('商家已激活')
  loadMerchants()
}

// 删除商家
const handleDeleteMerchant = (merchant: Merchant) => {
  Modal.confirm({
    title: '删除商家',
    content: `确定要删除商家"${merchant.business_name}"吗？此操作不可恢复。`,
    icon: () => h(ExclamationCircleOutlined),
    okType: 'danger',
    onOk() {
      message.success('商家已删除')
      loadMerchants()
    }
  })
}

// 关闭抽屉
const handleDrawerClose = () => {
  drawerVisible.value = false
  selectedMerchant.value = null
}

// 获取状态颜色
const getStatusColor = (status: MerchantStatus) => {
  const colors = {
    pending: 'orange',
    verified: 'green',
    active: 'green',
    inactive: 'default',
    suspended: 'red'
  }
  return colors[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: MerchantStatus) => {
  const texts = {
    pending: '待审核',
    verified: '已认证',
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
  loadMerchants()
})
</script>

<style scoped>
.admin-merchants {
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

.merchant-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.merchant-details {
  display: flex;
  flex-direction: column;
}

.business-name {
  font-weight: 500;
  color: #333;
}

.contact-person {
  font-size: 12px;
  color: #666;
}

.rating-text {
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}

.merchant-detail {
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

.danger-action {
  color: #ff4d4f !important;
}
</style>
