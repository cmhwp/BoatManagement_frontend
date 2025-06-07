<template>
  <div class="my-orders-page">
    <div class="page-header">
      <h2>我的订单</h2>
      <a-button type="primary" @click="goToBooking">
        <plus-icon size="16" />
        新建预约
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
                    <p v-if="order.merchant_name" class="merchant">
                      <shop-icon size="14" />
                      服务商：{{ order.merchant_name }}
                    </p>
                    <p v-if="order.crew_name" class="crew">
                      <user-icon size="14" />
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
                    v-if="canCancelOrder(order.status)"
                    size="small"
                    danger
                    @click="showCancelModal(order)"
                  >
                    取消订单
                  </a-button>

                  <a-button
                    v-if="canPayOrder(order.status)"
                    size="small"
                    type="primary"
                    @click="payOrder(order)"
                  >
                    立即付款
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
          <a-descriptions-item label="服务商">
            {{ selectedOrder.merchant_name || '-' }}
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

    <!-- 取消订单Modal -->
    <a-modal
      v-model:open="cancelModalVisible"
      title="取消订单"
      @ok="confirmCancelOrder"
      :confirm-loading="cancelling"
    >
      <div>
        <p>确定要取消订单吗？</p>
        <a-form-item label="取消原因">
          <a-textarea
            v-model:value="cancelReason"
            :rows="3"
            placeholder="请输入取消原因（可选）"
          />
        </a-form-item>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Plus as PlusIcon,
  Time as ClockIcon,
  Shop as ShopIcon,
  User as UserIcon
} from '@icon-park/vue-next'
import {
  getMyOrdersApiV1OrdersMyGet,
  getMyOrderDetailApiV1OrdersMyOrderIdGet,
  cancelMyOrderApiV1OrdersMyOrderIdCancelPost
} from '@/services/api/order'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const orders = ref<API.OrderListResponse[]>([])
const total = ref(0)
const detailModalVisible = ref(false)
const cancelModalVisible = ref(false)
const selectedOrder = ref<API.OrderListResponse | null>(null)
const cancelling = ref(false)
const cancelReason = ref('')

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

    const response = await getMyOrdersApiV1OrdersMyGet(params)

    if (response.data?.success) {
      orders.value = response.data.data || []
      // 注意：这里可能需要根据后端返回的数据结构调整
      total.value = orders.value.length // 临时方案，实际应该从响应中获取总数
    }
  } catch (error) {
    message.error('获取订单列表失败')
  } finally {
    loading.value = false
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

const canCancelOrder = (status: string) => {
  return ['pending', 'paid', 'pending_assignment'].includes(status)
}

const canPayOrder = (status: string) => {
  return status === 'pending'
}

const goToBooking = () => {
  router.push('/orders/booking')
}

const viewOrderDetail = async (order: API.OrderListResponse) => {
  selectedOrder.value = order
  detailModalVisible.value = true
}

const showCancelModal = (order: API.OrderListResponse) => {
  selectedOrder.value = order
  cancelReason.value = ''
  cancelModalVisible.value = true
}

const confirmCancelOrder = async () => {
  if (!selectedOrder.value) return

  try {
    cancelling.value = true

    const response = await cancelMyOrderApiV1OrdersMyOrderIdCancelPost({
      order_id: selectedOrder.value.id,
      reason: cancelReason.value || undefined
    })

    if (response.data?.success) {
      message.success('订单已取消')
      cancelModalVisible.value = false
      await fetchOrders()
    } else {
      message.error(response.data?.message || '取消订单失败')
    }
  } catch (error: any) {
    message.error(error.message || '取消订单失败')
  } finally {
    cancelling.value = false
  }
}

const payOrder = (order: API.OrderListResponse) => {
  // TODO: 实现支付功能
  message.info('支付功能开发中...')
}

// 生命周期
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.my-orders-page {
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
