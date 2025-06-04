<template>
  <a-layout class="admin-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="admin-sider"
    >
      <div class="logo">
        <h3 v-if="!collapsed">管理中心</h3>
        <h3 v-else>管理</h3>
      </div>

      <a-menu
        v-model:selected-keys="selectedKeys"
        v-model:open-keys="openKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
      >
        <a-menu-item key="dashboard" @click="handleMenuClick('/admin/dashboard')">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>仪表板</span>
        </a-menu-item>

        <a-menu-item key="users" @click="handleMenuClick('/admin/users')">
          <template #icon>
            <UserOutlined />
          </template>
          <span>用户管理</span>
        </a-menu-item>

        <a-menu-item key="merchants" @click="handleMenuClick('/admin/merchants')">
          <template #icon>
            <ShopOutlined />
          </template>
          <span>商家管理</span>
        </a-menu-item>

        <a-menu-item key="boats" @click="handleMenuClick('/admin/boats')">
          <template #icon>
            <Sailboat />
          </template>
          <span>船艇管理</span>
        </a-menu-item>

        <a-menu-item key="crews" @click="handleMenuClick('/admin/crews')">
          <template #icon>
            <TeamOutlined />
          </template>
          <span>船员管理</span>
        </a-menu-item>

        <a-menu-item key="bookings" @click="handleMenuClick('/admin/bookings')">
          <template #icon>
            <CalendarOutlined />
          </template>
          <span>预订管理</span>
        </a-menu-item>

        <a-menu-item key="settings" @click="handleMenuClick('/admin/settings')">
          <template #icon>
            <SettingOutlined />
          </template>
          <span>系统设置</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 主内容区 -->
    <a-layout>
      <!-- 顶部导航栏 -->
      <a-layout-header class="admin-header">
        <div class="header-left">
          <MenuUnfoldOutlined
            v-if="collapsed"
            class="trigger"
            @click="collapsed = !collapsed"
          />
          <MenuFoldOutlined
            v-else
            class="trigger"
            @click="collapsed = !collapsed"
          />

          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              <router-link v-if="item.path" :to="item.path">
                {{ item.title }}
              </router-link>
              <span v-else>{{ item.title }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="header-right">
          <a-space size="middle">
            <!-- 消息通知 -->
            <a-badge :count="5">
              <BellOutlined class="header-icon" />
            </a-badge>

            <!-- 用户下拉菜单 -->
            <a-dropdown>
              <a-space class="user-info">
                <a-avatar size="small" :src="userStore.user?.avatar">
                  {{ userStore.user?.username?.charAt(0).toUpperCase() }}
                </a-avatar>
                <span>{{ userStore.user?.real_name || userStore.user?.username }}</span>
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
                    设置
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
      </a-layout-header>

      <!-- 页面内容 -->
      <a-layout-content class="admin-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </a-layout-content>

      <!-- 底部 -->
      <a-layout-footer class="admin-footer">
        绿色智能船艇平台 ©2024 版权所有
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  BellOutlined,
  DownOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { Sailboat } from '@icon-park/vue-next'
import { useUserStore } from '@/stores/user'
import type { BreadcrumbItem } from '@/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 侧边栏折叠状态
const collapsed = ref(false)

// 当前选中的菜单项
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 更新选中的菜单项
const updateSelectedKeys = (path: string) => {
  const pathMap: Record<string, string> = {
    '/admin/dashboard': 'dashboard',
    '/admin/users': 'users',
    '/admin/merchants': 'merchants',
    '/admin/boats': 'boats',
    '/admin/crews': 'crews',
    '/admin/bookings': 'bookings',
    '/admin/settings': 'settings'
  }

  const key = pathMap[path]
  if (key) {
    selectedKeys.value = [key]
  }
}

// 面包屑导航
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { title: '管理中心', path: '/admin' }
  ]

  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length > 1) {
    const pageMap: Record<string, string> = {
      'dashboard': '仪表板',
      'users': '用户管理',
      'merchants': '商家管理',
      'boats': '船艇管理',
      'crews': '船员管理',
      'bookings': '预订管理',
      'settings': '系统设置'
    }

    const currentPage = pathSegments[pathSegments.length - 1]
    if (pageMap[currentPage]) {
      items.push({ title: pageMap[currentPage] })
    }
  }

  return items
})

// 监听路由变化，更新菜单选中状态
watch(() => route.path, (newPath) => {
  updateSelectedKeys(newPath)
}, { immediate: true })

// 处理菜单点击
const handleMenuClick = (path: string) => {
  router.push(path)
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
.admin-layout {
  min-height: 100vh;
}

.admin-sider {
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #001529;
}

.logo h3 {
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.admin-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  height: 64px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition: left 0.2s;
}

.admin-layout :deep(.ant-layout-sider-collapsed) + .ant-layout .admin-header {
  left: 80px;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.breadcrumb {
  margin-left: 16px;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}

.header-icon:hover {
  color: #1890ff;
}

.user-info {
  cursor: pointer;
  padding: 0 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.admin-content {
  margin-left: 200px;
  margin-top: 64px;
  transition: margin-left 0.2s;
}

.admin-layout :deep(.ant-layout-sider-collapsed) + .ant-layout .admin-content {
  margin-left: 80px;
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 64px - 70px);
}

.admin-footer {
  margin-left: 200px;
  text-align: center;
  color: #666;
  transition: margin-left 0.2s;
}

.admin-layout :deep(.ant-layout-sider-collapsed) + .ant-layout .admin-footer {
  margin-left: 80px;
}
</style>
