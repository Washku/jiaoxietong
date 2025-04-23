<template>
  <view>
    <view class="content">
      <!-- 页面内容会自动注入这里 -->
    </view>
  </view>
</template>

<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
@import './static/iconfont.css';

/*每个页面公共css */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
}

/* 去除按钮默认边框 */
button {
  border: none;
}
button::after {
  border: none;
}

.content {
  width: 100%;
  min-height: 100vh;
}
</style>
