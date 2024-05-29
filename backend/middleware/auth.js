const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Không tìm thấy token, ủy quyền bị từ chối' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

module.exports = auth;
