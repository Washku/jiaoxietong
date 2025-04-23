<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="iconfont">←</text>
      </view>
      <text class="nav-title">添加事故信息</text>
    </view>

    <!-- 主要内容区 -->
    <view class="content">
      <!-- 图片上传区域 -->
      <view class="upload-section">
        <view class="upload-title">现场照片</view>
        <view class="image-list">
          <view 
            class="image-item" 
            v-for="(image, index) in images" 
            :key="index"
          >
            <image :src="image" mode="aspectFill"></image>
            <view class="delete-btn" @tap="deleteImage(index)">×</view>
          </view>
          <view 
            class="upload-btn" 
            @tap="chooseImage" 
            v-if="images.length < 3"
          >
            <text class="iconfont">+</text>
            <text class="upload-text">上传照片</text>
          </view>
        </view>
        <text class="upload-tip">最多上传3张照片</text>
      </view>

      <!-- 信息表单 -->
      <view class="form-section">
        <view class="form-title">事故信息</view>
        
        <view class="form-item">
          <text class="label">事故类型</text>
          <picker 
            class="picker" 
            :range="accidentTypes" 
            @change="onTypeChange"
          >
            <view class="picker-text">
              {{ form.type || '请选择事故类型' }}
              <text class="iconfont">▼</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">事故时间</text>
          <picker 
            class="picker" 
            mode="date" 
            :value="form.date" 
            @change="onDateChange"
          >
            <view class="picker-text">
              {{ form.date || '请选择日期' }}
              <text class="iconfont">▼</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">事故地点</text>
          <input 
            class="input" 
            v-model="form.location" 
            placeholder="请输入事故发生地点"
          />
        </view>

        <view class="form-item">
          <text class="label">事故描述</text>
          <textarea 
            class="textarea" 
            v-model="form.description" 
            placeholder="请详细描述事故发生经过"
          />
        </view>

        <view class="form-item">
          <text class="label">涉事车辆</text>
          <input 
            class="input" 
            v-model="form.vehicles" 
            placeholder="请输入涉事车辆信息"
          />
        </view>

        <view class="form-item">
          <text class="label">人员伤亡</text>
          <input 
            class="input" 
            v-model="form.casualties" 
            placeholder="请输入人员伤亡情况"
          />
        </view>
      </view>
    </view>

    <!-- 底部提交按钮 -->
    <view class="submit-bar">
      <button class="submit-btn" @tap="submitForm">提交信息</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { accidentTypes } from '../../config'
import { accident, upload } from '../../api'

// 图片列表
const images = ref([])
const imageFiles = ref([])

// 表单数据
const form = reactive({
  type: '',
  date: '',
  location: '',
  description: '',
  vehicles: '',
  casualties: '',
  latitude: 0,
  longitude: 0
})

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 3 - images.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths]
      imageFiles.value = [...imageFiles.value, ...res.tempFiles]
    }
  })
}

// 删除图片
const deleteImage = (index) => {
  images.value.splice(index, 1)
  imageFiles.value.splice(index, 1)
}

// 事故类型选择
const onTypeChange = (e) => {
  form.type = accidentTypes[e.detail.value]
}

// 日期选择
const onDateChange = (e) => {
  form.date = e.detail.value
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 获取当前位置
const getLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      form.latitude = res.latitude
      form.longitude = res.longitude
    }
  })
}

// 上传图片
const uploadImages = async () => {
  const uploadPromises = imageFiles.value.map(file => 
    upload.image(file.path, 'accident')
  )
  const results = await Promise.all(uploadPromises)
  return results.map(result => result.url)
}

// 提交表单
const submitForm = async () => {
  // 表单验证
  if (!form.type) {
    uni.showToast({
      title: '请选择事故类型',
      icon: 'none'
    })
    return
  }
  if (!form.date) {
    uni.showToast({
      title: '请选择事故时间',
      icon: 'none'
    })
    return
  }
  if (!form.location) {
    uni.showToast({
      title: '请输入事故地点',
      icon: 'none'
    })
    return
  }
  if (!form.description) {
    uni.showToast({
      title: '请输入事故描述',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({
      title: '提交中...'
    })

    // 上传图片
    const imageUrls = await uploadImages()

    // 创建事故记录
    const formData = new FormData()
    formData.append('type', form.type)
    formData.append('date', form.date)
    formData.append('location', form.location)
    formData.append('description', form.description)
    formData.append('vehicles', form.vehicles)
    formData.append('casualties', form.casualties)
    formData.append('latitude', form.latitude)
    formData.append('longitude', form.longitude)
    
    // 添加图片
    imageUrls.forEach((url, index) => {
      formData.append('images', url)
    })

    await accident.create(formData)

    uni.hideLoading()
    uni.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      }
    })
  } catch (error) {
    uni.hideLoading()
    console.error('提交失败:', error)
  }
}

// 页面加载时获取位置
onMounted(() => {
  getLocation()
})
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  height: 88rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .nav-back {
    font-size: 40rpx;
    color: #333;
    padding: 20rpx;
    margin-left: -20rpx;
  }
  
  .nav-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
}

.content {
  flex: 1;
  padding: 30rpx;
}

.upload-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .upload-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .image-item {
      width: 200rpx;
      height: 200rpx;
      position: relative;
      
      image {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
      }
      
      .delete-btn {
        position: absolute;
        top: -20rpx;
        right: -20rpx;
        width: 40rpx;
        height: 40rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
      }
    }
    
    .upload-btn {
      width: 200rpx;
      height: 200rpx;
      background: #f8f8f8;
      border: 2rpx dashed #ddd;
      border-radius: 8rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        font-size: 48rpx;
        color: #999;
        margin-bottom: 10rpx;
      }
      
      .upload-text {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
  
  .upload-tip {
    font-size: 24rpx;
    color: #999;
    margin-top: 20rpx;
  }
}

.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  
  .form-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .form-item {
    margin-bottom: 30rpx;
    
    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 16rpx;
      display: block;
    }
    
    .input {
      width: 100%;
      height: 80rpx;
      background: #f8f8f8;
      border-radius: 8rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
    }
    
    .textarea {
      width: 100%;
      height: 200rpx;
      background: #f8f8f8;
      border-radius: 8rpx;
      padding: 24rpx;
      font-size: 28rpx;
      color: #333;
    }
    
    .picker {
      width: 100%;
      
      .picker-text {
        height: 80rpx;
        background: #f8f8f8;
        border-radius: 8rpx;
        padding: 0 24rpx;
        font-size: 28rpx;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .iconfont {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.submit-bar {
  padding: 30rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #6c6fd8, #8b8eea);
    border-radius: 44rpx;
    color: #fff;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
}
</style> 