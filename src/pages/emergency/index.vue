<template>
  <view class="emergency-container">
    <view class="location-card">
      <view class="location-title">当前位置</view>
      <view class="location-text">正在获取位置信息...</view>
    </view>

    <view class="service-grid">
      <!-- 报警服务 -->
      <view class="service-item" @tap="onCallPolice">
        <view class="service-icon police">
          <text class="icon">👮</text>
        </view>
        <text class="service-name">一键报警</text>
        <text class="service-number">110</text>
      </view>

      <!-- 救护车 -->
      <view class="service-item" @tap="onCallAmbulance">
        <view class="service-icon ambulance">
          <text class="icon">🚑</text>
        </view>
        <text class="service-name">呼叫救护</text>
        <text class="service-number">120</text>
      </view>

      <!-- 道路救援 -->
      <view class="service-item" @tap="onCallRoadside">
        <view class="service-icon roadside">
          <text class="icon">🚗</text>
        </view>
        <text class="service-name">道路救援</text>
        <text class="service-number">400</text>
      </view>

      <!-- 交通事故处理 -->
      <view class="service-item" @tap="onCallTraffic">
        <view class="service-icon traffic">
          <text class="icon">🚦</text>
        </view>
        <text class="service-name">交通事故</text>
        <text class="service-number">122</text>
      </view>
    </view>

    <view class="notice">
      <text class="notice-title">温馨提示</text>
      <text class="notice-text">1. 如遇紧急情况，请优先拨打报警电话</text>
      <text class="notice-text">2. 确保您的位置信息准确无误</text>
      <text class="notice-text">3. 保持电话畅通，等待救援人员到达</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 拨打电话
const makePhoneCall = (number) => {
  uni.makePhoneCall({
    phoneNumber: number,
    success: () => {
      console.log('拨打电话成功')
    },
    fail: () => {
      uni.showToast({
        title: '拨打电话失败',
        icon: 'none'
      })
    }
  })
}

// 各种服务的拨打电话事件
const onCallPolice = () => makePhoneCall('110')
const onCallAmbulance = () => makePhoneCall('120')
const onCallRoadside = () => makePhoneCall('400-810-0122') // 示例号码
const onCallTraffic = () => makePhoneCall('122')
</script>

<style lang="scss">
.emergency-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.location-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .location-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .location-text {
    font-size: 32rpx;
    color: #333;
  }
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.service-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .service-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
    
    .icon {
      font-size: 60rpx;
    }
    
    &.police {
      background: rgba(108, 111, 216, 0.1);
    }
    
    &.ambulance {
      background: rgba(255, 107, 107, 0.1);
    }
    
    &.roadside {
      background: rgba(255, 165, 2, 0.1);
    }
    
    &.traffic {
      background: rgba(46, 213, 115, 0.1);
    }
  }
  
  .service-name {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 8rpx;
  }
  
  .service-number {
    font-size: 24rpx;
    color: #666;
  }
}

.notice {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  
  .notice-title {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .notice-text {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    display: block;
  }
}
</style> 