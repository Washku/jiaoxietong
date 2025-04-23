<template>
  <view class="container">
    <!-- 地图区域 -->
    <view class="map-container" v-if="!mapError">
      <map
        class="map"
        :latitude="latitude"
        :longitude="longitude"
        :show-location="true"
        :scale="16"
        :markers="markers"
        @error="onMapError"
      ></map>
    </view>

    <!-- 地图加载失败提示 -->
    <view class="error-container" v-else>
      <view class="error-tips">
        <text class="tips-title">地图加载失败</text>
        <text class="tips-text">请检查网络连接或稍后重试</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-item" @tap="onAddAccident">
        <view class="action-btn add-btn">
          <text class="iconfont icon-add">+</text>
        </view>
        <text class="btn-text">添加事故</text>
      </view>

      <view class="action-item" @tap="onGoToEmergency">
        <view class="action-btn emergency-btn">
          <text class="iconfont icon-emergency">🚨</text>
        </view>
        <text class="btn-text">紧急服务</text>
      </view>

      <view class="action-item" @tap="onGoToProfile">
        <view class="action-btn profile-btn">
          <text class="iconfont icon-user">我</text>
        </view>
        <text class="btn-text">个人中心</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 地图相关状态
const latitude = ref(39.909)
const longitude = ref(116.397)
const markers = ref([])
const mapError = ref(false)

// 获取当前位置
const getLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      latitude.value = res.latitude
      longitude.value = res.longitude
      markers.value = [{
        id: 1,
        latitude: res.latitude,
        longitude: res.longitude,
        iconPath: '/static/location.png',
        width: 32,
        height: 32
      }]
    },
    fail: () => {
      onMapError()
    }
  })
}

// 地图错误处理
const onMapError = () => {
  mapError.value = true
  uni.showToast({
    title: '地图加载失败，请检查网络连接',
    icon: 'none',
    duration: 2000
  })
}

// 导航方法
const onAddAccident = () => {
  uni.navigateTo({
    url: '/pages/accident/add'
  })
}

const onGoToEmergency = () => {
  uni.navigateTo({
    url: '/pages/emergency/index'
  })
}

const onGoToProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/index'
  })
}

onMounted(() => {
  getLocation()
})
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  width: 100%;
  
  .map {
    width: 100%;
    height: 100%;
  }
}

.error-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  
  .error-tips {
    text-align: center;
    padding: 40rpx;
    
    .tips-title {
      font-size: 36rpx;
      color: #333;
      margin-bottom: 16rpx;
      display: block;
    }
    
    .tips-text {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.bottom-bar {
  height: 120rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 20rpx;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .action-btn {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8rpx;
      font-size: 40rpx;
      
      &.add-btn {
        background: linear-gradient(135deg, #6c6fd8, #8b8eea);
        color: #fff;
      }
      
      &.emergency-btn {
        background: linear-gradient(135deg, #ff6b6b, #ffa502);
        color: #fff;
      }
      
      &.profile-btn {
        background: linear-gradient(135deg, #2ed573, #7bed9f);
        color: #fff;
      }
    }
    
    .btn-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}
</style>
