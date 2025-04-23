const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, phone, email } = req.body;

    // 检查用户名是否已存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR phone = ?',
      [username, phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '用户名或手机号已存在'
      });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const [result] = await pool.query(
      'INSERT INTO users (username, password, phone, email) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, phone, email]
    );

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 