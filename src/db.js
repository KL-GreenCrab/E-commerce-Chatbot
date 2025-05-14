const { MongoClient } = require('mongodb');

// Đường dẫn kết nối đến MongoDB
const uri = 'mongodb://localhost:27017/EcomerceChatbot';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('EcomerceChatbot'); // Tên database
    }
    return db;
}

module.exports = connectDB; 