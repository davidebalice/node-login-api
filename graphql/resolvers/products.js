const Product = require('../../models/productModel');

module.exports = {
  Query: {
    products: async (parent, args, context, info) => {
      try {
        const products = await Product.find().select('id name photo price');
        return products;
      } catch (error) {
        throw new Error('Error searching product.');
      }
    },
  },
};
