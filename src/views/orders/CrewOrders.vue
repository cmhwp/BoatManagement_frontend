<template>
  <div class="crew-orders-page">
    <div class="page-header">
      <h2>我的工作订单</h2>
      <a-button type="primary" @click="fetchOrders">
        <refresh-icon size="16" />
        刷新订单
      </a-button>
    </div>

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
              <a-select-option value="confirmed">已确认</a-select-option>
              <a-select-option value="in_progress">进行中</a-select-option>
              <a-select-option value="completed">已完成</a-select-option>
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
          <a-empty v-if="orders.length === 0" description="暂无工作订单" />

          <div v-else>
            <a-card
              v-for="order in orders"
              :key="order.id"
              class="order-card"
              :class="{ urgent: isUrgentOrder(order) }"
              :bordered="false"
            >
              <div class="order-header">
                <div class="order-info">
                  <span class="order-number">订单号：{{ order.order_no }}</span>
                  <span class="order-time">{{ formatTime(order.created_at) }}</span>
                  <a-tag v-if="isUrgentOrder(order)" color="red" size="small">紧急</a-tag>
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
                    <p class="customer">
                      <user-icon size="14" />
                      客户：{{ order.user_name || '-' }}
                    </p>
                    <p v-if="order.merchant_name" class="merchant">
                      <shop-icon size="14" />
                      服务商：{{ order.merchant_name }}
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
                    v-if="canStartService(order.status)"
                    size="small"
                    type="primary"
                    @click="updateOrderStatus(order, 'in_progress')"
                  >
                    开始服务
                  </a-button>

                  <a-button
                    v-if="canCompleteService(order.status)"
                    size="small"
                    type="primary"
                    @click="showCompleteModal(order)"
                  >
                    完成服务
                  </a-button>

                  <a-button
                    v-if="order.status === 'in_progress'"
                    size="small"
                    @click="showLocationModal(order)"
                  >
                    更新位置
                  </a-button>
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
          <a-descriptions-item label="服务商">
            {{ selectedOrder.merchant_name || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="订单金额">
            ¥{{ selectedOrder.total_price }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>

    <!-- 完成服务Modal -->
    <a-modal
      v-model:open="completeModalVisible"
      title="完成服务"
      @ok="confirmCompleteService"
      :confirm-loading="completing"
    >
      <div>
        <p>确认完成服务？</p>
        <a-form layout="vertical">
          <a-form-item label="服务完成备注">
            <a-textarea
              v-model:value="completeForm.notes"
              :rows="3"
              placeholder="请输入服务完成情况说明（可选）"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 位置更新Modal -->
    <a-modal
      v-model:open="locationModalVisible"
      title="更新位置信息"
      @ok="confirmUpdateLocation"
      :confirm-loading="updatingLocation"
    >
      <div>
        <a-form layout="vertical">
          <a-form-item label="当前位置" required>
            <a-input
              v-model:value="locationForm.location"
              placeholder="请输入当前位置"
            />
          </a-form-item>
          <a-form-item label="位置备注">
            <a-textarea
              v-model:value="locationForm.notes"
              :rows="2"
              placeholder="位置相关备注（可选）"
            />
          </a-form-item>
        </a-form>
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
  Shop as ShopIcon
} from '@icon-park/vue-next'
import {
  getMyCrewOrdersApiV1OrdersCrewMyGet,
  updateCrewOrderStatusApiV1OrdersCrewOrderIdStatusPut
} from '@/services/api/order'

// 响应式数据
const loading = ref(false)
const orders = ref<API.OrderListResponse[]>([])
const total = ref(0)
const detailModalVisible = ref(false)
const completeModalVisible = ref(false)
const locationModalVisible = ref(false)
const selectedOrder = ref<API.OrderListResponse | null>(null)
const completing = ref(false)
const updatingLocation = ref(false)

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

// 完成服务表单
const completeForm = reactive({
  notes: ''
})

// 位置更新表单
const locationForm = reactive({
  location: '',
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

    const response = await getMyCrewOrdersApiV1OrdersCrewMyGet(params)

    if (response.data?.success) {
      orders.value = response.data.data || []
      total.value = orders.value.length
    }
  } catch (error) {
    message.error('获取工作订单失败')
  } finally {
    loading.value = false
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    confirmed: '已确认',
    in_progress: '进行中',
    completed: '已完成',
    awaiting_review: '待评价'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    confirmed: 'green',
    in_progress: 'processing',
    completed: 'success',
    awaiting_review: 'purple'
  }
  return colorMap[status] || 'default'
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const isUrgentOrder = (order: API.OrderListResponse) => {
  // 判断是否为紧急订单：距离预约时间不到2小时
  const scheduledTime = dayjs(order.scheduled_at)
  const now = dayjs()
  const hoursUntilService = scheduledTime.diff(now, 'hour')
  return hoursUntilService <= 2 && hoursUntilService > 0 && order.status === 'confirmed'
}

const canStartService = (status: string) => {
  return status === 'confirmed'
}

const canCompleteService = (status: string) => {
  return status === 'in_progress'
}

const viewOrderDetail = (order: API.OrderListResponse) => {
  selectedOrder.value = order
  detailModalVisible.value = true
}

const updateOrderStatus = async (order: API.OrderListResponse, status: string) => {
  try {
    const response = await updateCrewOrderStatusApiV1OrdersCrewOrderIdStatusPut(
      { order_id: order.id },
      { status: status as any }
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

const showCompleteModal = (order: API.OrderListResponse) => {
  selectedOrder.value = order
  completeForm.notes = ''
  completeModalVisible.value = true
}

const confirmCompleteService = async () => {
  if (!selectedOrder.value) return

  try {
    completing.value = true

    const response = await updateCrewOrderStatusApiV1OrdersCrewOrderIdStatusPut(
      { order_id: selectedOrder.value.id },
      {
        status: 'completed',
        notes: completeForm.notes || undefined
      }
    )

    if (response.data?.success) {
      message.success('服务已完成')
      completeModalVisible.value = false
      await fetchOrders()
    } else {
      message.error(response.data?.message || '操作失败')
    }
  } catch (error: any) {
    message.error(error.message || '操作失败')
  } finally {
    completing.value = false
  }
}

const showLocationModal = (order: API.OrderListResponse) => {
  selectedOrder.value = order
  Object.assign(locationForm, {
    location: '',
    notes: ''
  })
  locationModalVisible.value = true
}

const confirmUpdateLocation = async () => {
  if (!selectedOrder.value || !locationForm.location) {
    message.error('请输入位置信息')
    return
  }

  try {
    updatingLocation.value = true

    // TODO: 调用更新位置的API
    // 这里应该有一个更新船艇位置的接口
    message.success('位置信息已更新')
    locationModalVisible.value = false
  } catch (error: any) {
    message.error(error.message || '位置更新失败')
  } finally {
    updatingLocation.value = false
  }
}

// 生命周期
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.crew-orders-page {
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
  transition: all 0.3s;
}

.order-card.urgent {
  border-color: #ff4d4f;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.2);
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
