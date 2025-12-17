const DatabaseManager = require('../config/database');
const User = require('../models/User');

const dbContext = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user from main database
    const mainConnection = await DatabaseManager.getMainConnection();
    const UserModel = mainConnection.model('User', User.schema);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let adminId;
    if (user.role === 'admin') {
      adminId = user._id.toString();
    } else {
      // For regular users, use their assigned admin or default to main database
      adminId = user.adminId || 'main';
    }

    // Get admin-specific database connection
    const connection = await DatabaseManager.getConnection(adminId);
    req.dbConnection = connection;
    req.adminId = adminId;
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection error', error: error.message });
  }
};

module.exports = dbContext;