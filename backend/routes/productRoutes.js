const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const router = express.Router();

// Lấy danh sách sản phẩm
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo sản phẩm mới
router.post('/products', async (req, res) => {
  const { name, price, description, img_url, quantity, categoryCode, productCode } = req.body;

  try {
    const category = await Category.findOne({ code: categoryCode });
    if (!category) {
      return res.status(400).json({ message: 'Invalid category code' });
    }

    const product = new Product({
      name,
      price,
      description,
      img_url,
      quantity,
      category: category._id,
      productCode // Thêm mã sản phẩm vào đây
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Tìm kiếm sản phẩm gần đúng theo tên
// http://192.168.0.105:5000/api/product/search?productName=mùa
// http://192.168.0.105:5000  -> Domain/IP: 
// /api/product               -> Định tuyến ở file server.js
// /search                    -> nó là route ở phía dưới '/search'
// productName=mùa            -> query params
router.get('/search', async (req, res) => {
  try {
    const { productName } = req.query;

    if (!productName) {
      return res.status(400).json({ message: 'Missing search query' });
    }
    // mùa -> chữ này trong db  -> Unicode tổng hợp.                [ '\\u{6d}', '\\u{75}', '\\u{300}', '\\u{61}' ]
    // mùa -> chữ này được nhập từ keyboard -> Unicode     [ '\\u{6d}', '\\u{f9}', '\\u{61}' ]
    // 2 giá trị này khác nhau cần đưa về chung 1 bộ gõ. Unicode/Unicode tổng hợp.

    // Tìm kiếm sản phẩm gần đúng theo tên
    // const products = await Product.find({ $text: { $search: productName } }).limit(10);
    // NFKD -> Unicode tổng hợp
    // NFC -> Unicode
    // $options: 'i' -> đưa string search về lowercase
    
    const products = await Product.find({ "name": { $regex: '.*' + productName.normalize('NFKD') + '.*', $options: 'i' } }).limit(10);
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
// Lấy sản phẩm theo loại sản phẩm
router.get('/products/by-category', async (req, res) => {
  const { categoryCode } = req.query;

  if (!categoryCode) {
    return res.status(400).json({ message: 'Không tìm thấy mã loại' });
  }

  try {
    const category = await Category.findOne({ code: categoryCode });
    if (!category) {
      return res.status(400).json({ message: 'Invalid category code' });
    }

    const products = await Product.find({ category: category._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
