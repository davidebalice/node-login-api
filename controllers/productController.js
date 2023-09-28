const Product = require('../models/productModel');
const ApiQuery = require('../middlewares/apiquery');
const AppError = require('../middlewares/error');
const catchAsync = require('../middlewares/catchAsync');
const { ObjectId } = require('mongodb');

exports.getProducts = async (req, res) => {
  try {
    let filterData = {};
    if (req.query.key) {
      const regex = new RegExp(req.query.key, 'i');
      filterData = { name: { $regex: regex } };
    }
    const setLimit = 12;
    const limit = req.query.limit * 1 || setLimit;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;
    const products = await Product.find(filterData).sort('-createdAt').skip(skip).limit(limit);

    res.status(200).json(
      products.map((product) => ({
        _id: product._id,
        id: product.id,
        name: product.name,
        photo: product.photo,
        price: product.price,
      }))
    );
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const product = await Product.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: "Nessun documento trovato con quell'ID",
      });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Errore durante la query:', err.message);
    console.error('Stack Trace:', err.stack);

    return res.status(500).json({
      status: 'error',
      message: 'Errore nella query del database',
    });
  }
};
