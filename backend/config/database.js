const mongoose = require('mongoose');

class DatabaseManager {
  constructor() {
    this.connections = new Map();
  }

  async getConnection(adminId) {
    if (this.connections.has(adminId)) {
      return this.connections.get(adminId);
    }

    let connection;
    if (adminId === 'main') {
      // Use main database for users without specific admin
      connection = await this.getMainConnection();
    } else {
      const dbName = `dance-management-${adminId}`;
      connection = mongoose.createConnection(
        `mongodb://localhost:27017/${dbName}`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
    }

    this.connections.set(adminId, connection);
    return connection;
  }

  async getMainConnection() {
    if (!this.mainConnection) {
      this.mainConnection = mongoose.createConnection(
        process.env.MONGODB_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
    }
    return this.mainConnection;
  }
}

module.exports = new DatabaseManager();