<template>
  <div class="admin-merchants">
    <AdminTable
      ref="adminTableRef"
      title="商家管理"
      subtitle="管理平台所有商家账户"
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
        <!-- 商家信息 -->
        <template v-if="column.key === 'merchant'">
          <div class="merchant-info">
            <a-avatar size="small" :src="record.logo">
              {{ record.company_name?.charAt(0).toUpperCase() }}
            </a-avatar>
            <div class="merchant-details">
              <div class="business-name">{{ record.company_name }}</div>
              <div class="contact-info">{{ record.contact_person }} - {{ record.contact_email }}</div>
            </div>
          </div>
        </template>

        <!-- 认证状态 -->
        <template v-else-if="column.key === 'verified'">
          <a-tag :color="record.is_verified ? 'green' : 'orange'">
            {{ record.is_verified ? '已认证' : '未认证' }}
          </a-tag>
        </template>

        <!-- 账户状态 -->
        <template v-else-if="column.key === 'active'">
          <a-tag :color="record.is_active ? 'green' : 'red'">
            {{ record.is_active ? '已激活' : '已停用' }}
          </a-tag>
        </template>

        <!-- 创建时间 -->
        <template v-else-if="column.key === 'created_at'">
          {{ formatDate(record.created_at) }}
        </template>
      </template>

      <!-- 自定义详情页面 -->
      <template #detail="{ record }">
        <div v-if="record" class="merchant-detail">
          <div class="detail-section">
            <h4>基本信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="商家名称">
                {{ record.company_name }}
              </a-descriptions-item>
              <a-descriptions-item label="联系人">
                {{ record.contact_person }}
              </a-descriptions-item>
              <a-descriptions-item label="联系邮箱">
                {{ record.contact_email }}
              </a-descriptions-item>
              <a-descriptions-item label="联系电话">
                {{ record.contact_phone }}
              </a-descriptions-item>
              <a-descriptions-item label="营业地址">
                {{ record.business_address || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="营业执照号">
                {{ record.business_license_no || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="认证状态">
                <a-tag :color="record.is_verified ? 'green' : 'orange'">
                  {{ record.is_verified ? '已认证' : '未认证' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="账户状态">
                <a-tag :color="record.is_active ? 'green' : 'red'">
                  {{ record.is_active ? '已激活' : '已停用' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{ formatDate(record.created_at) }}
              </a-descriptions-item>
              <a-descriptions-item label="更新时间">
                {{ formatDate(record.updated_at) }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </template>
    </AdminTable>

    <!-- 认证对话框 -->
    <a-modal
      v-model:open="verifyModalVisible"
      title="商家认证"
      @ok="handleVerifySubmit"
      @cancel="verifyModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="认证状态">
          <a-radio-group v-model:value="verifyForm.is_verified">
            <a-radio :value="true">通过认证</a-radio>
            <a-radio :value="false">拒绝认证</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="认证备注">
          <a-textarea
            v-model:value="verifyForm.verification_note"
            placeholder="请输入认证备注信息"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import AdminTable from '@/components/AdminTable.vue'
import {
  listMerchantsApiV1MerchantsGet,
  getMerchantDetailApiV1MerchantsMerchantIdGet,
  activateMerchantAccountApiV1MerchantsMerchantIdActivatePost,
  verifyMerchantInfoApiV1MerchantsMerchantIdVerifyPost,
  deleteMerchantInfoApiV1MerchantsMerchantIdDelete
} from '@/services/api/merchants'

// 组件引用
const adminTableRef = ref<InstanceType<typeof AdminTable>>()

// 状态管理
const verifyModalVisible = ref(false)
const currentMerchantId = ref<number>(0)

// 认证表单
const verifyForm = reactive({
  is_verified: true,
  verification_note: ''
})

// 表格列配置
const columns = [
  {
    title: '商家信息',
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
    title: '营业地址',
    dataIndex: 'business_address',
    key: 'business_address',
    width: 200,
    ellipsis: true
  },
  {
    title: '认证状态',
    key: 'verified',
    width: 100
  },
  {
    title: '账户状态',
    key: 'active',
    width: 100
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 150
  }
]

// 搜索配置
const searchConfig = {
  placeholder: '搜索商家名称、联系人或邮箱',
  filters: [
    {
      key: 'is_verified',
      placeholder: '认证状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '已认证', value: true },
        { label: '未认证', value: false }
      ]
    },
    {
      key: 'is_active',
      placeholder: '账户状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '已激活', value: true },
        { label: '已停用', value: false }
      ]
    }
  ]
}

// 操作配置
const actionConfig = {
  moreActions: [
    { key: 'verify', label: '认证商家' },
    { key: 'unverify', label: '取消认证' },
    { key: 'activate', label: '激活账户' },
    { key: 'deactivate', label: '停用账户' },
    { key: 'delete', label: '删除商家', danger: true }
  ]
}

// 详情配置
const detailConfig = {
  title: '商家详情',
  width: 600,
  fields: []
}

// API配置
const apiConfig = {
  list: listMerchantsApiV1MerchantsGet,
  detail: getMerchantDetailApiV1MerchantsMerchantIdGet,
  listParams: (searchForm: any, pagination: any) => ({
    page: pagination.current,
    page_size: pagination.pageSize,
    search: searchForm.search || undefined,
    is_verified: searchForm.is_verified,
    is_active: searchForm.is_active
  }),
  detailParams: (record: any) => ({
    merchant_id: record.id
  })
}

// 处理编辑商家
const handleEdit = (merchant: API.MerchantListResponse) => {
  message.info('编辑功能开发中...')
}

// 处理菜单操作
const handleMenuAction = async (key: string, merchant: API.MerchantListResponse) => {
  currentMerchantId.value = merchant.id

  switch (key) {
    case 'verify':
    case 'unverify':
      verifyForm.is_verified = key === 'verify'
      verifyForm.verification_note = ''
      verifyModalVisible.value = true
      break
    case 'activate':
    case 'deactivate':
      await handleActivateMerchant(merchant.id, key === 'activate')
      break
    case 'delete':
      await handleDeleteMerchant(merchant.id)
      break
  }
}

// 处理激活/停用商家
const handleActivateMerchant = async (merchantId: number, isActive: boolean) => {
  try {
    const response = await activateMerchantAccountApiV1MerchantsMerchantIdActivatePost({
      merchant_id: merchantId,
      is_active: isActive
    })
    if (response.data?.success) {
      message.success(`商家账户${isActive ? '激活' : '停用'}成功`)
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || `${isActive ? '激活' : '停用'}失败`)
  }
}

// 处理认证提交
const handleVerifySubmit = async () => {
  try {
    const response = await verifyMerchantInfoApiV1MerchantsMerchantIdVerifyPost(
      { merchant_id: currentMerchantId.value },
      {
        merchant_id: currentMerchantId.value,
        is_verified: verifyForm.is_verified,
        verification_note: verifyForm.verification_note
      }
    )
    if (response.data?.success) {
      message.success('商家认证状态更新成功')
      verifyModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '认证操作失败')
  }
}

// 处理删除商家
const handleDeleteMerchant = async (merchantId: number) => {
  try {
    const response = await deleteMerchantInfoApiV1MerchantsMerchantIdDelete({
      merchant_id: merchantId
    })
    if (response.data?.success) {
      message.success('商家删除成功')
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
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

.contact-info {
  font-size: 12px;
  color: #666;
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
</style>
