const Product = require('../../models/productModel');

module.exports = {
  Query: {
    product: async (parent, args, context, info) => {
      try {
        const { id } = args;

        if (!context.req.userId) {
          throw new Error('Not authenticated');
        }

        const product = await Product.findOne({ product_id: id });

        if (!product) {
          throw new Error('Product not found');
        }

        return product.toObject();
      } catch (error) {
        console.error(error.response.data);
        console.log(error);
        throw new Error('Error searching product.');
      }
    },
  },
};
