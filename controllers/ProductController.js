const Product = require('../models/Product');

const validateProduct = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!data.phone || data.phone.length < 10) {
    errors.push('Valid phone is required');
  }
  
  if (data.image && !data.image.startsWith('http')) {
    errors.push('Image must be valid URL');
  }
  
  if (typeof data.status !== 'boolean') {
    errors.push('Status must be boolean');
  }
  
  return errors.length === 0 ? true : errors;
};

// GET /api/products?page=1&limit=10&search=term
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const searchQuery = {
      isDeleted: false
    };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const productsAggregate = Product.aggregate([
      { $match: searchQuery },
      { $sort: { created_date: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          image: 1,
          status: 1,
          created_date: 1,
          updated_date: 1
        }
      }
    ]);

    const countAggregate = Product.aggregate([
      { $match: searchQuery },
      { $count: 'total' }
    ]);

    const [productsResult, countResult] = await Promise.all([
      productsAggregate.exec(),
      countAggregate.exec()
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      products: productsResult,
      page,
      totalPages,
      total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const validation = validateProduct(req.body);
    if (validation !== true) {
      return res.status(400).json({ success: false, message: validation.join(', ') });
    }

    const productData = {
      ...req.body,
      status: req.body.status !== false, // default true
      created_date: new Date(),
      updated_date: new Date()
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error creating product' });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const validation = validateProduct(req.body);
    if (validation !== true) {
      return res.status(400).json({ success: false, message: validation.join(', ') });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { 
        $set: { 
          ...req.body,
          updated_date: new Date()
        } 
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error updating product' });
  }
};

// DELETE /api/products/:id (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { isDeleted: true, updated_date: new Date() } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
};

// POST /api/products/bulk-delete
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'IDs array required' });
    }

    const result = await Product.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: { isDeleted: true, updated_date: new Date() } }
    );

    res.json({ 
      success: true, 
      message: `Deleted ${result.modifiedCount} products` 
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ success: false, message: 'Server error in bulk delete' });
  }
};

