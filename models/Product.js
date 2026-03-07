const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  image: String,
  status: { type: Boolean, default: true },
  created_date: String,
  updated_date: String,
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);
