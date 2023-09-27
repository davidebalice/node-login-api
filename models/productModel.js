const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      unique: true,
      trim: true,
      maxlength: ['100', 'max 100 characters'],
      minlength: ['6', 'min 6 characters'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Product must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Product must have a description'],
    },
    price: {
      type: Number,
      required: [true, 'Product must have a price'],
    },
    product_id: {
      type: Number,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ product_id: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
