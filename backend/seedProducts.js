const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require("./models/Order");

const mongoURI = 'mongodb://127.0.0.1:27017/mydatabase';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch((error) => console.error('Kết nối MongoDB thất bại:', error));

const categories = [
  { name: 'Khai vị và ăn kèm', code: '1' },
  { name: 'Thịt bò ', code: '2' },
  { name: 'Cơm canh', code: '3' },
  { name: 'Lẩu', code: '4' },
  { name: 'Tráng miệng', code: '5' }
];

const products = [
  { name: 'Salad cá hồi', price: 89000, description: 'High-end ', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60017509_saladtom_1.jpg', quantity: 12, categoryCode: '1', productCode: '1'},
  { name: 'Salad mùa xuân', price: 79000, description: 'Latest', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60018682_Salad_mua_xuan_1.jpg', quantity: 20, categoryCode: '1',productCode:'2' },
  { name: 'Tbone Steak', price: 300, description: '100g', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60010908_Tbone_1.jpg', quantity: 15, categoryCode: '2',productCode:'3' },
  { name: 'Sườn non bò Mỹ hảo hạng', price: 15, description: '200g', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60010633_suon_hh_tuoi_200_1.jpg', quantity: 50, categoryCode: '2',productCode:'4' },
  { name: 'Cơm rang kim chi (ALC)', price: 25, description: 'Cơm rang kim chi', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60013787_comrang_kimchi-min_1_1.jpg', quantity: 30, categoryCode: '3',productCode:'5' },
  { name: 'Cơm bát đá nóng', price: 20, description: 'Cotton t-shirt', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60000086_com_bat_da_1_1.jpg', quantity: 40, categoryCode: '3',productCode:'6' },
  { name: 'Lẩu dê', price: 40, description: 'Denim jeans', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60017527_laude_1.jpg', quantity: 25, categoryCode: '4',productCode:'7' },
  { name: 'Lẩu kim chi cỡ lớn', price: 60, description: 'Kitchen blender', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60000115_Lau_Kimchi_1.jpg', quantity: 10, categoryCode: '4',productCode:'8' },
  { name: 'Kem Caramen Plan Cake', price: 30, description: 'Electric toaster', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60000165_Caramel_1_1.jpg', quantity: 18, categoryCode: '5',productCode:'9' },
  { name: 'Mochi trà xanh', price: 70, description: 'Professional tennis racket', img_url: 'https://brand-pcms.ggg.systems/media/catalog/product/cache/fccf9bc1c56510f6f2e84ded9c30a375/6/0/60007832_mochi_tra_xanh_1_1.jpg', quantity: 8, categoryCode: '5',productCode:'10' }
];

const seedDB = async () => {
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Order.deleteMany({});
  
  // Tạo các loại sản phẩm
  const createdCategories = await Category.insertMany(categories);
  const categoryMap = createdCategories.reduce((map, category) => {
    map[category.code] = category._id;
    return map;
  }, {});

  // Tạo các sản phẩm và liên kết với loại sản phẩm
  const productsWithCategory = products.map(product => ({
    ...product,
    category: categoryMap[product.categoryCode]
  }));

  await Product.insertMany(productsWithCategory);
  console.log('Đã thêm sản phẩm và loại sản phẩm thành công');
  mongoose.connection.close();
};

seedDB();
