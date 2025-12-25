require('dotenv').config();
const db = require('./src/config/db');

db.query('SELECT DATABASE()', (err, result) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to DB:', result);
  }
});
