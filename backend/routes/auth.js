const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  check('email').isEmail().withMessage('Email không hợp lệ')
    .isLength({ min: 10, max: 50 }).withMessage('Email phải có độ dài từ 10 đến 50 ký tự'),
  check('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  check('username').notEmpty().withMessage('Tên người dùng không được để trống')
    .isLength({ min: 3, max: 30 }).withMessage('Tên người dùng phải có độ dài từ 3 đến 30 ký tự'),
  check('phone').notEmpty().withMessage('Số điện thoại không được để trống')
    .isLength({ min: 10, max: 15 }).withMessage('Số điện thoại phải có độ dài từ 10 đến 15 ký tự')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, username, phone });
    await newUser.save();
      
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
    console.error('Lỗi khi tạo người dùng:', error);
  }
});


// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng bằng email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo token
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

// Lấy thông tin người dùng
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;
