const connectDB = require('../db');

async function getCategories() {
    const db = await connectDB();
    const products = await db.collection('Product').find().toArray();
    return [...new Set(products.map(product => product.category))];
}

module.exports = { getCategories }; 