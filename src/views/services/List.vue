<template>
  <div class="services-list-page">
    <div class="page-header">
      <h2>服务列表</h2>
      <a-button type="primary" @click="goToBooking">
        <plus-icon size="16" />
        立即预约
      </a-button>
    </div>

    <a-card :bordered="false">
      <!-- 筛选器 -->
      <div class="filters">
        <a-row :gutter="[16, 16]" align="middle">
          <a-col :span="4">
            <a-select
              v-model:value="filters.serviceType"
              placeholder="服务类型"
              allow-clear
              @change="handleFilterChange"
            >
                              <a-select-option value="boat_tour">船艇观光</a-select-option>
                <a-select-option value="agriculture">农业体验</a-select-option>
                <a-select-option value="cultural">文化体验</a-select-option>
                <a-select-option value="fishing">渔业体验</a-select-option>
                <a-select-option value="dining">餐饮服务</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-input
              v-model:value="filters.location"
              placeholder="服务地点"
              allow-clear
              @change="handleFilterChange"
            />
          </a-col>
          <a-col :span="6">
            <a-slider
              v-model:value="filters.priceRange"
              range
              :min="0"
              :max="5000"
              :step="100"
              @change="handleFilterChange"
            />
            <div class="price-range-labels">
              <span>价格范围：¥{{ filters.priceRange[0] }} - ¥{{ filters.priceRange[1] }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <a-input-search
              v-model:value="filters.search"
              placeholder="搜索服务"
              enter-button
              @search="handleFilterChange"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              v-model:value="filters.sortBy"
              placeholder="排序方式"
              @change="handleFilterChange"
            >
              <a-select-option value="price_asc">价格升序</a-select-option>
              <a-select-option value="price_desc">价格降序</a-select-option>
              <a-select-option value="rating_desc">评分降序</a-select-option>
              <a-select-option value="orders_desc">订单量降序</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>

      <!-- 服务列表 -->
      <a-spin :spinning="loading">
        <div class="services-grid">
          <a-empty v-if="services.length === 0" description="暂无服务" />

          <a-row v-else :gutter="[16, 16]">
            <a-col
              v-for="service in services"
              :key="service.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
            >
              <a-card
                hoverable
                class="service-card"
                @click="viewServiceDetail(service)"
              >
                <template #cover>
                  <img
                    v-if="service.images"
                    :src="service.images"
                    :alt="service.name"
                    class="service-image"
                  />
                  <div v-else class="service-placeholder">
                    <ship-icon size="48" />
                  </div>
                </template>

                <a-card-meta :title="service.name">
                  <template #description>
                    <div class="service-info">
                      <p class="service-type">
                        <tag-icon size="14" />
                        {{ getServiceTypeText(service.service_type) }}
                      </p>
                      <p class="service-price">¥{{ service.base_price }}/次</p>
                      <p v-if="service.duration" class="service-duration">
                        <clock-icon size="14" />
                        时长：{{ service.duration }}分钟
                      </p>
                      <p v-if="service.max_participants" class="service-capacity">
                        <user-icon size="14" />
                        最多{{ service.max_participants }}人
                      </p>
                      <p v-if="service.location" class="service-location">
                        <environment-icon size="14" />
                        {{ service.location }}
                      </p>
                      <div v-if="service.average_rating" class="service-rating">
                        <a-rate :value="Number(service.average_rating)" disabled allow-half />
                        <span class="rating-text">{{ service.average_rating }}/5</span>
                        <span class="orders-count">({{ service.total_orders }}单)</span>
                      </div>
                      <p v-if="service.merchant_name" class="merchant-name">
                        <shop-icon size="14" />
                        {{ service.merchant_name }}
                      </p>
                    </div>
                  </template>
                </a-card-meta>

                <template #actions>
                  <a-button
                    type="primary"
                    size="small"
                    block
                    @click.stop="bookService(service)"
                  >
                    立即预约
                  </a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
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
          @change="fetchServices"
          @show-size-change="fetchServices"
        />
      </div>
    </a-card>

    <!-- 服务详情Modal -->
    <a-modal
      v-model:open="detailModalVisible"
      title="服务详情"
      width="800px"
      :footer="null"
    >
      <div v-if="selectedService" class="service-detail">
        <div class="detail-header">
          <div class="service-basic">
            <h3>{{ selectedService.name }}</h3>
            <p class="price">¥{{ selectedService.base_price }}/次</p>
            <a-tag color="blue">{{ getServiceTypeText(selectedService.service_type) }}</a-tag>
            <div v-if="selectedService.average_rating" class="rating">
              <a-rate :value="Number(selectedService.average_rating)" disabled allow-half />
              <span>{{ selectedService.average_rating }}/5 ({{ selectedService.total_orders }}单)</span>
            </div>
          </div>
          <div v-if="selectedService.images" class="service-image-large">
            <img :src="selectedService.images" :alt="selectedService.name" />
          </div>
        </div>

        <a-descriptions :column="2" bordered style="margin-top: 16px;">
          <a-descriptions-item v-if="selectedService.duration" label="服务时长">
            {{ selectedService.duration }}分钟
          </a-descriptions-item>
          <a-descriptions-item v-if="selectedService.max_participants" label="最大人数">
            {{ selectedService.max_participants }}人
          </a-descriptions-item>
          <a-descriptions-item v-if="selectedService.location" label="服务地点" :span="2">
            {{ selectedService.location }}
          </a-descriptions-item>
          <a-descriptions-item label="服务商">
            {{ selectedService.merchant_name || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="总订单数">
            {{ selectedService.total_orders }}单
          </a-descriptions-item>
        </a-descriptions>

        <div class="service-actions" style="margin-top: 24px; text-align: center;">
          <a-button type="primary" size="large" @click="bookService(selectedService)">
            立即预约此服务
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  Plus as PlusIcon,
  Ship as ShipIcon,
  Tag as TagIcon,
  Time as ClockIcon,
  User as UserIcon,
  LocalTwo as EnvironmentIcon,
  Shop as ShopIcon
} from '@icon-park/vue-next'
import {
  getServicesApiV1ServicesGet,
  getServiceDetailApiV1ServicesServiceIdGet
} from '@/services/api/service'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const services = ref<API.ServiceListResponse[]>([])
const total = ref(0)
const detailModalVisible = ref(false)
const selectedService = ref<API.ServiceListResponse | null>(null)

// 筛选条件
const filters = reactive({
  serviceType: undefined as string | undefined,
  location: undefined as string | undefined,
  priceRange: [0, 5000] as [number, number],
  search: undefined as string | undefined,
  sortBy: undefined as string | undefined
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 12
})

// 计算属性
const filteredServices = computed(() => {
  let result = [...services.value]

  // 价格筛选
  result = result.filter(service => {
    const price = Number(service.base_price)
    return price >= filters.priceRange[0] && price <= filters.priceRange[1]
  })

  // 排序
  if (filters.sortBy) {
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return Number(a.base_price) - Number(b.base_price)
        case 'price_desc':
          return Number(b.base_price) - Number(a.base_price)
        case 'rating_desc':
          return Number(b.average_rating || 0) - Number(a.average_rating || 0)
        case 'orders_desc':
          return (b.total_orders || 0) - (a.total_orders || 0)
        default:
          return 0
      }
    })
  }

  return result
})

// 方法
const fetchServices = async () => {
  try {
    loading.value = true

    const params: any = {
      skip: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize
    }

    if (filters.serviceType) {
      params.service_type = filters.serviceType
    }

    if (filters.location) {
      params.location = filters.location
    }

    if (filters.search) {
      params.search = filters.search
    }

    const response = await getServicesApiV1ServicesGet(params)

    if (response.data?.success) {
      services.value = response.data.data || []
      total.value = services.value.length
    }
  } catch (error) {
    message.error('获取服务列表失败')
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  pagination.page = 1
  fetchServices()
}

const getServiceTypeText = (type: string | undefined) => {
  const typeMap: Record<string, string> = {
    boat_tour: '船艇观光',
    agriculture: '农业体验',
    cultural: '文化体验',
    fishing: '渔业体验',
    dining: '餐饮服务'
  }
  return typeMap[type || ''] || type || ''
}

const viewServiceDetail = async (service: API.ServiceListResponse) => {
  try {
    selectedService.value = service
    detailModalVisible.value = true
  } catch (error) {
    message.error('获取服务详情失败')
  }
}

const bookService = (service: API.ServiceListResponse) => {
  // 跳转到预约页面并传递服务ID
  router.push({
    path: '/orders/booking',
    query: { serviceId: service.id }
  })
}

const goToBooking = () => {
  router.push('/orders/booking')
}

// 生命周期
onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.services-list-page {
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

.price-range-labels {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.services-grid {
  margin-bottom: 24px;
}

.service-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.service-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.service-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f5f5f5;
  color: #999;
}

.service-info {
  font-size: 12px;
}

.service-type {
  color: #1890ff;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.service-price {
  color: #f5222d;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.service-duration,
.service-capacity,
.service-location,
.merchant-name {
  color: #666;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.service-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.orders-count {
  font-size: 11px;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.service-detail {
  padding: 16px 0;
}

.detail-header {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.service-basic {
  flex: 1;
}

.service-basic h3 {
  margin: 0 0 8px 0;
  color: #262626;
}

.service-basic .price {
  font-size: 18px;
  font-weight: bold;
  color: #f5222d;
  margin: 8px 0;
}

.service-basic .rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.service-image-large {
  width: 200px;
  flex-shrink: 0;
}

.service-image-large img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
}
</style>
