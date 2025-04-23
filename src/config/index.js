// API 基础URL
export const baseURL = 'http://test-db-mongodb.ns-n2l8ihnf.svc:27017/api/v1'

// 图片上传配置
export const uploadConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptTypes: ['jpg', 'jpeg', 'png', 'webp']
}

// 事故类型选项
export const accidentTypes = [
  '追尾碰撞',
  '侧面碰撞',
  '正面碰撞',
  '刮擦事故',
  '翻车事故',
  '其他事故'
]

// 紧急服务类型
export const emergencyTypes = {
  accident: '事故',
  medical: '医疗',
  repair: '维修'
}

// 紧急服务点类型
export const serviceTypes = {
  police: '警察局',
  hospital: '医院',
  repair: '修车厂'
} 