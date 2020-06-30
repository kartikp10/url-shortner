const db = require('monk')(process.env.MONGODB_URI);
const urls = db.get('urls');
urls.createIndex({ alias: 1 }, { unique: true });

module.exports = { db, urls };
