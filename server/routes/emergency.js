const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// 获取附近的紧急服务点
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        code: 400,
        message: '请提供位置信息'
      });
    }

    // 使用 MySQL 空间函数计算距离
    const [services] = await pool.query(
      `SELECT 
        id, name, type, address, phone, latitude, longitude,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )
        ) AS distance
       FROM emergency_services
       HAVING distance <= ?
       ORDER BY distance
       LIMIT 20`,
      [latitude, longitude, latitude, radius]
    );

    res.json({
      code: 200,
      data: services
    });
  } catch (error) {
    console.error('获取附近服务点错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 发送紧急求助
router.post('/help', auth, async (req, res) => {
  try {
    const { service_id, type, description } = req.body;

    if (!service_id || !type) {
      return res.status(400).json({
        code: 400,
        message: '请提供必要信息'
      });
    }

    // 检查服务点是否存在
    const [services] = await pool.query(
      'SELECT id FROM emergency_services WHERE id = ?',
      [service_id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '服务点不存在'
      });
    }

    // 创建求助记录
    const [result] = await pool.query(
      `INSERT INTO emergency_requests (
        user_id, service_id, type, description
      ) VALUES (?, ?, ?, ?)`,
      [req.user.id, service_id, type, description]
    );

    res.status(201).json({
      code: 201,
      message: '求助请求已发送',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('发送求助请求错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 获取求助记录
router.get('/requests', auth, async (req, res) => {
  try {
    const [requests] = await pool.query(
      `SELECT r.*, s.name as service_name, s.type as service_type
       FROM emergency_requests r
       LEFT JOIN emergency_services s ON r.service_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    res.json({
      code: 200,
      data: requests
    });
  } catch (error) {
    console.error('获取求助记录错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 