<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h2>管理员仪表板</h2>
      <p>系统概览和关键指标</p>
    </div>

    <!-- 统计卡片 -->
    <a-row :gutter="[24, 24]" class="stats-cards">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <a-statistic
            title="用户总数"
            :value="dashboardData.totalUsers"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-statistic>
          <div class="stat-trend">
            <span class="trend-text">较上月</span>
            <span class="trend-value positive">+12%</span>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <a-statistic
            title="商家数量"
            :value="dashboardData.totalMerchants"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <ShopOutlined />
            </template>
          </a-statistic>
          <div class="stat-trend">
            <span class="trend-text">较上月</span>
            <span class="trend-value positive">+8%</span>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <a-statistic
            title="船艇总数"
            :value="dashboardData.totalBoats"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <CarOutlined />
            </template>
          </a-statistic>
          <div class="stat-trend">
            <span class="trend-text">较上月</span>
            <span class="trend-value positive">+15%</span>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <a-statistic
            title="今日预订"
            :value="dashboardData.todayBookings"
            :value-style="{ color: '#eb2f96' }"
          >
            <template #prefix>
              <CalendarOutlined />
            </template>
          </a-statistic>
          <div class="stat-trend">
            <span class="trend-text">较昨日</span>
            <span class="trend-value negative">-3%</span>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表和表格 -->
    <a-row :gutter="[24, 24]" class="charts-section">
      <a-col :xs="24" :lg="16">
        <a-card title="近期活动趋势" class="chart-card">
          <div class="chart-placeholder">
            <div class="chart-content">
              <LineChartOutlined style="font-size: 48px; color: #ccc;" />
              <p>图表占位 - 可集成 ECharts 或其他图表库</p>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card title="系统状态" class="status-card">
          <div class="status-item">
            <div class="status-label">服务器状态</div>
            <a-badge status="processing" text="运行中" />
          </div>
          <a-divider />
          <div class="status-item">
            <div class="status-label">数据库状态</div>
            <a-badge status="success" text="正常" />
          </div>
          <a-divider />
          <div class="status-item">
            <div class="status-label">缓存状态</div>
            <a-badge status="success" text="正常" />
          </div>
          <a-divider />
          <div class="status-item">
            <div class="status-label">存储空间</div>
            <div class="storage-info">
              <a-progress :percent="68" size="small" />
              <span class="storage-text">68% (340GB/500GB)</span>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 最新活动和待处理事项 -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="12">
        <a-card title="最新活动" class="activity-card">
          <a-list
            :data-source="recentActivities"
            :pagination="false"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar :style="{ backgroundColor: item.color }">
                      {{ item.type.charAt(0) }}
                    </a-avatar>
                  </template>
                  <template #title>
                    {{ item.title }}
                  </template>
                  <template #description>
                    {{ item.description }}
                  </template>
                </a-list-item-meta>
                <div class="activity-time">{{ item.time }}</div>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-card title="待处理事项" class="pending-card">
          <a-list
            :data-source="pendingTasks"
            :pagination="false"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a href="#" @click.prevent="handleTaskClick(item)">
                      {{ item.title }}
                    </a>
                  </template>
                  <template #description>
                    {{ item.description }}
                  </template>
                </a-list-item-meta>
                <a-tag :color="item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'blue'">
                  {{ item.priorityText }}
                </a-tag>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  ShopOutlined,
  CarOutlined,
  CalendarOutlined,
  LineChartOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 仪表板数据
const dashboardData = ref({
  totalUsers: 0,
  totalMerchants: 0,
  totalBoats: 0,
  todayBookings: 0
})

// 最新活动
const recentActivities = ref([
  {
    type: '用户',
    title: '新用户注册',
    description: '用户 张三 完成注册',
    time: '5分钟前',
    color: '#1890ff'
  },
  {
    type: '商家',
    title: '商家认证',
    description: '海上风帆公司 提交认证申请',
    time: '15分钟前',
    color: '#52c41a'
  },
  {
    type: '预订',
    title: '新预订',
    description: '用户预订了豪华游艇服务',
    time: '30分钟前',
    color: '#722ed1'
  },
  {
    type: '系统',
    title: '系统更新',
    description: '系统成功更新到 v2.1.0',
    time: '1小时前',
    color: '#fa8c16'
  }
])

// 待处理事项
const pendingTasks = ref([
  {
    id: 1,
    title: '审核商家认证申请',
    description: '3个商家等待认证审核',
    priority: 'high',
    priorityText: '高优先级'
  },
  {
    id: 2,
    title: '处理用户投诉',
    description: '2个用户投诉需要处理',
    priority: 'medium',
    priorityText: '中优先级'
  },
  {
    id: 3,
    title: '更新系统公告',
    description: '发布新的系统维护公告',
    priority: 'low',
    priorityText: '低优先级'
  },
  {
    id: 4,
    title: '数据备份检查',
    description: '检查昨日数据备份状态',
    priority: 'medium',
    priorityText: '中优先级'
  }
])

// 处理任务点击
const handleTaskClick = (task: any) => {
  switch (task.id) {
    case 1:
      router.push('/admin/merchants')
      break
    case 2:
      router.push('/admin/complaints')
      break
    default:
      console.log('处理任务:', task.title)
  }
}

// 加载仪表板数据
const loadDashboardData = async () => {
  try {
    // 这里应该调用API获取真实数据
    // 暂时使用模拟数据
    dashboardData.value = {
      totalUsers: Math.floor(Math.random() * 1000) + 500,
      totalMerchants: Math.floor(Math.random() * 100) + 50,
      totalBoats: Math.floor(Math.random() * 200) + 100,
      todayBookings: Math.floor(Math.random() * 50) + 10
    }
  } catch (error) {
    console.error('加载仪表板数据失败:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 24px;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.dashboard-header p {
  margin: 0;
  color: #666;
}

.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-trend {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-text {
  font-size: 12px;
  color: #666;
}

.trend-value {
  font-size: 12px;
  font-weight: 600;
}

.trend-value.positive {
  color: #52c41a;
}

.trend-value.negative {
  color: #ff4d4f;
}

.charts-section {
  margin-bottom: 24px;
}

.chart-card,
.status-card,
.activity-card,
.pending-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 6px;
}

.chart-content {
  text-align: center;
}

.chart-content p {
  margin: 12px 0 0 0;
  color: #999;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.status-label {
  font-weight: 500;
  color: #333;
}

.storage-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.storage-text {
  font-size: 12px;
  color: #666;
}

.activity-time {
  color: #999;
  font-size: 12px;
}
</style>
