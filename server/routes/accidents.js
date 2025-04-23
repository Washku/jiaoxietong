const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// 创建事故记录
router.post('/', auth, async (req, res) => {
  try {
    const {
      type,
      date,
      location,
      description,
      vehicles,
      casualties,
      latitude,
      longitude,
      images
    } = req.body;

    // 开始事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 插入事故记录
      const [accidentResult] = await connection.query(
        `INSERT INTO accidents (
          type, date, location, description, vehicles, 
          casualties, latitude, longitude, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type, date, location, description, vehicles,
          casualties, latitude, longitude, req.user.id
        ]
      );

      const accidentId = accidentResult.insertId;

      // 插入事故图片
      if (images && images.length > 0) {
        const imageValues = images.map(url => [accidentId, url]);
        await connection.query(
          'INSERT INTO accident_images (accident_id, image_url) VALUES ?',
          [imageValues]
        );
      }

      await connection.commit();

      res.status(201).json({
        code: 201,
        message: '事故记录创建成功',
        data: { id: accidentId }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('创建事故记录错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 获取事故列表
router.get('/', auth, async (req, res) => {
  try {
    const [accidents] = await pool.query(
      `SELECT a.*, u.username, 
        GROUP_CONCAT(ai.image_url) as images
       FROM accidents a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN accident_images ai ON a.id = ai.accident_id
       WHERE a.user_id = ?
       GROUP BY a.id
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );

    // 处理图片数组
    accidents.forEach(accident => {
      accident.images = accident.images ? accident.images.split(',') : [];
    });

    res.json({
      code: 200,
      data: accidents
    });
  } catch (error) {
    console.error('获取事故列表错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 获取事故详情
router.get('/:id', auth, async (req, res) => {
  try {
    const [accidents] = await pool.query(
      `SELECT a.*, u.username, 
        GROUP_CONCAT(ai.image_url) as images
       FROM accidents a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN accident_images ai ON a.id = ai.accident_id
       WHERE a.id = ? AND a.user_id = ?
       GROUP BY a.id`,
      [req.params.id, req.user.id]
    );

    if (accidents.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '事故记录不存在'
      });
    }

    const accident = accidents[0];
    accident.images = accident.images ? accident.images.split(',') : [];

    res.json({
      code: 200,
      data: accident
    });
  } catch (error) {
    console.error('获取事故详情错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 