const mongoose = require('mongoose');
require('dotenv').config({ path: './env' });
const uri = process.env.URI
console.log (typeof uri)
const connectDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connection success');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

module.exports = connectDatabase;