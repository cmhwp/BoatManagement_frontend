<template>
  <div class="admin-table">
    <div class="page-header">
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </div>

    <!-- 搜索和操作栏 -->
    <a-card class="search-card">
      <a-row :gutter="[16, 16]" align="middle">
        <!-- 搜索框 -->
        <a-col :xs="24" :sm="24" :md="8" :lg="6">
          <a-input-search
            v-model:value="searchForm.search"
            :placeholder="searchConfig.placeholder"
            @search="handleSearch"
            @pressEnter="handleSearch"
            allow-clear
          />
        </a-col>

        <!-- 动态渲染筛选器 -->
        <a-col
          v-for="filter in searchConfig.filters"
          :key="filter.key"
          :xs="24"
          :sm="12"
          :md="filter.span || 4"
          :lg="filter.span || 4"
        >
          <a-select
            v-model:value="searchForm[filter.key]"
            :placeholder="filter.placeholder"
            allowClear
            @change="handleSearch"
            style="width: 100%"
          >
            <a-select-option
              v-for="option in filter.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-col>

        <!-- 搜索按钮 -->
        <a-col :xs="24" :sm="12" :md="4" :lg="4">
          <a-space style="width: 100%">
            <a-button
              type="primary"
              @click="handleSearch"
              :loading="loading"
              style="width: 100%"
            >
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <!-- 数据列表 -->
    <a-card class="table-card">
      <a-table
        :columns="tableColumns"
        :data-source="dataList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 'max-content' }"
        size="middle"
      >
        <!-- 使用插槽渲染自定义列内容 -->
        <template #bodyCell="{ column, record }">
          <slot name="bodyCell" :column="column" :record="record">
            <!-- 默认的操作列 -->
            <template v-if="column.key === 'action'">
              <a-space size="small">
                <a-button size="small" @click="handleView(record)">
                  <template #icon>
                    <EyeOutlined />
                  </template>
                  查看
                </a-button>
                <a-button
                  size="small"
                  type="primary"
                  @click="handleEdit(record)"
                >
                  <template #icon>
                    <EditOutlined />
                  </template>
                  编辑
                </a-button>
                <a-dropdown v-if="actionConfig.moreActions" placement="bottomRight">
                  <a-button size="small">
                    更多
                    <DownOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="(info: any) => handleMenuAction(info.key, record)">
                      <a-menu-item
                        v-for="action in actionConfig.moreActions"
                        :key="action.key"
                        :danger="action.danger"
                      >
                        {{ action.label }}
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </slot>
        </template>
      </a-table>
    </a-card>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      :title="detailConfig.title"
      :width="detailConfig.width || 600"
      @close="handleDrawerClose"
    >
      <slot name="detail" :record="selectedRecord">
        <div v-if="selectedRecord" class="detail-content">
          <div class="detail-section">
            <h4>基本信息</h4>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item
                v-for="field in detailConfig.fields"
                :key="field.key"
                :label="field.label"
              >
                <slot :name="`detail-${field.key}`" :record="selectedRecord" :value="selectedRecord[field.key]">
                  {{ formatFieldValue(selectedRecord[field.key], field.type) }}
                </slot>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </slot>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { DownOutlined, SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons-vue'

// Props定义
interface SearchFilter {
  key: string
  placeholder: string
  span?: number
  options: Array<{ label: string; value: any }>
}

interface SearchConfig {
  placeholder: string
  filters: SearchFilter[]
}

interface ActionConfig {
  moreActions?: Array<{
    key: string
    label: string
    danger?: boolean
  }>
}

interface DetailField {
  key: string
  label: string
  type?: 'date' | 'tag' | 'text'
}

interface DetailConfig {
  title: string
  width?: number
  fields: DetailField[]
}

interface ApiConfig {
  list: Function
  detail?: Function
  listParams?: (searchForm: any, pagination: any) => any
  detailParams?: (record: any) => any
}

const props = defineProps<{
  title: string
  subtitle: string
  columns: any[]
  searchConfig: SearchConfig
  actionConfig: ActionConfig
  detailConfig: DetailConfig
  apiConfig: ApiConfig
}>()

// Emits定义
const emit = defineEmits<{
  view: [record: any]
  edit: [record: any]
  menuAction: [key: string, record: any]
}>()

// 状态管理
const loading = ref(false)
const dataList = ref<any[]>([])
const selectedRecord = ref<any>(null)
const drawerVisible = ref(false)

// 搜索表单
const searchForm: Record<string, any> = reactive({
  search: '',
  ...Object.fromEntries(props.searchConfig.filters.map(f => [f.key, undefined]))
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

// 表格列配置（添加默认操作列）
const tableColumns = computed(() => {
  const cols = [...props.columns]
  if (!cols.find(col => col.key === 'action')) {
    cols.push({
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right'
    })
  }
  return cols
})

// 加载数据列表
const loadData = async () => {
  try {
    loading.value = true

    // 构建API参数
    const params = props.apiConfig.listParams
      ? props.apiConfig.listParams(searchForm, pagination)
      : {
          page: pagination.current,
          page_size: pagination.pageSize,
          search: searchForm.search || undefined,
          ...Object.fromEntries(
            Object.entries(searchForm).filter(([key, value]) =>
              key !== 'search' && value !== undefined && value !== ''
            )
          )
        }

    const response = await props.apiConfig.list(params)
    if (response.data) {
      dataList.value = response.data.items || []
      pagination.total = response.data.total || 0
    }
  } catch (error: any) {
    message.error(error.message || '加载数据失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

// 处理表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadData()
}

// 处理查看详情
const handleView = async (record: any) => {
  if (props.apiConfig.detail) {
    try {
      const params = props.apiConfig.detailParams
        ? props.apiConfig.detailParams(record)
        : { id: record.id }

      const response = await props.apiConfig.detail(params)
      if (response.data?.success) {
        selectedRecord.value = response.data.data
        drawerVisible.value = true
      }
    } catch (error: any) {
      message.error(error.message || '获取详情失败')
    }
  } else {
    selectedRecord.value = record
    drawerVisible.value = true
  }

  emit('view', record)
}

// 处理编辑
const handleEdit = (record: any) => {
  emit('edit', record)
}

// 处理菜单操作
const handleMenuAction = (key: string, record: any) => {
  emit('menuAction', key, record)
}

// 关闭抽屉
const handleDrawerClose = () => {
  drawerVisible.value = false
  selectedRecord.value = null
}

// 格式化字段值
const formatFieldValue = (value: any, type?: string) => {
  if (value === null || value === undefined) return '未设置'

  switch (type) {
    case 'date':
      return new Date(value).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    case 'tag':
      return value
    default:
      return value
  }
}

// 暴露方法给父组件
defineExpose({
  loadData,
  refresh: loadData
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-table {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
  padding: 20px 0;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #262626;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.search-card {
  margin-bottom: 16px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

.search-card :deep(.ant-card-body) {
  padding: 20px;
}

.table-card {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.table-card :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  color: #262626;
}

.table-card :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f5f5f5;
}

.detail-content {
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

/* 响应式优化 */
@media (max-width: 768px) {
  .admin-table {
    padding: 16px;
  }

  .page-header {
    padding: 16px 0;
  }

  .page-header h2 {
    font-size: 20px;
  }

  .search-card :deep(.ant-card-body) {
    padding: 16px;
  }
}

/* 搜索表单样式优化 */
:deep(.ant-input-search .ant-input-group .ant-input-affix-wrapper) {
  border-radius: 6px 0 0 6px;
}

:deep(.ant-input-search .ant-input-group .ant-btn) {
  border-radius: 0 6px 6px 0;
}

:deep(.ant-select) {
  border-radius: 6px;
}

:deep(.ant-btn) {
  border-radius: 6px;
}
</style>
