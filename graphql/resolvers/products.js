const Product = require('../../models/productModel');

module.exports = {
  Query: {
    products: async (parent, args, context, info) => {
      if (!context.req.userId) {
        throw new Error('Not authenticated');
      }

      const products = await Product.find().select('id name photo price');

      return products;
    },
  },
};
