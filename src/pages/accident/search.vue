<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="iconfont">←</text>
      </view>
      <text class="nav-title">事故责任划分检索</text>
    </view>

    <!-- 主要内容区 -->
    <view class="content">
      <!-- 事故类型选择 -->
      <view class="section">
        <view class="section-title">事故类型</view>
        <view class="type-list">
          <view 
            class="type-item" 
            v-for="type in accidentTypes" 
            :key="type.id"
            :class="{ active: selectedType?.id === type.id }"
            @tap="selectType(type)"
          >
            {{ type.name }}
          </view>
        </view>
      </view>

      <!-- 事故场景选择 -->
      <view class="section" v-if="selectedType">
        <view class="section-title">事故场景</view>
        <view class="scenario-list">
          <view 
            class="scenario-item" 
            v-for="scenario in scenarios" 
            :key="scenario.id"
            :class="{ active: selectedScenario?.id === scenario.id }"
            @tap="selectScenario(scenario)"
          >
            {{ scenario.name }}
          </view>
        </view>
      </view>

      <!-- 责任划分结果 -->
      <view class="section" v-if="selectedScenario">
        <view class="section-title">责任划分</view>
        <view class="rules-list">
          <view 
            class="rule-item" 
            v-for="rule in rules" 
            :key="rule.id"
            :class="{ active: selectedRule?.id === rule.id }"
            @tap="selectRule(rule)"
          >
            <view class="rule-name">{{ rule.rule_name }}</view>
            <view class="rule-desc">{{ rule.description }}</view>
            <view class="rule-responsibility">
              <text>甲方责任：{{ rule.party_a_responsibility }}%</text>
              <text>乙方责任：{{ rule.party_b_responsibility }}%</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 赔偿标准 -->
      <view class="section" v-if="selectedRule">
        <view class="section-title">赔偿标准</view>
        <view class="compensation-list">
          <view 
            class="compensation-item" 
            v-for="standard in compensationStandards" 
            :key="standard.id"
          >
            <view class="item-name">{{ standard.item_name }}</view>
            <view class="item-amount">标准金额：¥{{ standard.standard_amount }}</view>
            <view class="item-desc">{{ standard.description }}</view>
          </view>
        </view>
      </view>

      <!-- 赔偿计算器 -->
      <view class="section" v-if="selectedRule">
        <view class="section-title">赔偿计算</view>
        <view class="calculator">
          <view 
            class="calculator-item" 
            v-for="standard in compensationStandards" 
            :key="standard.id"
          >
            <text class="item-label">{{ standard.item_name }}</text>
            <input 
              class="amount-input" 
              type="digit" 
              v-model="actualAmounts[standard.item_id]"
              placeholder="请输入实际金额"
            />
          </view>
          <button class="calculate-btn" @tap="calculateCompensation">计算赔偿</button>
        </view>
      </view>

      <!-- 计算结果 -->
      <view class="section" v-if="calculationResult">
        <view class="section-title">计算结果</view>
        <view class="result-content">
          <view class="result-item">
            <text class="label">总赔偿金额：</text>
            <text class="value">¥{{ calculationResult.total }}</text>
          </view>
          <view class="result-item">
            <text class="label">甲方应承担：</text>
            <text class="value">¥{{ calculationResult.party_a_total }}</text>
          </view>
          <view class="result-item">
            <text class="label">乙方应承担：</text>
            <text class="value">¥{{ calculationResult.party_b_total }}</text>
          </view>
          <view class="result-details">
            <view class="detail-title">详细赔偿项目：</view>
            <view 
              class="detail-item" 
              v-for="item in calculationResult.compensation" 
              :key="item.item_name"
            >
              <text class="item-name">{{ item.item_name }}</text>
              <text class="item-amount">¥{{ item.actual_amount }}</text>
              <text class="item-split">甲方：¥{{ item.party_a_amount }} / 乙方：¥{{ item.party_b_amount }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { accidentRules } from '../../api'

// 数据列表
const accidentTypes = ref([])
const scenarios = ref([])
const rules = ref([])
const compensationStandards = ref([])

// 选中项
const selectedType = ref(null)
const selectedScenario = ref(null)
const selectedRule = ref(null)

// 实际赔偿金额
const actualAmounts = ref({})

// 计算结果
const calculationResult = ref(null)

// 获取事故类型列表
const getAccidentTypes = async () => {
  try {
    const res = await accidentRules.getTypes()
    if (res.code === 200) {
      accidentTypes.value = res.data
    }
  } catch (error) {
    console.error('获取事故类型失败:', error)
  }
}

// 获取事故场景
const getScenarios = async (typeId) => {
  try {
    const res = await accidentRules.getScenarios(typeId)
    if (res.code === 200) {
      scenarios.value = res.data
      selectedScenario.value = null
      selectedRule.value = null
      calculationResult.value = null
    }
  } catch (error) {
    console.error('获取事故场景失败:', error)
  }
}

// 获取责任规则
const getRules = async (scenarioId) => {
  try {
    const res = await accidentRules.getRules(scenarioId)
    if (res.code === 200) {
      rules.value = res.data
      selectedRule.value = null
      calculationResult.value = null
    }
  } catch (error) {
    console.error('获取责任规则失败:', error)
  }
}

// 获取赔偿标准
const getCompensationStandards = async (ruleId) => {
  try {
    const res = await accidentRules.getCompensation(ruleId)
    if (res.code === 200) {
      compensationStandards.value = res.data
      // 初始化实际金额
      actualAmounts.value = {}
      compensationStandards.value.forEach(standard => {
        actualAmounts.value[standard.item_id] = standard.standard_amount
      })
      calculationResult.value = null
    }
  } catch (error) {
    console.error('获取赔偿标准失败:', error)
  }
}

// 选择事故类型
const selectType = (type) => {
  selectedType.value = type
  getScenarios(type.id)
}

// 选择事故场景
const selectScenario = (scenario) => {
  selectedScenario.value = scenario
  getRules(scenario.id)
}

// 选择责任规则
const selectRule = (rule) => {
  selectedRule.value = rule
  getCompensationStandards(rule.id)
}

// 计算赔偿金额
const calculateCompensation = async () => {
  if (!selectedRule.value) return

  try {
    const actualAmountsList = Object.entries(actualAmounts.value).map(([itemId, amount]) => ({
      itemId: parseInt(itemId),
      amount: parseFloat(amount) || 0
    }))

    const res = await accidentRules.calculateCompensation(
      selectedRule.value.id,
      actualAmountsList
    )

    if (res.code === 200) {
      calculationResult.value = res.data
    }
  } catch (error) {
    console.error('计算赔偿金额失败:', error)
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 页面加载时获取事故类型列表
onMounted(() => {
  getAccidentTypes()
})
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

.type-list, .scenario-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .type-item, .scenario-item {
    padding: 20rpx 30rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #666;

    &.active {
      background-color: #007AFF;
      color: #fff;
    }
  }
}

.rules-list {
  .rule-item {
    padding: 20rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    margin-bottom: 20rpx;

    &.active {
      background-color: #e6f2ff;
      border: 2rpx solid #007AFF;
    }

    .rule-name {
      font-size: 30rpx;
      font-weight: 500;
      margin-bottom: 10rpx;
    }

    .rule-desc {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 10rpx;
    }

    .rule-responsibility {
      display: flex;
      justify-content: space-between;
      font-size: 26rpx;
      color: #007AFF;
    }
  }
}

.compensation-list {
  .compensation-item {
    padding: 20rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    margin-bottom: 20rpx;

    .item-name {
      font-size: 28rpx;
      font-weight: 500;
      margin-bottom: 10rpx;
    }

    .item-amount {
      font-size: 26rpx;
      color: #007AFF;
      margin-bottom: 10rpx;
    }

    .item-desc {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.calculator {
  .calculator-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .item-label {
      width: 200rpx;
      font-size: 28rpx;
      color: #333;
    }

    .amount-input {
      flex: 1;
      height: 80rpx;
      background-color: #f5f5f5;
      border-radius: 8rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
    }
  }

  .calculate-btn {
    width: 100%;
    height: 88rpx;
    background-color: #007AFF;
    color: #fff;
    border-radius: 8rpx;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30rpx;
  }
}

.result-content {
  .result-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    font-size: 30rpx;

    .label {
      color: #666;
    }

    .value {
      color: #007AFF;
      font-weight: 500;
    }
  }

  .result-details {
    margin-top: 30rpx;
    padding-top: 20rpx;
    border-top: 2rpx solid #eee;

    .detail-title {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 20rpx;
      font-size: 26rpx;

      .item-name {
        color: #333;
        margin-bottom: 10rpx;
      }

      .item-amount {
        color: #007AFF;
        margin-bottom: 10rpx;
      }

      .item-split {
        color: #666;
      }
    }
  }
}
</style> 