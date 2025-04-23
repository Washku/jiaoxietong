import { request, uploadFile } from '../utils/request'

// 用户认证相关接口
export const auth = {
  // 用户登录
  login: (data) => {
    return request({
      url: '/auth/login',
      method: 'POST',
      data
    })
  },

  // 用户注册
  register: (data) => {
    return request({
      url: '/auth/register',
      method: 'POST',
      data
    })
  },

  // 发送验证码
  sendVerifyCode: (data) => {
    return request({
      url: '/auth/sendVerifyCode',
      method: 'POST',
      data
    })
  }
}

// 事故管理相关接口
export const accident = {
  // 创建事故记录
  create: (data) => {
    return request({
      url: '/accidents',
      method: 'POST',
      data,
      contentType: 'multipart/form-data'
    })
  },

  // 获取事故列表
  getList: (params) => {
    return request({
      url: '/accidents',
      method: 'GET',
      data: params
    })
  },

  // 获取事故详情
  getDetail: (id) => {
    return request({
      url: `/accidents/${id}`,
      method: 'GET'
    })
  }
}

// 紧急服务相关接口
export const emergency = {
  // 获取附近紧急服务点
  getNearby: (params) => {
    return request({
      url: '/emergency/nearby',
      method: 'GET',
      data: params
    })
  },

  // 一键求助
  help: (data) => {
    return request({
      url: '/emergency/help',
      method: 'POST',
      data
    })
  }
}

// 用户中心相关接口
export const user = {
  // 获取用户信息
  getProfile: () => {
    return request({
      url: '/user/profile',
      method: 'GET'
    })
  },

  // 更新用户信息
  updateProfile: (data) => {
    return request({
      url: '/user/profile',
      method: 'PUT',
      data,
      contentType: 'multipart/form-data'
    })
  }
}

// 文件上传相关接口
export const upload = {
  // 上传图片
  image: (filePath, type) => {
    return uploadFile({
      url: '/upload/image',
      filePath,
      name: 'file',
      formData: { type }
    })
  }
}

// 事故责任划分相关接口
export const accidentRules = {
  // 获取事故类型列表
  getTypes: () => {
    return request.get('/accident-rules/types')
  },

  // 获取事故场景列表
  getScenarios: (typeId) => {
    return request.get(`/accident-rules/scenarios/${typeId}`)
  },

  // 获取责任规则列表
  getRules: (scenarioId) => {
    return request.get(`/accident-rules/rules/${scenarioId}`)
  },

  // 获取赔偿标准
  getCompensation: (ruleId) => {
    return request.get(`/accident-rules/compensation/${ruleId}`)
  },

  // 计算赔偿金额
  calculateCompensation: (ruleId, actualAmounts) => {
    return request.post(`/accident-rules/calculate/${ruleId}`, {
      actualAmounts
    })
  }
}

// 事故识别相关接口
export const accidentRecognition = {
  // 上传事故图片进行识别
  recognizeAccident: (imageFile) => {
    return uploadFile('/accident-recognition/analyze', imageFile)
  },

  // 上传事故描述进行识别
  analyzeDescription: (description) => {
    return request.post('/accident-recognition/analyze-text', {
      description
    })
  },

  // 获取识别结果建议
  getSuggestions: (recognitionId) => {
    return request.get(`/accident-recognition/suggestions/${recognitionId}`)
  }
} 