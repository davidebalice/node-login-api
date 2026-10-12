# Node Login API

Authentication API built with Node.js, Express and MongoDB, exposed both as a REST API and as a GraphQL API (Apollo Server).
Users log in with username and password and receive a JWT, which is then used to access protected product data.

The frontend is available in a separate repository: [react-frontend-login-api](https://github.com/davidebalice/react-frontend-login-api).

## Features

- Login with username and password, passwords hashed with bcrypt
- JWT returned in the response and stored in an HTTP-only cookie
- Protected REST endpoints for products
- GraphQL endpoint with a `login` mutation and `products` / `product` queries
- Authentication middleware that reads the token from the cookie or the `Authorization: Bearer` header

## Tech stack

- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) and [GraphQL](https://graphql.org/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) and [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## Getting started

### Requirements

- Node.js 20 or later
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/davidebalice/node-login-api.git
cd node-login-api
npm install
```

### Configuration

Create a `config.env` file in the project root:

```env
NODE_ENV=development
DATABASE=mongodb://127.0.0.1:27017/login_api

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

CORS is configured to accept requests from `http://localhost:3000`.

### Run

| Command     | Description                                              |
| ----------- | -------------------------------------------------------- |
| `npm start` | Start the server on `http://localhost:8000` with nodemon |

## API endpoints

### REST

| Method | Endpoint            | Description                                          |
| ------ | ------------------- | ---------------------------------------------------- |
| POST   | `/api/login`        | Log in with `username` and `password`, returns a JWT |
| GET    | `/api/products`     | List products (auth)                                 |
| GET    | `/api/products/:id` | Get a product (auth)                                 |

### GraphQL

Endpoint: `POST /graphql`

```graphql
mutation {
  login(username: "user", password: "password") {
    status
    token
  }
}

query {
  products {
    id
    name
    price
    photo
  }
}
```

The `products` and `product(id: ID!)` queries require the JWT (cookie or `Authorization: Bearer <token>` header).

## Project structure

```text
├── index.js        # Express app, Apollo Server and MongoDB connection
├── routers/        # REST routes
├── controllers/    # REST handlers
├── graphql/        # GraphQL schema and resolvers
├── models/         # Mongoose models (User, Product)
└── middlewares/    # Auth middleware, error handling
```

## Author

**Davide Balice** – [davidebalice.dev](https://www.davidebalice.dev)
