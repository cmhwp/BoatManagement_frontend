<template>
  <div class="booking-page">
    <a-card title="预约服务" :bordered="false">
      <a-steps :current="currentStep" class="booking-steps">
        <a-step title="选择服务" />
        <a-step title="填写信息" />
        <a-step title="确认预约" />
        <a-step title="完成预约" />
      </a-steps>

      <!-- 步骤1: 选择服务 -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="service-filters">
          <a-row :gutter="[16, 16]" class="filter-row">
            <a-col :span="6">
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
            <a-col :span="6">
              <a-input
                v-model:value="filters.location"
                placeholder="服务地点"
                allow-clear
                @change="handleFilterChange"
              />
            </a-col>
            <a-col :span="6">
              <a-input-search
                v-model:value="filters.search"
                placeholder="搜索服务"
                enter-button
                @search="handleFilterChange"
              />
            </a-col>
          </a-row>
        </div>

        <a-spin :spinning="servicesLoading">
          <div class="services-grid">
            <a-row :gutter="[16, 16]">
              <a-col
                v-for="service in availableServices"
                :key="service.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
              >
                <a-card
                  hoverable
                  :class="['service-card', { selected: selectedService?.id === service.id }]"
                  @click="selectService(service)"
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
                        <p class="service-type">{{ getServiceTypeText(service.service_type) }}</p>
                        <p class="service-price">¥{{ service.base_price }}/次</p>
                        <p v-if="service.duration" class="service-duration">
                          时长：{{ service.duration }}分钟
                        </p>
                        <p v-if="service.max_participants" class="service-capacity">
                          最多{{ service.max_participants }}人
                        </p>
                        <p v-if="service.location" class="service-location">
                          <environment-icon size="14" />
                          {{ service.location }}
                        </p>
                      </div>
                    </template>
                  </a-card-meta>
                </a-card>
              </a-col>
            </a-row>
          </div>
        </a-spin>

        <div class="step-actions">
          <a-button type="primary" :disabled="!selectedService" @click="nextStep">
            下一步
          </a-button>
        </div>
      </div>

      <!-- 步骤2: 填写信息 -->
      <div v-if="currentStep === 1" class="step-content">
        <a-row :gutter="24">
          <a-col :span="12">
            <div class="selected-service-info">
              <h3>已选择服务</h3>
              <a-card size="small">
                <div class="service-summary">
                  <h4>{{ selectedService?.name }}</h4>
                  <p>价格：¥{{ selectedService?.base_price }}/次</p>
                  <p v-if="selectedService?.duration">时长：{{ selectedService.duration }}分钟</p>
                  <p v-if="selectedService?.location">地点：{{ selectedService.location }}</p>
                </div>
              </a-card>
            </div>
          </a-col>
          <a-col :span="12">
            <a-form
              ref="bookingFormRef"
              :model="bookingForm"
              :rules="bookingRules"
              layout="vertical"
            >
              <a-form-item label="预约时间" name="scheduledAt" required>
                <a-date-picker
                  v-model:value="bookingForm.scheduledAt"
                  show-time
                  format="YYYY-MM-DD HH:mm"
                  :disabled-date="disabledDate"
                  :disabled-time="disabledTime"
                  placeholder="选择预约时间"
                  style="width: 100%"
                />
              </a-form-item>

              <a-form-item label="参与人数" name="participants" required>
                <a-input-number
                  v-model:value="bookingForm.participants"
                  :min="selectedService?.min_participants || 1"
                  :max="selectedService?.max_participants || 999"
                  placeholder="请输入人数"
                  style="width: 100%"
                />
              </a-form-item>

              <a-form-item label="联系人姓名" name="contactName" required>
                <a-input
                  v-model:value="bookingForm.contactName"
                  placeholder="请输入联系人姓名"
                />
              </a-form-item>

              <a-form-item label="联系电话" name="contactPhone" required>
                <a-input
                  v-model:value="bookingForm.contactPhone"
                  placeholder="请输入联系电话"
                />
              </a-form-item>

              <a-form-item label="特殊需求" name="specialRequirements">
                <a-textarea
                  v-model:value="bookingForm.specialRequirements"
                  :rows="3"
                  placeholder="请输入特殊需求（可选）"
                />
              </a-form-item>

              <a-form-item label="备注" name="notes">
                <a-textarea
                  v-model:value="bookingForm.notes"
                  :rows="3"
                  placeholder="请输入备注（可选）"
                />
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>

        <div class="step-actions">
          <a-button @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </div>

      <!-- 步骤3: 确认预约 -->
      <div v-if="currentStep === 2" class="step-content">
        <a-descriptions title="预约信息确认" :column="2" bordered>
          <a-descriptions-item label="服务名称">
            {{ selectedService?.name }}
          </a-descriptions-item>
          <a-descriptions-item label="服务类型">
            {{ getServiceTypeText(selectedService?.service_type) }}
          </a-descriptions-item>
          <a-descriptions-item label="预约时间">
            {{ formatDateTime(bookingForm.scheduledAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="参与人数">
            {{ bookingForm.participants }}人
          </a-descriptions-item>
          <a-descriptions-item label="联系人">
            {{ bookingForm.contactName }}
          </a-descriptions-item>
          <a-descriptions-item label="联系电话">
            {{ bookingForm.contactPhone }}
          </a-descriptions-item>
          <a-descriptions-item label="服务费用">
            ¥{{ selectedService?.base_price }}
          </a-descriptions-item>
          <a-descriptions-item label="总金额">
            <span class="total-amount">¥{{ totalAmount }}</span>
          </a-descriptions-item>
          <a-descriptions-item v-if="bookingForm.specialRequirements" label="特殊需求" :span="2">
            {{ bookingForm.specialRequirements }}
          </a-descriptions-item>
          <a-descriptions-item v-if="bookingForm.notes" label="备注" :span="2">
            {{ bookingForm.notes }}
          </a-descriptions-item>
        </a-descriptions>

        <div class="step-actions">
          <a-button @click="prevStep">上一步</a-button>
          <a-button type="primary" :loading="submitting" @click="submitBooking">
            确认预约
          </a-button>
        </div>
      </div>

      <!-- 步骤4: 完成预约 -->
      <div v-if="currentStep === 3" class="step-content">
        <a-result
          status="success"
          title="预约成功！"
          sub-title="您的预约已提交，请等待商家确认。"
        >
          <template #extra>
            <a-button type="primary" @click="goToMyOrders">查看我的订单</a-button>
            <a-button @click="newBooking">继续预约</a-button>
          </template>
        </a-result>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import { Ship as ShipIcon, LocalTwo as EnvironmentIcon } from '@icon-park/vue-next'
import {
  getAvailableServicesApiV1ServicesAvailableGet,
  getServiceDetailApiV1ServicesServiceIdGet
} from '@/services/api/service'
import { createOrderApiV1OrdersPost } from '@/services/api/order'

const router = useRouter()

// 响应式数据
const currentStep = ref(0)
const servicesLoading = ref(false)
const submitting = ref(false)
const availableServices = ref<API.ServiceListResponse[]>([])
const selectedService = ref<API.ServiceListResponse | null>(null)

// 筛选条件
const filters = reactive({
  serviceType: undefined as string | undefined,
  location: undefined as string | undefined,
  search: undefined as string | undefined
})

// 预约表单
const bookingForm = reactive({
  scheduledAt: undefined as Dayjs | undefined,
  participants: 1,
  contactName: '',
  contactPhone: '',
  specialRequirements: '',
  notes: ''
})

const bookingFormRef = ref()

// 表单验证规则
const bookingRules = {
  scheduledAt: [{ required: true, message: '请选择预约时间' }],
  participants: [{ required: true, message: '请输入参与人数' }],
  contactName: [{ required: true, message: '请输入联系人姓名' }],
  contactPhone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
  ]
}

// 计算属性
const totalAmount = computed(() => {
  if (!selectedService.value) return 0
  return Number(selectedService.value.base_price) * bookingForm.participants
})

// 方法
const fetchAvailableServices = async () => {
  try {
    servicesLoading.value = true
    const response = await getAvailableServicesApiV1ServicesAvailableGet({
      service_type: filters.serviceType as any,
      location: filters.location,
      skip: 0,
      limit: 50
    })

    if (response.data?.success) {
      availableServices.value = response.data.data || []
    }
  } catch (error) {
    message.error('获取服务列表失败')
  } finally {
    servicesLoading.value = false
  }
}

const handleFilterChange = () => {
  fetchAvailableServices()
}

const selectService = (service: API.ServiceListResponse) => {
  selectedService.value = service
  // 重置参与人数为最小值
  bookingForm.participants = service.min_participants || 1
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

const disabledDate = (current: Dayjs) => {
  // 禁用过去的日期
  return current && current < dayjs().startOf('day')
}

const disabledTime = (current: Dayjs | null) => {
  // 如果是今天，禁用过去的小时
  if (current && current.isSame(dayjs(), 'day')) {
    const currentHour = dayjs().hour()
    return {
      disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === currentHour) {
          const currentMinute = dayjs().minute()
          return Array.from({ length: currentMinute }, (_, i) => i)
        }
        return []
      }
    }
  }
  return {}
}

const formatDateTime = (date: Dayjs | undefined) => {
  return date ? date.format('YYYY年MM月DD日 HH:mm') : ''
}

const nextStep = async () => {
  if (currentStep.value === 1) {
    // 验证表单
    try {
      await bookingFormRef.value.validate()
    } catch (error) {
      return
    }
  }
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const submitBooking = async () => {
  if (!selectedService.value || !bookingForm.scheduledAt) {
    message.error('信息不完整')
    return
  }

  try {
    submitting.value = true

    const orderData: API.OrderCreate = {
      order_type: 'service',
      service_id: selectedService.value.id,
      quantity: bookingForm.participants,
      participants: bookingForm.participants,
      scheduled_at: bookingForm.scheduledAt.toISOString(),
      contact_name: bookingForm.contactName,
      contact_phone: bookingForm.contactPhone,
      special_requirements: bookingForm.specialRequirements || undefined,
      notes: bookingForm.notes || undefined
    }

    const response = await createOrderApiV1OrdersPost(orderData)

    if (response.data?.success) {
      message.success('预约成功！')
      currentStep.value = 3
    } else {
      message.error(response.data?.message || '预约失败')
    }
  } catch (error: any) {
    message.error(error.message || '预约失败')
  } finally {
    submitting.value = false
  }
}

const goToMyOrders = () => {
  router.push('/orders/my')
}

const newBooking = () => {
  // 重置表单
  currentStep.value = 0
  selectedService.value = null
  Object.assign(bookingForm, {
    scheduledAt: undefined,
    participants: 1,
    contactName: '',
    contactPhone: '',
    specialRequirements: '',
    notes: ''
  })
}

// 生命周期
onMounted(() => {
  fetchAvailableServices()
})
</script>

<style scoped>
.booking-page {
  padding: 24px;
}

.booking-steps {
  margin-bottom: 32px;
}

.step-content {
  margin-top: 24px;
  min-height: 400px;
}

.service-filters {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.filter-row {
  margin: 0;
}

.services-grid {
  margin-top: 16px;
}

.service-card {
  cursor: pointer;
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.service-card.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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
  color: #666;
  margin-bottom: 4px;
}

.service-price {
  color: #f5222d;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.service-duration,
.service-capacity,
.service-location {
  color: #999;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.selected-service-info {
  margin-bottom: 24px;
}

.service-summary h4 {
  margin-bottom: 8px;
  color: #1890ff;
}

.service-summary p {
  margin-bottom: 4px;
  color: #666;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #f5222d;
}
</style>
