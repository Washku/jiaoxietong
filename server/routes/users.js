const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// 获取用户信息
router.get('/profile', auth, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, phone, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      data: users[0]
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 更新用户信息
router.put('/profile', auth, async (req, res) => {
  try {
    const { phone, email } = req.body;

    // 检查手机号是否已被使用
    if (phone) {
      const [existingUsers] = await pool.query(
        'SELECT id FROM users WHERE phone = ? AND id != ?',
        [phone, req.user.id]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          code: 400,
          message: '手机号已被使用'
        });
      }
    }

    // 更新用户信息
    await pool.query(
      'UPDATE users SET phone = ?, email = ? WHERE id = ?',
      [phone, email, req.user.id]
    );

    res.json({
      code: 200,
      message: '用户信息更新成功'
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 修改密码
router.put('/password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 获取用户信息
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    // 验证旧密码
    const isValidPassword = await bcrypt.compare(
      oldPassword,
      users[0].password
    );

    if (!isValidPassword) {
      return res.status(400).json({
        code: 400,
        message: '旧密码错误'
      });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({
      code: 200,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 