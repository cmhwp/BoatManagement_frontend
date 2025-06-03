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
          label="真实姓名"
          name="full_name"
        >
          <a-input
            v-model:value="registerForm.full_name"
            size="large"
            placeholder="请输入真实姓名(可选)"
          />
        </a-form-item>

        <a-form-item
          label="手机号"
          name="phone"
        >
          <a-input
            v-model:value="registerForm.phone"
            size="large"
            placeholder="请输入手机号(可选)"
            :prefix="h(PhoneOutlined)"
          />
        </a-form-item>

        <a-form-item
          label="角色"
          name="role"
        >
          <a-select
            v-model:value="registerForm.role"
            size="large"
            placeholder="请选择角色"
          >
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="merchant">商家</a-select-option>
            <a-select-option value="crew">船员</a-select-option>
          </a-select>
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
            v-model:value="confirmPassword"
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
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons-vue'
import { register } from '@/api'
import type { RegisterRequest, UserRole } from '@/types'

const router = useRouter()

// 表单数据
const registerForm = reactive<RegisterRequest>({
  username: '',
  email: '',
  password: '',
  full_name: '',
  phone: '',
  role: 'user' as UserRole
})

const confirmPassword = ref('')
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
  full_name: [
    { max: 50, message: '姓名长度不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  // confirmPassword: [
  //   { required: true, message: '请确认密码', trigger: 'blur' },
  //   {
  //     validator: (_rule: any, value: string) => {
  //       if (value && value !== registerForm.password) {
  //         return Promise.reject('两次输入的密码不一致')
  //       }
  //       return Promise.resolve()
  //     },
  //     trigger: 'blur'
  //   }
  // ]
}

// 处理注册
const handleRegister = async () => {
  try {
    loading.value = true

    // 清理空字段
    const formData = { ...registerForm }
    if (!formData.full_name) delete formData.full_name
    if (!formData.phone) delete formData.phone

    const response = await register(formData)

    if (response.success) {
      message.success('注册成功，请登录')
      await router.push('/login')
    } else {
      message.error(response.message || '注册失败')
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
</style>
