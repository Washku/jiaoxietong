<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar">
        <text class="iconfont icon-user"></text>
      </view>
      <view class="user-info">
        <text class="username">用户名</text>
        <text class="user-id">ID: 888888</text>
      </view>
    </view>

    <!-- 信息列表 -->
    <view class="info-list">
      <!-- 车辆信息 -->
      <view class="info-item" @tap="onNavigateTo('vehicle')">
        <view class="item-left">
          <text class="iconfont icon-car">🚗</text>
          <text class="item-title">车辆信息</text>
        </view>
        <text class="iconfont icon-arrow">></text>
      </view>

      <!-- 驾驶证信息 -->
      <view class="info-item" @tap="onNavigateTo('license')">
        <view class="item-left">
          <text class="iconfont icon-license">📄</text>
          <text class="item-title">驾驶证信息</text>
        </view>
        <text class="iconfont icon-arrow">></text>
      </view>

      <!-- 历史记录 -->
      <view class="info-item" @tap="onNavigateTo('history')">
        <view class="item-left">
          <text class="iconfont icon-history">📋</text>
          <text class="item-title">历史记录</text>
        </view>
        <text class="iconfont icon-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup>
const onNavigateTo = (type) => {
  const routes = {
    vehicle: '/pages/profile/vehicle',
    license: '/pages/profile/license',
    history: '/pages/profile/history'
  }
  
  uni.navigateTo({
    url: routes[type]
  })
}
</script>

<style lang="scss">
.profile-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.user-card {
  background: linear-gradient(135deg, #6c6fd8, #8b8eea);
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(108, 111, 216, 0.3);
  
  .avatar {
    width: 120rpx;
    height: 120rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 30rpx;
    
    .icon-user {
      color: #fff;
      font-size: 60rpx;
    }
  }
  
  .user-info {
    color: #fff;
    
    .username {
      font-size: 36rpx;
      font-weight: 500;
      margin-bottom: 8rpx;
      display: block;
    }
    
    .user-id {
      font-size: 24rpx;
      opacity: 0.8;
    }
  }
}

.info-list {
  background: #fff;
  border-radius: 24rpx;
  padding: 0 20rpx;
  
  .info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 20rpx;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-left {
      display: flex;
      align-items: center;
      
      .iconfont {
        font-size: 40rpx;
        margin-right: 20rpx;
        color: #6c6fd8;
      }
      
      .item-title {
        font-size: 28rpx;
        color: #333;
      }
    }
    
    .icon-arrow {
      color: #999;
      font-size: 24rpx;
    }
  }
}
</style> 