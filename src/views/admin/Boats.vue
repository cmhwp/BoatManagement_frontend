<template>
  <div class="admin-boats">
    <AdminTable
      ref="adminTableRef"
      title="船舶管理"
      subtitle="管理平台所有船舶信息"
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
        <!-- 船舶信息 -->
        <template v-if="column.key === 'boat'">
          <div class="boat-info">
            <div class="boat-details">
              <div class="boat-name">{{ record.name }}</div>
              <div class="boat-registration">{{ record.registration_no }}</div>
            </div>
          </div>
        </template>

        <!-- 船舶类型 -->
        <template v-else-if="column.key === 'boat_type'">
          <a-tag :color="getBoatTypeColor(record.boat_type)">
            {{ getBoatTypeText(record.boat_type) }}
          </a-tag>
        </template>

        <!-- 船舶状态 -->
        <template v-else-if="column.key === 'status'">
          <a-tag :color="getBoatStatusColor(record.status)">
            {{ getBoatStatusText(record.status) }}
          </a-tag>
        </template>

        <!-- 可用状态 -->
        <template v-else-if="column.key === 'is_available'">
          <a-tag :color="record.is_available ? 'green' : 'red'">
            {{ record.is_available ? '可用' : '不可用' }}
          </a-tag>
        </template>

        <!-- 价格信息 -->
        <template v-else-if="column.key === 'daily_rate'">
          <span v-if="record.daily_rate" class="price">
            ¥{{ record.daily_rate }}/天
          </span>
          <span v-else class="text-muted">未设置</span>
        </template>
      </template>

      <!-- 自定义详情页面 -->
      <template #detail="{ record }">
        <div v-if="record" class="boat-detail">
          <div class="detail-section">
            <h4>基本信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="船舶名称">
                {{ record.name }}
              </a-descriptions-item>
              <a-descriptions-item label="船舶类型">
                <a-tag :color="getBoatTypeColor(record.boat_type)">
                  {{ getBoatTypeText(record.boat_type) }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="注册号">
                {{ record.registration_no }}
              </a-descriptions-item>
              <a-descriptions-item label="许可证号">
                {{ record.license_no || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="载客量">
                {{ record.passenger_capacity ? record.passenger_capacity + '人' : '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="船长/船宽">
                {{ formatDimensions(record.length, record.width) }}
              </a-descriptions-item>
              <a-descriptions-item label="发动机功率">
                {{ record.engine_power || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="当前位置">
                {{ record.current_location || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-tag :color="getBoatStatusColor(record.status)">
                  {{ getBoatStatusText(record.status) }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="可用状态">
                <a-tag :color="record.is_available ? 'green' : 'red'">
                  {{ record.is_available ? '可用' : '不可用' }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="detail-section">
            <h4>价格信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="日租价格">
                {{ record.daily_rate ? '¥' + record.daily_rate : '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="小时价格">
                {{ record.hourly_rate ? '¥' + record.hourly_rate : '未设置' }}
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="detail-section">
            <h4>安全信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="安全设备">
                {{ record.safety_equipment || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="保险号">
                {{ record.insurance_no || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="保险到期">
                {{ record.insurance_expiry ? formatDate(record.insurance_expiry) : '未设置' }}
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="detail-section" v-if="record.description">
            <h4>船舶描述</h4>
            <p>{{ record.description }}</p>
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
      title="更新船舶状态"
      @ok="handleStatusSubmit"
      @cancel="statusModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="船舶状态">
          <a-select v-model:value="statusForm.status" style="width: 100%">
            <a-select-option value="available">可用</a-select-option>
            <a-select-option value="in_use">使用中</a-select-option>
            <a-select-option value="maintenance">维修中</a-select-option>
            <a-select-option value="out_of_service">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否可预订">
          <a-radio-group v-model:value="statusForm.is_available">
            <a-radio :value="true">可预订</a-radio>
            <a-radio :value="false">不可预订</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="当前位置">
          <a-input
            v-model:value="statusForm.current_location"
            placeholder="请输入当前位置"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 位置更新对话框 -->
    <a-modal
      v-model:open="locationModalVisible"
      title="更新船舶位置"
      @ok="handleLocationSubmit"
      @cancel="locationModalVisible = false"
    >
      <a-form layout="vertical">
        <a-form-item label="当前位置">
          <a-input
            v-model:value="locationForm.location"
            placeholder="请输入船舶当前位置"
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
  listBoatsApiV1BoatsGet,
  getBoatDetailApiV1BoatsBoatIdGet,
  updateBoatStatusInfoApiV1BoatsBoatIdStatusPut,
  updateBoatLocationInfoApiV1BoatsBoatIdLocationPut,
  deleteBoatInfoApiV1BoatsBoatIdDelete
} from '@/services/api/boats'

// 组件引用
const adminTableRef = ref<InstanceType<typeof AdminTable>>()

// 状态管理
const statusModalVisible = ref(false)
const locationModalVisible = ref(false)
const currentBoatId = ref<number>(0)

// 状态表单
const statusForm = reactive({
  status: 'available' as API.BoatStatus,
  is_available: true,
  current_location: ''
})

// 位置表单
const locationForm = reactive({
  location: ''
})

// 表格列配置
const columns = [
  {
    title: '船舶信息',
    key: 'boat',
    width: 200
  },
  {
    title: '船舶类型',
    key: 'boat_type',
    width: 100
  },
  {
    title: '载客量',
    dataIndex: 'passenger_capacity',
    key: 'passenger_capacity',
    width: 80,
    customRender: ({ text }: { text: number }) => text ? `${text}人` : '-'
  },
  {
    title: '船舶状态',
    key: 'status',
    width: 100
  },
  {
    title: '可用状态',
    key: 'is_available',
    width: 100
  },
  {
    title: '日租价格',
    key: 'daily_rate',
    width: 120
  },
  {
    title: '当前位置',
    dataIndex: 'current_location',
    key: 'current_location',
    width: 150,
    ellipsis: true
  }
]

// 搜索配置
const searchConfig = {
  placeholder: '搜索船舶名称、注册号',
  filters: [
    {
      key: 'boat_type',
      placeholder: '船舶类型',
      options: [
        { label: '全部类型', value: '' },
        { label: '观光船', value: 'tourist' },
        { label: '渔船', value: 'fishing' },
        { label: '货船', value: 'cargo' },
        { label: '快艇', value: 'speedboat' }
      ]
    },
    {
      key: 'status',
      placeholder: '船舶状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '可用', value: 'available' },
        { label: '使用中', value: 'in_use' },
        { label: '维修中', value: 'maintenance' },
        { label: '停用', value: 'out_of_service' }
      ]
    },
    {
      key: 'is_available',
      placeholder: '可预订状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '可预订', value: true },
        { label: '不可预订', value: false }
      ]
    }
  ]
}

// 操作配置
const actionConfig = {
  moreActions: [
    { key: 'updateStatus', label: '更新状态' },
    { key: 'updateLocation', label: '更新位置' },
    { key: 'delete', label: '删除船舶', danger: true }
  ]
}

// 详情配置
const detailConfig = {
  title: '船舶详情',
  width: 700,
  fields: []
}

// API配置
const apiConfig = {
  list: listBoatsApiV1BoatsGet,
  detail: getBoatDetailApiV1BoatsBoatIdGet,
  listParams: (searchForm: any, pagination: any) => ({
    page: pagination.current,
    page_size: pagination.pageSize,
    search: searchForm.search || undefined,
    boat_type: searchForm.boat_type as API.BoatType || undefined,
    status: searchForm.status as API.BoatStatus || undefined,
    is_available: searchForm.is_available
  }),
  detailParams: (record: any) => ({
    boat_id: record.id
  })
}

// 处理编辑船舶
const handleEdit = (boat: API.BoatListResponse) => {
  message.info('编辑功能开发中...')
}

// 处理菜单操作
const handleMenuAction = async (key: string, boat: API.BoatListResponse) => {
  currentBoatId.value = boat.id

  switch (key) {
    case 'updateStatus':
      statusForm.status = boat.status
      statusForm.is_available = boat.is_available
      statusForm.current_location = boat.current_location || ''
      statusModalVisible.value = true
      break
    case 'updateLocation':
      locationForm.location = boat.current_location || ''
      locationModalVisible.value = true
      break
    case 'delete':
      await handleDeleteBoat(boat.id)
      break
  }
}

// 处理状态更新
const handleStatusSubmit = async () => {
  try {
    const response = await updateBoatStatusInfoApiV1BoatsBoatIdStatusPut(
      { boat_id: currentBoatId.value },
      {
        status: statusForm.status,
        is_available: statusForm.is_available,
        current_location: statusForm.current_location || null
      }
    )
    if (response.data?.success) {
      message.success('船舶状态更新成功')
      statusModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '状态更新失败')
  }
}

// 处理位置更新
const handleLocationSubmit = async () => {
  try {
    const response = await updateBoatLocationInfoApiV1BoatsBoatIdLocationPut({
      boat_id: currentBoatId.value,
      location: locationForm.location
    })
    if (response.data?.success) {
      message.success('船舶位置更新成功')
      locationModalVisible.value = false
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '位置更新失败')
  }
}

// 处理删除船舶
const handleDeleteBoat = async (boatId: number) => {
  try {
    const response = await deleteBoatInfoApiV1BoatsBoatIdDelete({
      boat_id: boatId
    })
    if (response.data?.success) {
      message.success('船舶删除成功')
      adminTableRef.value?.refresh()
    }
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

// 获取船舶类型颜色
const getBoatTypeColor = (type: API.BoatType) => {
  const colors = {
    tourist: 'blue',
    fishing: 'green',
    cargo: 'orange',
    speedboat: 'red'
  }
  return colors[type] || 'default'
}

// 获取船舶类型文本
const getBoatTypeText = (type: API.BoatType) => {
  const texts = {
    tourist: '观光船',
    fishing: '渔船',
    cargo: '货船',
    speedboat: '快艇'
  }
  return texts[type] || type
}

// 获取船舶状态颜色
const getBoatStatusColor = (status: API.BoatStatus) => {
  const colors = {
    available: 'green',
    in_use: 'blue',
    maintenance: 'orange',
    out_of_service: 'red'
  }
  return colors[status] || 'default'
}

// 获取船舶状态文本
const getBoatStatusText = (status: API.BoatStatus) => {
  const texts = {
    available: '可用',
    in_use: '使用中',
    maintenance: '维修中',
    out_of_service: '停用'
  }
  return texts[status] || status
}

// 格式化尺寸
const formatDimensions = (length?: string | null, width?: string | null) => {
  if (length && width) {
    return `${length}m × ${width}m`
  } else if (length) {
    return `长 ${length}m`
  } else if (width) {
    return `宽 ${width}m`
  }
  return '未设置'
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
.admin-boats {
  /* 继承AdminTable样式 */
}

.boat-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.boat-details {
  display: flex;
  flex-direction: column;
}

.boat-name {
  font-weight: 500;
  color: #333;
}

.boat-registration {
  font-size: 12px;
  color: #666;
}

.price {
  color: #52c41a;
  font-weight: 500;
}

.text-muted {
  color: #999;
}

.boat-detail {
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

.detail-section p {
  margin: 0;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 6px;
  color: #595959;
  line-height: 1.5;
}
</style>
