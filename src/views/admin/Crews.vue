<template>
  <div class="admin-crews">
    <AdminTable
      ref="adminTableRef"
      title="船员管理"
      subtitle="管理平台所有船员信息"
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
        <!-- 船员信息 -->
        <template v-if="column.key === 'crew'">
          <div class="crew-info">
            <div class="crew-details">
              <div class="crew-id">船员 #{{ record.id }}</div>
              <div class="crew-user">用户ID: {{ record.user_id }}</div>
            </div>
          </div>
        </template>

        <!-- 证书信息 -->
        <template v-else-if="column.key === 'license'">
          <div v-if="record.license_no" class="license-info">
            <div class="license-no">{{ record.license_no }}</div>
            <div class="license-type">{{ record.license_type || '未设置类型' }}</div>
          </div>
          <span v-else class="text-muted">未设置</span>
        </template>

        <!-- 可用状态 -->
        <template v-else-if="column.key === 'is_available'">
          <a-tag :color="record.is_available ? 'green' : 'red'">
            {{ record.is_available ? '可用' : '不可用' }}
          </a-tag>
        </template>

        <!-- 当前状态 -->
        <template v-else-if="column.key === 'current_status'">
          <a-tag :color="getStatusColor(record.current_status)">
            {{ getStatusText(record.current_status) }}
          </a-tag>
        </template>

        <!-- 评分 -->
        <template v-else-if="column.key === 'rating'">
          <div class="rating-info">
            <a-rate :value="record.rating" disabled allow-half />
            <span class="rating-text">{{ record.rating.toFixed(1) }}</span>
          </div>
        </template>

        <!-- 从业年限 -->
        <template v-else-if="column.key === 'years_of_experience'">
          <span class="experience">{{ record.years_of_experience }}年</span>
        </template>

        <!-- 服务次数 -->
        <template v-else-if="column.key === 'total_services'">
          <span class="services">{{ record.total_services }}次</span>
        </template>
      </template>

      <!-- 自定义详情页面 -->
      <template #detail="{ record }">
        <div v-if="record" class="crew-detail">
          <div class="detail-section">
            <h4>基本信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="船员ID">
                {{ record.id }}
              </a-descriptions-item>
              <a-descriptions-item label="用户ID">
                {{ record.user_id }}
              </a-descriptions-item>
              <a-descriptions-item label="身份证号">
                {{ record.id_card_no || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="从业年限">
                {{ record.years_of_experience }}年
              </a-descriptions-item>
              <a-descriptions-item label="可用状态">
                <a-tag :color="record.is_available ? 'green' : 'red'">
                  {{ record.is_available ? '可用' : '不可用' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="当前状态">
                <a-tag :color="getStatusColor(record.current_status)">
                  {{ getStatusText(record.current_status) }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="detail-section">
            <h4>证书信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="证书编号">
                {{ record.license_no || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="证书类型">
                {{ record.license_type || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="证书到期">
                {{ record.license_expiry ? formatDate(record.license_expiry) : '未设置' }}
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="detail-section">
            <h4>专业信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="专业技能">
                {{ record.specialties || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="服务评分">
                <div class="rating-display">
                  <a-rate :value="record.rating" disabled allow-half />
                  <span class="rating-text">{{ record.rating.toFixed(1) }} 分</span>
                </div>
              </a-descriptions-item>
              <a-descriptions-item label="服务次数">
                {{ record.total_services }}次
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="detail-section">
            <h4>紧急联系人</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="联系人姓名">
                {{ record.emergency_contact || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="联系人电话">
                {{ record.emergency_phone || '未设置' }}
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="detail-section">
            <h4>时间信息</h4>
            <a-descriptions :column="1" bordered size="small">
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

    <!-- 状态更新对话框 -->
    <a-modal
      v-model:open="statusModalVisible"
      title="更新船员状态"
      @ok="handleStatusSubmit"
      @cancel="statusModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="可用状态">
          <a-radio-group v-model:value="statusForm.is_available">
            <a-radio :value="true">可用</a-radio>
            <a-radio :value="false">不可用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="当前状态">
          <a-select v-model:value="statusForm.current_status" style="width: 100%">
            <a-select-option value="available">待命中</a-select-option>
            <a-select-option value="on_duty">执勤中</a-select-option>
            <a-select-option value="off_duty">休息中</a-select-option>
            <a-select-option value="training">培训中</a-select-option>
            <a-select-option value="leave">请假中</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 评分更新对话框 -->
    <a-modal
      v-model:open="ratingModalVisible"
      title="更新船员评分"
      @ok="handleRatingSubmit"
      @cancel="ratingModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="服务评分">
          <a-rate
            v-model:value="ratingForm.rating"
            allow-half
            :tooltips="['很差', '较差', '一般', '良好', '优秀']"
          />
          <div class="rating-desc">
            当前评分：{{ ratingForm.rating }} 分
          </div>
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
  listCrewsApiV1CrewsGet,
  getCrewDetailApiV1CrewsCrewIdGet,
  updateCrewStatusInfoApiV1CrewsCrewIdStatusPut,
  updateCrewRatingInfoApiV1CrewsCrewIdRatingPut,
  deleteCrewInfoApiV1CrewsCrewIdDelete
} from '@/services/api/crews'

// 组件引用
const adminTableRef = ref<InstanceType<typeof AdminTable>>()

// 状态管理
const statusModalVisible = ref(false)
const ratingModalVisible = ref(false)
const currentCrewId = ref<number>(0)

// 状态表单
const statusForm = reactive({
  is_available: true,
  current_status: 'available'
})

// 评分表单
const ratingForm = reactive({
  rating: 5
})

// 表格列配置
const columns = [
  {
    title: '船员信息',
    key: 'crew',
    width: 120
  },
  {
    title: '证书信息',
    key: 'license',
    width: 150
  },
  {
    title: '从业年限',
    key: 'years_of_experience',
    width: 100
  },
  {
    title: '可用状态',
    key: 'is_available',
    width: 100
  },
  {
    title: '当前状态',
    key: 'current_status',
    width: 100
  },
  {
    title: '服务评分',
    key: 'rating',
    width: 150
  },
  {
    title: '服务次数',
    key: 'total_services',
    width: 100
  }
]

// 搜索配置
const searchConfig = {
  placeholder: '搜索船员信息',
  filters: [
    {
      key: 'is_available',
      placeholder: '可用状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '可用', value: true },
        { label: '不可用', value: false }
      ]
    },
    {
      key: 'license_type',
      placeholder: '证书类型',
      options: [
        { label: '全部类型', value: '' },
        { label: '船长证', value: '船长证' },
        { label: '大副证', value: '大副证' },
        { label: '轮机长证', value: '轮机长证' },
        { label: '水手证', value: '水手证' }
      ]
    },
    {
      key: 'min_experience',
      placeholder: '最少经验年限',
      options: [
        { label: '不限', value: '' },
        { label: '1年以上', value: 1 },
        { label: '3年以上', value: 3 },
        { label: '5年以上', value: 5 },
        { label: '10年以上', value: 10 }
      ]
    }
  ]
}

// 操作配置
const actionConfig = {
  moreActions: [
    { key: 'updateStatus', label: '更新状态' },
    { key: 'updateRating', label: '更新评分' },
    { key: 'delete', label: '删除船员', danger: true }
  ]
}

// 详情配置
const detailConfig = {
  title: '船员详情',
  width: 700,
  fields: []
}

// API配置
const apiConfig = {
  list: listCrewsApiV1CrewsGet,
  detail: getCrewDetailApiV1CrewsCrewIdGet,
  listParams: (searchForm: any, pagination: any) => ({
    page: pagination.current,
    page_size: pagination.pageSize,
    search: searchForm.search || undefined,
    is_available: searchForm.is_available,
    license_type: searchForm.license_type || undefined,
    min_experience: searchForm.min_experience || undefined
  }),
  detailParams: (record: any) => ({
    crew_id: record.id
  })
}

// 处理编辑船员
const handleEdit = (crew: API.CrewListResponse) => {
  message.info('编辑功能开发中...')
}

// 处理菜单操作
const handleMenuAction = async (key: string, crew: API.CrewListResponse) => {
  currentCrewId.value = crew.id

  switch (key) {
    case 'updateStatus':
      statusForm.is_available = crew.is_available
      statusForm.current_status = crew.current_status
      statusModalVisible.value = true
      break
    case 'updateRating':
      ratingForm.rating = crew.rating
      ratingModalVisible.value = true
      break
    case 'delete':
      await handleDeleteCrew(crew.id)
      break
  }
}

// 处理状态更新
const handleStatusSubmit = async () => {
  try {
    const response = await updateCrewStatusInfoApiV1CrewsCrewIdStatusPut(
      { crew_id: currentCrewId.value },
      {
        is_available: statusForm.is_available,
        current_status: statusForm.current_status
      }
    )
    if (response.data?.success) {
      message.success('船员状态更新成功')
      statusModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '状态更新失败')
  }
}

// 处理评分更新
const handleRatingSubmit = async () => {
  try {
    const response = await updateCrewRatingInfoApiV1CrewsCrewIdRatingPut({
      crew_id: currentCrewId.value,
      rating: ratingForm.rating
    })
    if (response.data?.success) {
      message.success('船员评分更新成功')
      ratingModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '评分更新失败')
  }
}

// 处理删除船员
const handleDeleteCrew = async (crewId: number) => {
  try {
    const response = await deleteCrewInfoApiV1CrewsCrewIdDelete({
      crew_id: crewId
    })
    if (response.data?.success) {
      message.success('船员删除成功')
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    available: 'green',
    on_duty: 'blue',
    off_duty: 'orange',
    training: 'purple',
    leave: 'red'
  }
  return colors[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    available: '待命中',
    on_duty: '执勤中',
    off_duty: '休息中',
    training: '培训中',
    leave: '请假中'
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
.admin-crews {
  /* 继承AdminTable样式 */
}

.crew-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.crew-details {
  display: flex;
  flex-direction: column;
}

.crew-id {
  font-weight: 500;
  color: #333;
}

.crew-user {
  font-size: 12px;
  color: #666;
}

.license-info {
  display: flex;
  flex-direction: column;
}

.license-no {
  font-weight: 500;
  color: #333;
}

.license-type {
  font-size: 12px;
  color: #666;
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  font-weight: 500;
  color: #faad14;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-desc {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.experience {
  color: #1890ff;
  font-weight: 500;
}

.services {
  color: #52c41a;
  font-weight: 500;
}

.text-muted {
  color: #999;
}

.crew-detail {
  padding: 16px 0;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  color: #262626;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}
</style>