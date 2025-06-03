<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">绿色智能船艇平台</h1>
        <p class="login-subtitle">欢迎登录</p>
      </div>

      <a-form
        :model="loginForm"
        :rules="rules"
        @finish="handleLogin"
        layout="vertical"
        class="login-form"
      >
        <a-form-item
          label="用户名"
          name="username"
        >
          <a-input
            v-model:value="loginForm.username"
            size="large"
            placeholder="请输入用户名"
            :prefix="h(UserOutlined)"
          />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
        >
          <a-input-password
            v-model:value="loginForm.password"
            size="large"
            placeholder="请输入密码"
            :prefix="h(LockOutlined)"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="rememberMe">
            记住我
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="userStore.loading"
          >
            登录
          </a-button>
        </a-form-item>

        <div class="login-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="register-link">
            立即注册
          </router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import type { LoginRequest } from '@/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单数据
const loginForm = reactive<LoginRequest>({
  username: '',
  password: ''
})

const rememberMe = ref(false)

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  try {
    const success = await userStore.login(loginForm)
    if (success) {
      // 记住我功能
      if (rememberMe.value) {
        localStorage.setItem('remember_username', loginForm.username)
      } else {
        localStorage.removeItem('remember_username')
      }

      // 跳转到指定页面或首页
      const redirect = route.query.redirect as string || '/dashboard'
      await router.push(redirect)
    }
  } catch (error: any) {
    message.error(error.message || '登录失败')
  }
}

// 初始化记住的用户名
const initRememberUsername = () => {
  const rememberedUsername = localStorage.getItem('remember_username')
  if (rememberedUsername) {
    loginForm.username = rememberedUsername
    rememberMe.value = true
  }
}

// 组件挂载时初始化
initRememberUsername()
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.login-form {
  margin-top: 24px;
}

.login-footer {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.register-link {
  color: #1890ff;
  text-decoration: none;
  margin-left: 4px;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
