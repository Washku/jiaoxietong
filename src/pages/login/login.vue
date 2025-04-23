<!-- login.vue -->
<template>
  <view class="login-container">
    <view class="login-card">
      <view class="welcome-text">
        <text class="title">欢迎回来</text>
        <text class="subtitle">请登录您的账号</text>
      </view>

      <view class="form-group">
        <view class="input-group">
          <view class="input-icon">
            <text class="iconfont icon-user"></text>
          </view>
          <input 
            class="input" 
            type="text" 
            v-model="formData.username" 
            placeholder="请输入用户名"
          />
        </view>

        <view class="input-group">
          <view class="input-icon">
            <text class="iconfont icon-lock"></text>
          </view>
          <input 
            class="input" 
            :type="showPassword ? 'text' : 'password'" 
            v-model="formData.password" 
            placeholder="请输入密码"
          />
        </view>

        <view class="options-row">
          <label class="remember-box">
            <checkbox 
              :checked="formData.remember" 
              @tap="formData.remember = !formData.remember"
              color="#6c6fd8"
              style="transform: scale(0.7)"
            />
            <text>记住我</text>
          </label>
          <text class="forget-link" @tap="onForgetPassword">忘记密码？</text>
        </view>

        <button class="login-btn" @tap="handleLogin">登录</button>

        <view class="register-link">
          <text>还没有账号？</text>
          <text class="link" @tap="goToRegister">立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formData = reactive({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)

const handleLogin = () => {
  if (!formData.username || !formData.password) {
    uni.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    })
    return
  }
  
  // TODO: 实现登录逻辑
  console.log('登录信息：', formData)
}

const onForgetPassword = () => {
  uni.navigateTo({
    url: '/pages/forget-password/forget-password'
  })
}

const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  })
}
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background: #f0f2ff;
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(108, 111, 216, 0.1);
}

.welcome-text {
  text-align: center;
  margin-bottom: 60rpx;
  
  .title {
    font-size: 48rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #666;
  }
}

.form-group {
  .input-group {
    position: relative;
    margin-bottom: 32rpx;
    
    .input-icon {
      position: absolute;
      left: 24rpx;
      top: 50%;
      transform: translateY(-50%);
      color: #6c6fd8;
      font-size: 36rpx;
    }
    
    .input {
      width: 100%;
      height: 96rpx;
      background: #f7f8ff;
      border-radius: 16rpx;
      padding: 0 24rpx 0 80rpx;
      font-size: 28rpx;
      color: #333;
      
      &::placeholder {
        color: #999;
      }
    }
  }
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  
  .remember-box {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #666;
  }
  
  .forget-link {
    font-size: 24rpx;
    color: #6c6fd8;
  }
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #6c6fd8, #8b8eea);
  border-radius: 16rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}

.register-link {
  text-align: center;
  font-size: 24rpx;
  color: #666;
  
  .link {
    color: #6c6fd8;
    margin-left: 8rpx;
  }
}
</style> 