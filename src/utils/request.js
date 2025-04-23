import { baseURL } from '../config'

// 请求拦截器
const requestInterceptor = (config) => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { code, message, data } = response.data
  
  if (code === 200) {
    return data
  } else if (code === 401) {
    // token 失效，清除登录状态并跳转到登录页
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.navigateTo({
      url: '/pages/login/index'
    })
    return Promise.reject(new Error('登录已过期，请重新登录'))
  } else {
    uni.showToast({
      title: message || '请求失败',
      icon: 'none'
    })
    return Promise.reject(new Error(message || '请求失败'))
  }
}

// 统一请求方法
const request = (options) => {
  const config = requestInterceptor({
    url: baseURL + options.url,
    method: options.method || 'GET',
    data: options.data,
    header: {
      'Content-Type': options.contentType || 'application/json',
      ...options.header
    }
  })

  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (res) => {
        resolve(responseInterceptor(res))
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// 文件上传方法
const uploadFile = (options) => {
  const config = requestInterceptor({
    url: baseURL + options.url,
    method: 'POST',
    filePath: options.filePath,
    name: options.name || 'file',
    formData: options.formData,
    header: {
      'Content-Type': 'multipart/form-data',
      ...options.header
    }
  })

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      ...config,
      success: (res) => {
        const data = JSON.parse(res.data)
        resolve(responseInterceptor({ data }))
      },
      fail: (err) => {
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export { request, uploadFile } 