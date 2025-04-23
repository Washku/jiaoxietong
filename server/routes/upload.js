const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  },
  fileFilter: function (req, file, cb) {
    // 只允许上传图片
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error('只允许上传图片文件！'), false);
    }
    cb(null, true);
  }
});

// 上传图片
router.post('/image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '没有上传文件'
      });
    }

    // 返回文件访问URL
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      code: 200,
      message: '上传成功',
      data: {
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 删除图片
router.delete('/image/:filename', auth, (req, res) => {
  try {
    const filePath = path.join(uploadDir, req.params.filename);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        code: 404,
        message: '文件不存在'
      });
    }

    // 删除文件
    fs.unlinkSync(filePath);

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除文件错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 