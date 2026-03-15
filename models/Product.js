const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    trim: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    trim: true 
  },
  status: { 
    type: Boolean, 
    default: true 
  },
  created_date: { 
    type: Date, 
    default: Date.now 
  },
  updated_date: { 
    type: Date, 
    default: Date.now 
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Indexes for performance and search
productSchema.index({ name: 'text', email: 'text', phone: 'text' });
productSchema.index({ isDeleted: 1 });
productSchema.index({ created_date: -1 });

module.exports = mongoose.model('Product', productSchema);
