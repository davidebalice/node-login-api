const Product = require('../../models/productModel');

module.exports = {
  Query: {
    product: async (parent, args, context, info) => {
      try {
        const { id } = args;
        
        const product = await Product.findOne({ product_id: id });

        if (!product) {
          throw new Error('Product not found');
        }
        console.log(id);
        console.log(product);
        return product.toObject();
      } catch (error) {
        throw new Error('Error searching product.');
      }
    },
  },
};
