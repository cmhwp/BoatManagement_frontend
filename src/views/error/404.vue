<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-illustration">
        <div class="boat-container">
          <div class="boat">
            <div class="boat-body"></div>
            <div class="boat-sail"></div>
            <div class="boat-flag"></div>
          </div>
          <div class="waves">
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
          </div>
        </div>
      </div>

      <div class="error-info">
        <h1 class="error-title">404</h1>
        <h2 class="error-subtitle">页面迷航了</h2>
        <p class="error-description">
          抱歉，您访问的页面似乎已经随风飘散，找不到了。<br>
          让我们帮您重新导航回港湾。
        </p>

        <div class="error-actions">
          <a-space size="middle">
            <a-button type="primary" size="large" @click="goHome">
              <HomeOutlined />
              返回首页
            </a-button>
            <a-button size="large" @click="goBack">
              <LeftOutlined />
              返回上页
            </a-button>
            <a-button size="large" @click="refreshPage">
              <ReloadOutlined />
              刷新页面
            </a-button>
          </a-space>
        </div>

        <div class="help-links">
          <h4>您可能在寻找：</h4>
          <a-space wrap>
            <a-button type="link" @click="goToBoats">船艇服务</a-button>
            <a-button type="link" @click="goToBookings">我的预订</a-button>
            <a-button type="link" @click="goToProfile">个人中心</a-button>
            <a-button type="link" @click="goToHelp">帮助中心</a-button>
          </a-space>
        </div>
      </div>
    </div>

    <div class="error-footer">
      <p>如果问题持续存在，请联系我们的客服团队</p>
      <a-space>
        <a-button type="link" @click="contactSupport">
          <PhoneOutlined />
          联系客服
        </a-button>
        <a-button type="link" @click="reportIssue">
          <ExclamationCircleOutlined />
          反馈问题
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  HomeOutlined,
  LeftOutlined,
  ReloadOutlined,
  PhoneOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/dashboard')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

// 刷新页面
const refreshPage = () => {
  window.location.reload()
}

// 快捷导航
const goToBoats = () => {
  router.push('/boats')
}

const goToBookings = () => {
  router.push('/bookings')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToHelp = () => {
  router.push('/help')
}

// 联系客服
const contactSupport = () => {
  message.info('客服电话：400-123-4567')
}

// 反馈问题
const reportIssue = () => {
  message.info('问题反馈功能开发中...')
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.error-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 60px 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
}

.error-illustration {
  margin-bottom: 40px;
}

.boat-container {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boat {
  position: relative;
  animation: float 3s ease-in-out infinite;
}

.boat-body {
  width: 80px;
  height: 30px;
  background: #8B4513;
  border-radius: 40px 40px 20px 20px;
  position: relative;
}

.boat-body::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 15px;
  background: #654321;
  border-radius: 50%;
}

.boat-sail {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 60px solid #fff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.boat-flag {
  position: absolute;
  top: -55px;
  right: 15px;
  width: 15px;
  height: 10px;
  background: #ff4757;
  border-radius: 0 3px 3px 0;
}

.waves {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 40px;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: linear-gradient(to right, #667eea, #764ba2);
  border-radius: 1000px 1000px 0 0;
  opacity: 0.6;
}

.wave1 {
  animation: wave 2s ease-in-out infinite;
}

.wave2 {
  animation: wave 2s ease-in-out infinite 0.5s;
  opacity: 0.4;
}

.wave3 {
  animation: wave 2s ease-in-out infinite 1s;
  opacity: 0.2;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes wave {
  0%, 100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.1);
  }
}

.error-info {
  margin-bottom: 40px;
}

.error-title {
  font-size: 120px;
  font-weight: 700;
  color: #667eea;
  margin: 0;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.error-subtitle {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 16px 0;
}

.error-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

.error-actions {
  margin-bottom: 40px;
}

.help-links {
  border-top: 1px solid #f0f0f0;
  padding-top: 30px;
}

.help-links h4 {
  font-size: 16px;
  color: #333;
  margin: 0 0 16px 0;
}

.error-footer {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.error-footer p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-content {
    padding: 40px 20px;
  }

  .error-title {
    font-size: 80px;
  }

  .error-subtitle {
    font-size: 24px;
  }

  .boat-container {
    height: 150px;
  }

  .boat-body {
    width: 60px;
    height: 25px;
  }

  .boat-sail {
    top: -45px;
    border-left-width: 20px;
    border-right-width: 20px;
    border-bottom-width: 45px;
  }
}

/* 背景装饰 */
.error-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.3) 0%, transparent 50%);
  z-index: 1;
}
</style>
