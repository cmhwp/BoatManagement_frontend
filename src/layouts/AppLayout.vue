<template>
  <a-layout class="app-layout">
    <!-- 顶部导航栏 -->
    <a-layout-header class="app-header">
      <div class="header-content">
        <!-- 左侧Logo和菜单 -->
        <div class="header-left">
          <div class="logo">
            <router-link to="/dashboard">
              <h2>绿色智能船艇平台</h2>
            </router-link>
          </div>

          <a-menu
            v-model:selected-keys="selectedKeys"
            mode="horizontal"
            class="main-menu"
          >
            <a-menu-item key="dashboard" @click="handleMenuClick('/dashboard')">
              <HomeOutlined />
              首页
            </a-menu-item>

            <a-menu-item key="boats" @click="handleMenuClick('/boats')">
              <CarOutlined />
              船艇服务
            </a-menu-item>

            <a-menu-item key="bookings" @click="handleMenuClick('/bookings')">
              <CalendarOutlined />
              我的预订
            </a-menu-item>

            <!-- 商家特有菜单 -->
            <a-menu-item v-if="userStore.isMerchant" key="merchant" @click="handleMenuClick('/merchant')">
              <ShopOutlined />
              商家中心
            </a-menu-item>

            <!-- 船员特有菜单 -->
            <a-menu-item v-if="userStore.isCrew" key="crew" @click="handleMenuClick('/crew')">
              <TeamOutlined />
              船员中心
            </a-menu-item>
          </a-menu>
        </div>

        <!-- 右侧用户操作区 -->
        <div class="header-right">
          <a-space size="large">
            <!-- 搜索框 -->
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索船艇服务..."
              style="width: 240px"
              @search="handleSearch"
            />

            <!-- 消息通知 -->
            <a-badge :count="3">
              <BellOutlined class="header-icon" />
            </a-badge>

            <!-- 用户下拉菜单 -->
            <a-dropdown>
              <a-space class="user-info">
                <a-avatar size="small" :src="userStore.user?.avatar">
                  {{ userStore.user?.username?.charAt(0).toUpperCase() }}
                </a-avatar>
                <span>{{ userStore.user?.full_name || userStore.user?.username }}</span>
                <DownOutlined />
              </a-space>

              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile" @click="handleMenuClick('/profile')">
                    <UserOutlined />
                    个人中心
                  </a-menu-item>
                  <a-menu-item key="settings" @click="handleMenuClick('/settings')">
                    <SettingOutlined />
                    账户设置
                  </a-menu-item>
                  <a-menu-item key="help" @click="handleMenuClick('/help')">
                    <QuestionCircleOutlined />
                    帮助中心
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </div>
    </a-layout-header>

    <!-- 页面内容 -->
    <a-layout-content class="app-content">
      <div class="content-wrapper">
        <!-- 面包屑导航 -->
        <a-breadcrumb v-if="showBreadcrumb" class="breadcrumb">
          <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
            <router-link v-if="item.path" :to="item.path">
              {{ item.title }}
            </router-link>
            <span v-else>{{ item.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <!-- 路由视图 -->
        <div class="page-content">
          <router-view />
        </div>
      </div>
    </a-layout-content>

    <!-- 底部 -->
    <a-layout-footer class="app-footer">
      <div class="footer-content">
        <div class="footer-info">
          <h4>绿色智能船艇平台</h4>
          <p>为您提供优质的船艇服务体验</p>
        </div>
        <div class="footer-links">
          <a-space size="middle">
            <a href="#" @click.prevent>关于我们</a>
            <a href="#" @click.prevent>联系我们</a>
            <a href="#" @click.prevent>服务条款</a>
            <a href="#" @click.prevent>隐私政策</a>
          </a-space>
        </div>
        <div class="footer-copyright">
          <p>© 2024 绿色智能船艇平台 版权所有</p>
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  HomeOutlined,
  CarOutlined,
  CalendarOutlined,
  ShopOutlined,
  TeamOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  DownOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import type { BreadcrumbItem } from '@/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的菜单项
const selectedKeys = ref<string[]>([])

// 是否显示面包屑
const showBreadcrumb = computed(() => {
  return route.path !== '/dashboard'
})

// 面包屑导航
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { title: '首页', path: '/dashboard' }
  ]

  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length > 1) {
    const pageMap: Record<string, string> = {
      'boats': '船艇服务',
      'bookings': '我的预订',
      'merchant': '商家中心',
      'crew': '船员中心',
      'profile': '个人中心',
      'settings': '账户设置',
      'help': '帮助中心'
    }

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += '/' + segment
      if (pageMap[segment] && index > 0) {
        items.push({
          title: pageMap[segment],
          path: index === pathSegments.length - 1 ? undefined : currentPath
        })
      }
    })
  }

  return items
})

// 监听路由变化，更新菜单选中状态
watch(() => route.path, (newPath) => {
  updateSelectedKeys(newPath)
}, { immediate: true })

// 更新选中的菜单项
const updateSelectedKeys = (path: string) => {
  const pathMap: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/boats': 'boats',
    '/bookings': 'bookings',
    '/merchant': 'merchant',
    '/crew': 'crew'
  }

  // 检查是否是子路径
  for (const [routePath, key] of Object.entries(pathMap)) {
    if (path.startsWith(routePath)) {
      selectedKeys.value = [key]
      return
    }
  }

  selectedKeys.value = []
}

// 处理菜单点击
const handleMenuClick = (path: string) => {
  router.push(path)
}

// 处理搜索
const handleSearch = (value: string) => {
  if (value.trim()) {
    router.push({
      path: '/boats',
      query: { search: value.trim() }
    })
  }
}

// 处理登出
const handleLogout = async () => {
  try {
    await userStore.logout()
    await router.push('/login')
  } catch (error) {
    message.error('退出登录失败')
  }
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0;
  height: 64px;
  line-height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 40px;
}

.logo h2 {
  color: #1890ff;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.logo a {
  text-decoration: none;
}

.main-menu {
  border-bottom: none;
  line-height: 62px;
}

.main-menu :deep(.ant-menu-item) {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.header-icon:hover {
  color: #1890ff;
  background-color: #f5f5f5;
}

.user-info {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.app-content {
  background: #f5f5f5;
  min-height: calc(100vh - 64px - 120px);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.breadcrumb {
  margin-bottom: 16px;
}

.page-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: 400px;
}

.app-footer {
  background: #001529;
  color: white;
  padding: 40px 0 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.footer-info {
  margin-bottom: 24px;
}

.footer-info h4 {
  color: white;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.footer-info p {
  color: #999;
  margin: 0;
}

.footer-links {
  margin-bottom: 24px;
}

.footer-links a {
  color: #999;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

.footer-copyright p {
  color: #666;
  margin: 0;
  font-size: 14px;
}
</style>
