<template>
  <div class="my-services-page">
    <div class="page-header">
      <h2>我的服务</h2>
      <a-button type="primary" @click="showCreateModal">
        <plus-icon size="16" />
        创建服务
      </a-button>
    </div>

    <a-card :bordered="false">
      <!-- 筛选器 -->
      <div class="filters">
        <a-row :gutter="16" align="middle">
          <a-col :span="4">
            <a-select
              v-model:value="filters.status"
              placeholder="服务状态"
              allow-clear
              @change="fetchServices"
            >
              <a-select-option value="active">激活</a-select-option>
              <a-select-option value="inactive">禁用</a-select-option>
              <a-select-option value="draft">草稿</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-select
              v-model:value="filters.serviceType"
              placeholder="服务类型"
              allow-clear
              @change="fetchServices"
            >
              <a-select-option value="boat_tour">船艇观光</a-select-option>
              <a-select-option value="agriculture">农业体验</a-select-option>
              <a-select-option value="cultural">文化体验</a-select-option>
              <a-select-option value="fishing">渔业体验</a-select-option>
              <a-select-option value="dining">餐饮服务</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-input-search
              v-model:value="filters.search"
              placeholder="搜索服务"
              enter-button
              @search="fetchServices"
            />
          </a-col>
        </a-row>
      </div>

      <!-- 服务列表 -->
      <a-spin :spinning="loading">
        <div class="services-list">
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
              <a-card hoverable class="service-card">
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
                      <p class="service-status">
                        <a-tag :color="getStatusColor(service.status)">
                          {{ getStatusText(service.status) }}
                        </a-tag>
                      </p>
                      <div v-if="service.average_rating" class="service-rating">
                        <a-rate :value="Number(service.average_rating)" disabled allow-half />
                        <span class="rating-text">{{ service.average_rating }}/5</span>
                      </div>
                      <p class="orders-count">
                        <chart-icon size="14" />
                        {{ service.total_orders }}个订单
                      </p>
                    </div>
                  </template>
                </a-card-meta>

                <template #actions>
                  <a-tooltip title="编辑">
                    <edit-icon @click="showEditModal(service)" />
                  </a-tooltip>
                  <a-tooltip title="删除">
                    <delete-icon @click="deleteService(service)" />
                  </a-tooltip>
                  <a-dropdown>
                    <more-icon />
                    <template #overlay>
                      <a-menu @click="handleMenuClick($event, service)">
                        <a-menu-item v-if="service.status === 'active'" key="disable">
                          禁用服务
                        </a-menu-item>
                        <a-menu-item v-if="service.status === 'inactive'" key="enable">
                          启用服务
                        </a-menu-item>
                        <a-menu-item key="view-orders">
                          查看订单
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
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

    <!-- 创建/编辑服务Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑服务' : '创建服务'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      width="800px"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="服务名称" name="name" required>
              <a-input v-model:value="form.name" placeholder="请输入服务名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务类型" name="service_type" required>
              <a-select v-model:value="form.service_type" placeholder="选择服务类型">
                <a-select-option value="boat_tour">船艇观光</a-select-option>
                <a-select-option value="agriculture">农业体验</a-select-option>
                <a-select-option value="cultural">文化体验</a-select-option>
                <a-select-option value="fishing">渔业体验</a-select-option>
                <a-select-option value="dining">餐饮服务</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="服务描述" name="description">
          <a-textarea
            v-model:value="form.description"
            :rows="3"
            placeholder="请输入服务描述"
          />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="基础价格" name="base_price" required>
              <a-input-number
                v-model:value="form.base_price"
                :min="0"
                :precision="2"
                placeholder="价格"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="服务时长(分钟)" name="duration">
              <a-input-number
                v-model:value="form.duration"
                :min="1"
                placeholder="时长"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="最大人数" name="max_participants">
              <a-input-number
                v-model:value="form.max_participants"
                :min="1"
                placeholder="最大人数"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="服务地点" name="location">
              <a-input v-model:value="form.location" placeholder="请输入服务地点" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务状态" name="status" required>
              <a-select v-model:value="form.status" placeholder="选择状态">
                <a-select-option value="active">激活</a-select-option>
                <a-select-option value="inactive">禁用</a-select-option>
                <a-select-option value="draft">草稿</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="服务要求" name="requirements">
          <a-textarea
            v-model:value="form.requirements"
            :rows="3"
            placeholder="请输入服务要求（可选）"
          />
        </a-form-item>

        <a-form-item label="包含项目" name="included_items">
          <a-textarea
            v-model:value="form.included_items"
            :rows="3"
            placeholder="请输入包含的项目（可选）"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  Plus as PlusIcon,
  Ship as ShipIcon,
  Tag as TagIcon,
  ChartLineArea as ChartIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  More as MoreIcon
} from '@icon-park/vue-next'
import {
  getMyServicesApiV1ServicesMyGet,
  createServiceApiV1ServicesPost,
  updateServiceApiV1ServicesServiceIdPut,
  deleteServiceApiV1ServicesServiceIdDelete
} from '@/services/api/service'

// 响应式数据
const loading = ref(false)
const services = ref<API.ServiceListResponse[]>([])
const total = ref(0)
const modalVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref()

// 筛选条件
const filters = reactive({
  status: undefined as string | undefined,
  serviceType: undefined as string | undefined,
  search: undefined as string | undefined
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 12
})

// 表单数据
const form = reactive({
  id: undefined as number | undefined,
  name: '',
  service_type: undefined as string | undefined,
  description: '',
  base_price: undefined as number | undefined,
  duration: undefined as number | undefined,
  max_participants: undefined as number | undefined,
  location: '',
  status: 'active' as string,
  requirements: '',
  included_items: ''
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入服务名称' }],
  service_type: [{ required: true, message: '请选择服务类型' }],
  base_price: [{ required: true, message: '请输入基础价格' }],
  status: [{ required: true, message: '请选择服务状态' }]
}

// 方法
const fetchServices = async () => {
  try {
    loading.value = true

    const params: any = {
      skip: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize
    }

    if (filters.status) {
      params.status = filters.status
    }

    if (filters.serviceType) {
      params.service_type = filters.serviceType
    }

    if (filters.search) {
      params.search = filters.search
    }

    const response = await getMyServicesApiV1ServicesMyGet(params)

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

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '激活',
    inactive: '禁用',
    draft: '草稿'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'green',
    inactive: 'red',
    draft: 'orange'
  }
  return colorMap[status] || 'default'
}

const showCreateModal = () => {
  isEdit.value = false
  resetForm()
  modalVisible.value = true
}

const showEditModal = (service: API.ServiceListResponse) => {
  isEdit.value = true
  Object.assign(form, {
    id: service.id,
    name: service.name,
    service_type: service.service_type,
    description: service.description,
    base_price: Number(service.base_price),
    duration: service.duration,
    max_participants: service.max_participants,
    location: service.location,
    status: service.status,
    requirements: service.requirements,
    included_items: service.included_items
  })
  modalVisible.value = true
}

const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    name: '',
    service_type: undefined,
    description: '',
    base_price: undefined,
    duration: undefined,
    max_participants: undefined,
    location: '',
    status: 'active',
    requirements: '',
    included_items: ''
  })
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true

    const formData = {
      name: form.name,
      service_type: form.service_type as any,
      description: form.description || undefined,
      base_price: form.base_price!,
      duration: form.duration || undefined,
      max_participants: form.max_participants || undefined,
      location: form.location || undefined,
      status: form.status as any,
      requirements: form.requirements || undefined,
      included_items: form.included_items || undefined
    }

    let response
    if (isEdit.value && form.id) {
      response = await updateServiceApiV1ServicesServiceIdPut(
        { service_id: form.id },
        formData
      )
    } else {
      response = await createServiceApiV1ServicesPost(formData)
    }

    if (response.data?.success) {
      message.success(isEdit.value ? '服务更新成功' : '服务创建成功')
      modalVisible.value = false
      await fetchServices()
    } else {
      message.error(response.data?.message || '操作失败')
    }
  } catch (error: any) {
    if (error.message) {
      message.error(error.message)
    }
  } finally {
    submitting.value = false
  }
}

const deleteService = (service: API.ServiceListResponse) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除服务"${service.name}"吗？此操作无法撤销。`,
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await deleteServiceApiV1ServicesServiceIdDelete({
          service_id: service.id
        })

        if (response.data?.success) {
          message.success('服务删除成功')
          await fetchServices()
        } else {
          message.error(response.data?.message || '删除失败')
        }
      } catch (error: any) {
        message.error(error.message || '删除失败')
      }
    }
  })
}

const handleMenuClick = async ({ key }: { key: string }, service: API.ServiceListResponse) => {
  switch (key) {
    case 'disable':
    case 'enable':
      try {
        const newStatus = key === 'enable' ? 'active' : 'inactive'
        const response = await updateServiceApiV1ServicesServiceIdPut(
          { service_id: service.id },
          { ...service, status: newStatus as any }
        )

        if (response.data?.success) {
          message.success(`服务已${newStatus === 'active' ? '启用' : '禁用'}`)
          await fetchServices()
        } else {
          message.error(response.data?.message || '操作失败')
        }
      } catch (error: any) {
        message.error(error.message || '操作失败')
      }
      break
    case 'view-orders':
      // TODO: 跳转到订单页面
      message.info('功能开发中...')
      break
  }
}

// 生命周期
onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.my-services-page {
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

.services-list {
  margin-bottom: 24px;
}

.service-card {
  height: 100%;
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

.service-status {
  margin-bottom: 4px;
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
  color: #666;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
