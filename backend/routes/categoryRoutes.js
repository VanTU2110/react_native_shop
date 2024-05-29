const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Lấy danh sách loại sản phẩm
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo loại sản phẩm mới
router.post('/categories', async (req, res) => {
  const { name, code } = req.body;

  const category = new Category({
    name,
    code
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
