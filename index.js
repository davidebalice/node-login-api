const app = require('express')();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http').Server(app);
const validator = require('express-validator');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const schema = require('./graphql/schema');
const authMiddleware = require('./middlewares/auth');

app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  })
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connections successfully');
  })
  .catch((err) => {
    console.error('Errore nella connessione a MongoDB:', err);
  });

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection!');
  process.exit(1);
});

process.on('unchaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unchaught Exception!');
  process.exit(1);
});

var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var i18n = require('i18n-express');
var urlencodeParser = bodyParser.urlencoded({ extended: true });
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    key: 'user_sid',
    secret: 'secretkey123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1200000,
    },
  })
);
app.use(session({ resave: false, saveUninitialized: true, secret: 'nodedemo' }));

app.use(flash());
app.use(
  i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    siteLangs: ['es', 'en', 'de', 'ru', 'it', 'fr'],
    textsVarName: 'translation',
  })
);

const authRouter = require('./routers/authRoutes');
app.use('/api/', authRouter);

const productRouter = require('./routers/productRoutes');
app.use('/api/', productRouter);
app.use('/graphql/', authMiddleware);
const server = new ApolloServer({ schema, context: ({ req, res }) => ({ req, res }) });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer().then(() => {
  http.listen(8000, function () {
    console.log('listening on *:8000');
  });
});
