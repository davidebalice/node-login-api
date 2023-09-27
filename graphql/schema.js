const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const loginResolver = require('./resolvers/login');
const productsResolver = require('./resolvers/products');
const productResolver = require('./resolvers/product');

const typeDefs = `
type Query {
    products: [Product] 
    product(id: ID!): Product
  }
  
  type Product {
    id: ID!
    name: String!
    photo: String!
    price: Float!
    description: String
  }

  type LoginResponse {
    status: String!
    token: String!
    server: String!
  }
  
  type Mutation {
    login(username: String!, password: String!): LoginResponse
  }

`;

const resolvers = mergeResolvers([loginResolver, productsResolver, productResolver]);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
module.exports = schema;
