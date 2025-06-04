<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <h1>欢迎回来，{{ userStore.user?.real_name || userStore.user?.username }}！</h1>
      <p class="welcome-text">今天是个美好的一天，开始您的船艇之旅吧</p>
    </div>

    <!-- 快捷操作卡片 -->
    <div class="quick-actions">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="action-card" @click="handleQuickAction('/boats')">
            <div class="action-content">
              <div class="action-icon boats">
                <CarOutlined />
              </div>
              <div class="action-info">
                <h3>浏览船艇</h3>
                <p>发现精彩的船艇服务</p>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="action-card" @click="handleQuickAction('/bookings')">
            <div class="action-content">
              <div class="action-icon bookings">
                <CalendarOutlined />
              </div>
              <div class="action-info">
                <h3>我的预订</h3>
                <p>查看预订记录</p>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col v-if="userStore.isMerchant" :xs="24" :sm="12" :md="6">
          <a-card class="action-card" @click="handleQuickAction('/merchant')">
            <div class="action-content">
              <div class="action-icon merchant">
                <ShopOutlined />
              </div>
              <div class="action-info">
                <h3>商家中心</h3>
                <p>管理您的船艇业务</p>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col v-if="userStore.isCrew" :xs="24" :sm="12" :md="6">
          <a-card class="action-card" @click="handleQuickAction('/crew')">
            <div class="action-content">
              <div class="action-icon crew">
                <TeamOutlined />
              </div>
              <div class="action-info">
                <h3>船员中心</h3>
                <p>查看工作安排</p>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="action-card" @click="handleQuickAction('/profile')">
            <div class="action-content">
              <div class="action-icon profile">
                <UserOutlined />
              </div>
              <div class="action-info">
                <h3>个人中心</h3>
                <p>管理个人信息</p>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 数据统计 -->
    <div class="statistics-section">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :lg="16">
          <a-card title="最新动态" class="news-card">
            <a-list
              :data-source="newsData"
              :pagination="false"
              size="small"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #title>
                      <a href="#" @click.prevent>{{ item.title }}</a>
                    </template>
                    <template #description>
                      {{ item.description }}
                    </template>
                  </a-list-item-meta>
                  <div class="news-time">{{ item.time }}</div>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>

        <a-col :xs="24" :lg="8">
          <a-card title="个人统计" class="stats-card">
            <div class="stat-item">
              <div class="stat-number">{{ stats.bookings }}</div>
              <div class="stat-label">总预订次数</div>
            </div>
            <a-divider />
            <div class="stat-item">
              <div class="stat-number">{{ stats.favorites }}</div>
              <div class="stat-label">收藏船艇</div>
            </div>
            <a-divider />
            <div class="stat-item">
              <div class="stat-number">{{ stats.reviews }}</div>
              <div class="stat-label">评价次数</div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CarOutlined,
  CalendarOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 统计数据
const stats = ref({
  bookings: 0,
  favorites: 0,
  reviews: 0
})

// 新闻动态数据
const newsData = ref([
  {
    title: '春季船艇优惠活动开始啦！',
    description: '多种船艇服务享受特惠价格，快来体验吧',
    time: '2小时前'
  },
  {
    title: '新增多条精品航线',
    description: '探索更多美丽的水域风光',
    time: '1天前'
  },
  {
    title: '安全提醒：出行前请检查天气',
    description: '为了您的安全，请关注天气变化',
    time: '2天前'
  },
  {
    title: '客户服务升级',
    description: '7×24小时在线客服为您服务',
    time: '3天前'
  }
])

// 处理快捷操作
const handleQuickAction = (path: string) => {
  router.push(path)
}

// 加载用户统计数据
const loadUserStats = async () => {
  try {
    // 这里应该调用API获取真实数据
    // 暂时使用模拟数据
    stats.value = {
      bookings: Math.floor(Math.random() * 50),
      favorites: Math.floor(Math.random() * 20),
      reviews: Math.floor(Math.random() * 30)
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadUserStats()
})
</script>

<style scoped>
.dashboard-page {
  padding: 24px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
}

.dashboard-header h1 {
  font-size: 32px;
  color: #1890ff;
  margin: 0 0 8px 0;
}

.welcome-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.quick-actions {
  margin-bottom: 40px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 12px;
  overflow: hidden;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.action-content {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-right: 16px;
}

.action-icon.boats {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-icon.bookings {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-icon.merchant {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.action-icon.crew {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.action-icon.profile {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.action-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.action-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.statistics-section .ant-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.news-card :deep(.ant-card-head-title) {
  font-size: 18px;
  font-weight: 600;
}

.news-time {
  color: #999;
  font-size: 12px;
}

.stats-card {
  text-align: center;
}

.stat-item {
  padding: 8px 0;
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}
</style>
