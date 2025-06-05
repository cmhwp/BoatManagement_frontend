<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">绿色智能船艇平台</h1>
        <p class="register-subtitle">创建新账号</p>
      </div>

      <a-form
        :model="registerForm"
        :rules="rules"
        @finish="handleRegister"
        layout="vertical"
        class="register-form"
      >
        <a-form-item
          label="用户名"
          name="username"
        >
          <a-input
            v-model:value="registerForm.username"
            size="large"
            placeholder="请输入用户名"
            :prefix="h(UserOutlined)"
          />
        </a-form-item>

        <a-form-item
          label="邮箱"
          name="email"
        >
          <a-input
            v-model:value="registerForm.email"
            size="large"
            placeholder="请输入邮箱"
            :prefix="h(MailOutlined)"
          />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
        >
          <a-input-password
            v-model:value="registerForm.password"
            size="large"
            placeholder="请输入密码"
            :prefix="h(LockOutlined)"
          />
        </a-form-item>

        <a-form-item
          label="确认密码"
          name="confirmPassword"
        >
          <a-input-password
            v-model:value="registerForm.confirmPassword"
            size="large"
            placeholder="请再次输入密码"
            :prefix="h(LockOutlined)"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="agreeTerms">
            我已阅读并同意
            <a href="#" @click.prevent class="terms-link">《用户协议》</a>
            和
            <a href="#" @click.prevent class="terms-link">《隐私政策》</a>
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            :disabled="!agreeTerms"
          >
            注册
          </a-button>
        </a-form-item>

        <div class="register-footer">
          <span>已有账号？</span>
          <router-link to="/login" class="login-link">
            立即登录
          </router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined
} from '@ant-design/icons-vue'
import { registerApiV1AuthRegisterPost } from '@/services/api/auth'

const router = useRouter()

// 表单数据
const registerForm = reactive<API.UserCreate & { confirmPassword: string }>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user' as API.UserRole
})
const agreeTerms = ref(false)
const loading = ref(false)

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string) => {
        if (value && value !== registerForm.password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ]
}

// 处理注册
const handleRegister = async () => {
  try {
    loading.value = true

    // 验证密码确认
    if (registerForm.password !== registerForm.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    // 创建注册数据，移除确认密码字段
    const { confirmPassword, ...registerData } = registerForm
    const response = await registerApiV1AuthRegisterPost(registerData)

    if (response.data?.success) {
      message.success('注册成功！您已成为普通用户，如需申请其他角色请前往个人中心')
      await router.push('/login')
    } else {
      message.error(response.data?.message || '注册失败')
    }
  } catch (error: any) {
    message.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-title {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin: 0 0 8px 0;
}

.register-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.register-form {
  margin-top: 24px;
}

.register-footer {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.login-link {
  color: #1890ff;
  text-decoration: none;
  margin-left: 4px;
}

.login-link:hover {
  text-decoration: underline;
}

.terms-link {
  color: #1890ff;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.role-notice {
  margin-top: 16px;
  text-align: center;
}
</style>
