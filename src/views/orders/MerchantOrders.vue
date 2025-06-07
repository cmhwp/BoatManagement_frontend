<template>
  <div class="merchant-orders-page">
    <div class="page-header">
      <h2>商家订单管理</h2>
      <a-button type="primary" @click="fetchStats">
        <refresh-icon size="16" />
        刷新数据
      </a-button>
    </div>

    <!-- 统计卡片 -->
    <a-row :gutter="16" class="stats-cards">
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="总订单数" :value="stats.total_orders || 0" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="待派单" :value="stats.pending_assignment_orders || 0" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="进行中" :value="stats.in_progress_orders || 0" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="总营收"
            :value="Number(stats.total_revenue || 0)"
            precision="2"
            prefix="¥"
          />
        </a-card>
      </a-col>
    </a-row>

    <a-card :bordered="false">
      <!-- 筛选器 -->
      <div class="filters">
        <a-row :gutter="16" align="middle">
          <a-col :span="4">
            <a-select
              v-model:value="filters.status"
              placeholder="订单状态"
              allow-clear
              @change="fetchOrders"
            >
              <a-select-option value="pending">待付款</a-select-option>
              <a-select-option value="paid">已付款</a-select-option>
              <a-select-option value="pending_assignment">待派单</a-select-option>
              <a-select-option value="confirmed">已确认</a-select-option>
              <a-select-option value="in_progress">进行中</a-select-option>
              <a-select-option value="completed">已完成</a-select-option>
              <a-select-option value="cancelled">已取消</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-range-picker
              v-model:value="filters.dateRange"
              format="YYYY-MM-DD"
              placeholder="选择日期范围"
              @change="fetchOrders"
            />
          </a-col>
          <a-col :span="4">
            <a-input-search
              v-model:value="filters.search"
              placeholder="搜索订单"
              enter-button
              @search="fetchOrders"
            />
          </a-col>
        </a-row>
      </div>

      <!-- 订单列表 -->
      <a-spin :spinning="loading">
        <div class="orders-list">
          <a-empty v-if="orders.length === 0" description="暂无订单" />

          <div v-else>
            <a-card
              v-for="order in orders"
              :key="order.id"
              class="order-card"
              :bordered="false"
            >
              <div class="order-header">
                <div class="order-info">
                  <span class="order-number">订单号：{{ order.order_no }}</span>
                  <span class="order-time">{{ formatTime(order.created_at) }}</span>
                </div>
                <a-tag :color="getStatusColor(order.status)">
                  {{ getStatusText(order.status) }}
                </a-tag>
              </div>

              <div class="order-content">
                <div class="order-main">
                  <div class="service-info">
                    <h4>{{ order.service_name || '船艇服务' }}</h4>
                    <p class="scheduled-time">
                      <clock-icon size="14" />
                      预约时间：{{ formatTime(order.scheduled_at) }}
                    </p>
                    <p class="user">
                      <user-icon size="14" />
                      客户：{{ order.user_name || '-' }}
                    </p>
                    <p v-if="order.crew_name" class="crew">
                      <team-icon size="14" />
                      船员：{{ order.crew_name }}
                    </p>
                  </div>

                  <div class="order-price">
                    <span class="amount">¥{{ order.total_price }}</span>
                  </div>
                </div>

                <div class="order-actions">
                  <a-button size="small" @click="viewOrderDetail(order)">
                    查看详情
                  </a-button>

                  <a-button
                    v-if="canAssignCrew(order.status)"
                    size="small"
                    type="primary"
                    @click="showAssignModal(order)"
                  >
                    派单
                  </a-button>

                  <a-dropdown v-if="canUpdateStatus(order.status)">
                    <a-button size="small">
                      更新状态
                      <down-icon size="12" />
                    </a-button>
                    <template #overlay>
                      <a-menu @click="handleStatusUpdate($event, order)">
                        <a-menu-item v-if="order.status === 'paid'" key="pending_assignment">
                          设为待派单
                        </a-menu-item>
                        <a-menu-item v-if="order.status === 'pending_assignment'" key="confirmed">
                          确认订单
                        </a-menu-item>
                        <a-menu-item v-if="order.status === 'confirmed'" key="in_progress">
                          开始服务
                        </a-menu-item>
                        <a-menu-item v-if="order.status === 'in_progress'" key="completed">
                          完成服务
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>
            </a-card>
          </div>
        </div>
      </a-spin>

      <!-- 分页 -->
      <div v-if="total > 0" class="pagination">
        <a-pagination
          v-model:current="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          show-size-changer
          show-quick-jumper
          show-total
          @change="fetchOrders"
          @show-size-change="fetchOrders"
        />
      </div>
    </a-card>

    <!-- 派单Modal -->
    <a-modal
      v-model:open="assignModalVisible"
      title="派单给船员"
      @ok="confirmAssignCrew"
      :confirm-loading="assigning"
      width="600px"
    >
      <div v-if="selectedOrder">
        <a-descriptions title="订单信息" :column="2" size="small" style="margin-bottom: 16px;">
          <a-descriptions-item label="订单号">{{ selectedOrder.order_no }}</a-descriptions-item>
          <a-descriptions-item label="服务">{{ selectedOrder.service_name }}</a-descriptions-item>
          <a-descriptions-item label="预约时间">{{ formatTime(selectedOrder.scheduled_at) }}</a-descriptions-item>
          <a-descriptions-item label="客户">{{ selectedOrder.user_name }}</a-descriptions-item>
        </a-descriptions>

        <a-form layout="vertical">
          <a-form-item label="选择船员" required>
            <a-spin :spinning="crewsLoading">
              <a-select
                v-model:value="assignForm.crewId"
                placeholder="请选择船员"
                @change="handleCrewChange"
              >
                <a-select-option
                  v-for="crew in availableCrews"
                  :key="crew.id"
                  :value="crew.id"
                >
                  {{ crew.user_name || `船员${crew.id}` }} - {{ crew.license_type || '无证书' }}
                </a-select-option>
              </a-select>
            </a-spin>
          </a-form-item>

          <a-form-item label="指定船艇（可选）">
            <a-select
              v-model:value="assignForm.boatId"
              placeholder="请选择船艇"
              allow-clear
            >
              <a-select-option value="1">船艇1 - 观光船</a-select-option>
              <a-select-option value="2">船艇2 - 快艇</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="派单备注">
            <a-textarea
              v-model:value="assignForm.notes"
              :rows="3"
              placeholder="请输入派单备注（可选）"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 订单详情Modal -->
    <a-modal
      v-model:open="detailModalVisible"
      title="订单详情"
      width="800px"
      :footer="null"
    >
      <div v-if="selectedOrder" class="order-detail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="订单号" :span="2">
            {{ selectedOrder.order_no }}
          </a-descriptions-item>
          <a-descriptions-item label="订单状态">
            <a-tag :color="getStatusColor(selectedOrder.status)">
              {{ getStatusText(selectedOrder.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ formatTime(selectedOrder.created_at) }}
          </a-descriptions-item>
          <a-descriptions-item label="服务名称">
            {{ selectedOrder.service_name || '船艇服务' }}
          </a-descriptions-item>
          <a-descriptions-item label="预约时间">
            {{ formatTime(selectedOrder.scheduled_at) }}
          </a-descriptions-item>
          <a-descriptions-item label="客户">
            {{ selectedOrder.user_name || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="船员">
            {{ selectedOrder.crew_name || '待分配' }}
          </a-descriptions-item>
          <a-descriptions-item label="订单金额">
            ¥{{ selectedOrder.total_price }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Refresh as RefreshIcon,
  Time as ClockIcon,
  User as UserIcon,
  Team as TeamIcon,
  Down as DownIcon
} from '@icon-park/vue-next'
import {
  getMerchantOrdersApiV1OrdersMerchantGet,
  assignCrewToOrderApiV1OrdersMerchantOrderIdAssignCrewPost,
  updateMerchantOrderStatusApiV1OrdersMerchantOrderIdStatusPut,
  getAvailableCrewsForOrderApiV1OrdersMerchantOrderIdAvailableCrewsGet,
  getMerchantOrderStatsApiV1OrdersMerchantStatsGet
} from '@/services/api/order'

// 响应式数据
const loading = ref(false)
const orders = ref<API.OrderListResponse[]>([])
const total = ref(0)
const stats = ref<API.OrderStats>({})
const detailModalVisible = ref(false)
const assignModalVisible = ref(false)
const selectedOrder = ref<API.OrderListResponse | null>(null)
const assigning = ref(false)
const crewsLoading = ref(false)
const availableCrews = ref<any[]>([])

// 筛选条件
const filters = reactive({
  status: undefined as string | undefined,
  dateRange: undefined as [Dayjs, Dayjs] | undefined,
  search: undefined as string | undefined
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10
})

// 派单表单
const assignForm = reactive({
  crewId: undefined as number | undefined,
  boatId: undefined as number | undefined,
  notes: ''
})

// 方法
const fetchOrders = async () => {
  try {
    loading.value = true

    const params: any = {
      skip: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize
    }

    if (filters.status) {
      params.status = filters.status
    }

    const response = await getMerchantOrdersApiV1OrdersMerchantGet(params)

    if (response.data?.success) {
      orders.value = response.data.data || []
      total.value = orders.value.length
    }
  } catch (error) {
    message.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await getMerchantOrderStatsApiV1OrdersMerchantStatsGet()
    if (response.data?.success) {
      stats.value = response.data.data || {}
    }
  } catch (error) {
    message.error('获取统计数据失败')
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待付款',
    paid: '已付款',
    pending_assignment: '待派单',
    confirmed: '已确认',
    in_progress: '进行中',
    completed: '已完成',
    awaiting_review: '待评价',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    paid: 'blue',
    pending_assignment: 'cyan',
    confirmed: 'green',
    in_progress: 'processing',
    completed: 'success',
    awaiting_review: 'purple',
    cancelled: 'default',
    refunded: 'red'
  }
  return colorMap[status] || 'default'
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const canAssignCrew = (status: string) => {
  return ['paid', 'pending_assignment'].includes(status)
}

const canUpdateStatus = (status: string) => {
  return ['paid', 'pending_assignment', 'confirmed', 'in_progress'].includes(status)
}

const viewOrderDetail = (order: API.OrderListResponse) => {
  selectedOrder.value = order
  detailModalVisible.value = true
}

const showAssignModal = async (order: API.OrderListResponse) => {
  selectedOrder.value = order

  // 重置表单
  Object.assign(assignForm, {
    crewId: undefined,
    boatId: undefined,
    notes: ''
  })

  // 获取可用船员
  await fetchAvailableCrews(order.id)
  assignModalVisible.value = true
}

const fetchAvailableCrews = async (orderId: number) => {
  try {
    crewsLoading.value = true
    const response = await getAvailableCrewsForOrderApiV1OrdersMerchantOrderIdAvailableCrewsGet({
      order_id: orderId
    })

    if (response.data?.success) {
      availableCrews.value = response.data.data || []
    }
  } catch (error) {
    message.error('获取可用船员失败')
  } finally {
    crewsLoading.value = false
  }
}

const handleCrewChange = (crewId: number) => {
  // TODO: 根据选择的船员获取可用船艇
}

const confirmAssignCrew = async () => {
  if (!selectedOrder.value || !assignForm.crewId) {
    message.error('请选择船员')
    return
  }

  try {
    assigning.value = true

    const response = await assignCrewToOrderApiV1OrdersMerchantOrderIdAssignCrewPost(
      { order_id: selectedOrder.value.id },
      {
        crew_id: assignForm.crewId,
        boat_id: assignForm.boatId || undefined,
        notes: assignForm.notes || undefined
      }
    )

    if (response.data?.success) {
      message.success('派单成功')
      assignModalVisible.value = false
      await fetchOrders()
    } else {
      message.error(response.data?.message || '派单失败')
    }
  } catch (error: any) {
    message.error(error.message || '派单失败')
  } finally {
    assigning.value = false
  }
}

const handleStatusUpdate = async ({ key }: { key: string }, order: API.OrderListResponse) => {
  try {
    const response = await updateMerchantOrderStatusApiV1OrdersMerchantOrderIdStatusPut(
      { order_id: order.id },
      { status: key as any }
    )

    if (response.data?.success) {
      message.success('状态更新成功')
      await fetchOrders()
    } else {
      message.error(response.data?.message || '状态更新失败')
    }
  } catch (error: any) {
    message.error(error.message || '状态更新失败')
  }
}

// 生命周期
onMounted(() => {
  fetchOrders()
  fetchStats()
})
</script>

<style scoped>
.merchant-orders-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
}

.stats-cards {
  margin-bottom: 24px;
}

.filters {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.orders-list {
  margin-bottom: 24px;
}

.order-card {
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.order-number {
  font-weight: bold;
  color: #1890ff;
}

.order-time {
  color: #666;
  font-size: 12px;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.order-main {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-info h4 {
  margin: 0 0 8px 0;
  color: #262626;
}

.service-info p {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.scheduled-time {
  color: #1890ff !important;
}

.order-price {
  text-align: right;
}

.amount {
  font-size: 18px;
  font-weight: bold;
  color: #f5222d;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.order-detail {
  margin-top: 16px;
}
</style>
