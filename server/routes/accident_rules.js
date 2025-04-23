const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 获取所有事故类型
router.get('/types', async (req, res) => {
  try {
    const [types] = await pool.query('SELECT * FROM accident_types ORDER BY code');
    res.json({
      code: 200,
      data: types
    });
  } catch (error) {
    console.error('获取事故类型错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 获取指定事故类型的所有场景
router.get('/scenarios/:typeId', async (req, res) => {
  try {
    const [scenarios] = await pool.query(
      'SELECT * FROM accident_scenarios WHERE type_id = ? ORDER BY code',
      [req.params.typeId]
    );
    res.json({
      code: 200,
      data: scenarios
    });
  } catch (error) {
    console.error('获取事故场景错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 获取指定场景的责任划分规则
router.get('/rules/:scenarioId', async (req, res) => {
  try {
    const [rules] = await pool.query(
      'SELECT * FROM responsibility_rules WHERE scenario_id = ? ORDER BY rule_code',
      [req.params.scenarioId]
    );
    res.json({
      code: 200,
      data: rules
    });
  } catch (error) {
    console.error('获取责任规则错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 获取指定规则的所有赔偿标准
router.get('/compensation/:ruleId', async (req, res) => {
  try {
    const [standards] = await pool.query(
      `SELECT cs.*, ci.name as item_name, ci.description as item_description
       FROM compensation_standards cs
       JOIN compensation_items ci ON cs.item_id = ci.id
       WHERE cs.rule_id = ?
       ORDER BY ci.code`,
      [req.params.ruleId]
    );
    res.json({
      code: 200,
      data: standards
    });
  } catch (error) {
    console.error('获取赔偿标准错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 根据事故类型和场景查询完整的责任划分和赔偿信息
router.get('/full-info', async (req, res) => {
  try {
    const { typeId, scenarioId } = req.query;

    if (!typeId || !scenarioId) {
      return res.status(400).json({
        code: 400,
        message: '请提供事故类型ID和场景ID'
      });
    }

    // 获取事故类型信息
    const [types] = await pool.query(
      'SELECT * FROM accident_types WHERE id = ?',
      [typeId]
    );

    if (types.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '事故类型不存在'
      });
    }

    // 获取场景信息
    const [scenarios] = await pool.query(
      'SELECT * FROM accident_scenarios WHERE id = ? AND type_id = ?',
      [scenarioId, typeId]
    );

    if (scenarios.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '事故场景不存在'
      });
    }

    // 获取责任规则
    const [rules] = await pool.query(
      'SELECT * FROM responsibility_rules WHERE scenario_id = ?',
      [scenarioId]
    );

    // 获取所有赔偿标准
    const [standards] = await pool.query(
      `SELECT cs.*, ci.name as item_name, ci.description as item_description
       FROM compensation_standards cs
       JOIN compensation_items ci ON cs.item_id = ci.id
       WHERE cs.rule_id IN (?)
       ORDER BY ci.code`,
      [rules.map(rule => rule.id)]
    );

    // 组织数据结构
    const result = {
      accident_type: types[0],
      scenario: scenarios[0],
      responsibility_rules: rules.map(rule => ({
        ...rule,
        compensation_standards: standards.filter(
          standard => standard.rule_id === rule.id
        )
      }))
    };

    res.json({
      code: 200,
      data: result
    });
  } catch (error) {
    console.error('获取完整信息错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 计算事故赔偿金额
router.post('/calculate-compensation', async (req, res) => {
  try {
    const { ruleId, actualAmounts } = req.body;

    if (!ruleId || !actualAmounts || !Array.isArray(actualAmounts)) {
      return res.status(400).json({
        code: 400,
        message: '请提供规则ID和实际损失金额'
      });
    }

    // 获取责任规则
    const [rules] = await pool.query(
      'SELECT * FROM responsibility_rules WHERE id = ?',
      [ruleId]
    );

    if (rules.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '责任规则不存在'
      });
    }

    const rule = rules[0];

    // 获取标准赔偿金额
    const [standards] = await pool.query(
      `SELECT cs.*, ci.name as item_name
       FROM compensation_standards cs
       JOIN compensation_items ci ON cs.item_id = ci.id
       WHERE cs.rule_id = ?`,
      [ruleId]
    );

    // 计算实际赔偿金额
    const compensation = standards.map(standard => {
      const actualAmount = actualAmounts.find(
        amount => amount.itemId === standard.item_id
      )?.amount || standard.standard_amount;

      return {
        item_name: standard.item_name,
        standard_amount: standard.standard_amount,
        actual_amount: actualAmount,
        party_a_amount: (actualAmount * rule.party_a_responsibility) / 100,
        party_b_amount: (actualAmount * rule.party_b_responsibility) / 100
      };
    });

    // 计算总赔偿金额
    const total = compensation.reduce(
      (sum, item) => sum + item.actual_amount,
      0
    );

    res.json({
      code: 200,
      data: {
        rule: rule,
        compensation: compensation,
        total: total,
        party_a_total: (total * rule.party_a_responsibility) / 100,
        party_b_total: (total * rule.party_b_responsibility) / 100
      }
    });
  } catch (error) {
    console.error('计算赔偿金额错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 