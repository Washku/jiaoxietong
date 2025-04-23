<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="iconfont">←</text>
      </view>
      <text class="nav-title">事故智能识别</text>
    </view>

    <!-- 主要内容区 -->
    <view class="content">
      <!-- 事故图片上传 -->
      <view class="section">
        <view class="section-title">上传事故图片</view>
        <view class="upload-area" @tap="chooseImage">
          <image 
            v-if="imageUrl" 
            :src="imageUrl" 
            mode="aspectFit" 
            class="preview-image"
          />
          <view v-else class="upload-placeholder">
            <text class="iconfont">+</text>
            <text class="upload-text">点击上传图片</text>
          </view>
        </view>
        <view class="upload-tips">支持jpg、png格式，大小不超过5MB</view>
      </view>

      <!-- 事故描述输入 -->
      <view class="section">
        <view class="section-title">事故描述</view>
        <textarea 
          class="description-input"
          v-model="description"
          placeholder="请详细描述事故经过，包括：&#10;1. 事故发生的时间、地点&#10;2. 事故涉及车辆数量&#10;3. 事故发生的具体过程&#10;4. 是否有人员受伤&#10;5. 车辆受损情况"
          :maxlength="500"
        />
        <view class="word-count">{{ description.length }}/500</view>
      </view>

      <!-- 识别按钮 -->
      <button 
        class="recognize-btn" 
        :disabled="!canRecognize"
        @tap="startRecognition"
      >
        开始识别
      </button>

      <!-- 识别结果 -->
      <view class="section" v-if="recognitionResult">
        <view class="section-title">识别结果</view>
        <view class="result-content">
          <!-- 事故类型 -->
          <view class="result-item">
            <text class="label">事故类型：</text>
            <text class="value">{{ recognitionResult.type }}</text>
          </view>

          <!-- 事故场景 -->
          <view class="result-item">
            <text class="label">事故场景：</text>
            <text class="value">{{ recognitionResult.scenario }}</text>
          </view>

          <!-- 责任划分建议 -->
          <view class="result-item">
            <text class="label">责任划分建议：</text>
            <view class="responsibility-info">
              <text>甲方责任：{{ recognitionResult.party_a_responsibility }}%</text>
              <text>乙方责任：{{ recognitionResult.party_b_responsibility }}%</text>
            </view>
          </view>

          <!-- 赔偿建议 -->
          <view class="result-item">
            <text class="label">赔偿建议：</text>
            <view class="compensation-info">
              <view 
                class="compensation-item"
                v-for="item in recognitionResult.compensation"
                :key="item.item_name"
              >
                <text class="item-name">{{ item.item_name }}</text>
                <text class="item-amount">建议金额：¥{{ item.suggested_amount }}</text>
                <text class="item-desc">{{ item.description }}</text>
              </view>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="action-buttons">
            <button 
              class="action-btn confirm"
              @tap="confirmResult"
            >
              确认结果
            </button>
            <button 
              class="action-btn modify"
              @tap="modifyResult"
            >
              修改结果
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { accidentRecognition } from '../../api'

// 图片上传相关
const imageUrl = ref('')
const imageFile = ref(null)

// 事故描述
const description = ref('')

// 识别结果
const recognitionResult = ref(null)

// 是否可以开始识别
const canRecognize = computed(() => {
  return imageUrl.value && description.value.trim().length > 0
})

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0]
      imageFile.value = res.tempFiles[0]
    }
  })
}

// 开始识别
const startRecognition = async () => {
  if (!canRecognize.value) return

  try {
    // 显示加载提示
    uni.showLoading({
      title: '正在识别...'
    })

    // 上传图片进行识别
    const imageRes = await accidentRecognition.recognizeAccident(imageFile.value)
    
    // 分析事故描述
    const textRes = await accidentRecognition.analyzeDescription(description.value)
    
    // 获取识别结果建议
    const suggestionsRes = await accidentRecognition.getSuggestions(imageRes.data.recognitionId)
    
    // 更新识别结果
    recognitionResult.value = {
      ...suggestionsRes.data,
      type: imageRes.data.type,
      scenario: textRes.data.scenario
    }

    // 隐藏加载提示
    uni.hideLoading()
  } catch (error) {
    console.error('事故识别失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '识别失败，请重试',
      icon: 'none'
    })
  }
}

// 确认结果
const confirmResult = () => {
  // 跳转到事故责任划分检索页面
  uni.navigateTo({
    url: '/pages/accident/search',
    success: () => {
      // 传递识别结果数据
      const eventChannel = getOpenerEventChannel()
      eventChannel.emit('acceptRecognitionResult', recognitionResult.value)
    }
  })
}

// 修改结果
const modifyResult = () => {
  // 清空识别结果
  recognitionResult.value = null
  // 清空图片
  imageUrl.value = ''
  imageFile.value = null
  // 清空描述
  description.value = ''
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  .nav-back {
    padding: 20rpx;
    margin-left: -20rpx;
  }

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
  }
}

.content {
  padding: 108rpx 30rpx 30rpx;
}

.section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    margin-bottom: 20rpx;
    color: #333;
  }
}

.upload-area {
  width: 100%;
  height: 400rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .preview-image {
    width: 100%;
    height: 100%;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #999;

    .iconfont {
      font-size: 60rpx;
      margin-bottom: 20rpx;
    }

    .upload-text {
      font-size: 28rpx;
    }
  }
}

.upload-tips {
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
  text-align: center;
}

.description-input {
  width: 100%;
  height: 300rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
}

.word-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.recognize-btn {
  width: 100%;
  height: 88rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 8rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30rpx 0;

  &:disabled {
    background-color: #ccc;
  }
}

.result-content {
  .result-item {
    margin-bottom: 30rpx;

    .label {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 10rpx;
      display: block;
    }

    .value {
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
    }

    .responsibility-info {
      display: flex;
      justify-content: space-between;
      font-size: 28rpx;
      color: #007AFF;
    }

    .compensation-info {
      .compensation-item {
        background-color: #f5f5f5;
        border-radius: 8rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;

        .item-name {
          font-size: 28rpx;
          font-weight: 500;
          margin-bottom: 10rpx;
          display: block;
        }

        .item-amount {
          font-size: 26rpx;
          color: #007AFF;
          margin-bottom: 10rpx;
          display: block;
        }

        .item-desc {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 20rpx;
    margin-top: 40rpx;

    .action-btn {
      flex: 1;
      height: 88rpx;
      border-radius: 8rpx;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &.confirm {
        background-color: #007AFF;
        color: #fff;
      }

      &.modify {
        background-color: #f5f5f5;
        color: #666;
      }
    }
  }
}
</style> 