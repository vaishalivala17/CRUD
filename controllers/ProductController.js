const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query;
    
    let query = { isDeleted: false };
    
    if (search) {
      query.name = search;
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(limitNum);
    
    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, email, phone, image, status } = req.body;
    
    const today = new Date().toISOString().split('T')[0];
    
    const newProduct = new Product({
      name,
      email,
      phone,
      image: image || '',
      status: status !== undefined ? status : true,
      created_date: today,
      updated_date: today
    });
    
    const savedProduct = await newProduct.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const { name, email, phone, image, status } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    if (name) product.name = name;
    if (email) product.email = email;
    if (phone) product.phone = phone;
    if (image !== undefined) product.image = image;
    if (status !== undefined) product.status = status;
    product.updated_date = today;
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    product.status = false;
    product.isDeleted = true;
    product.updated_date = new Date().toISOString().split('T')[0];
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk delete
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No IDs provided' });
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const result = await Product.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: { status: false, isDeleted: true, updated_date: today } }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} products deleted`,
      deletedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
