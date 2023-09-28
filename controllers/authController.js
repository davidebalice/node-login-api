const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const ApiQuery = require('../middlewares/apiquery');
const catchAsync = require('../middlewares/catchAsync');
const AppError = require('../middlewares/error');
const Email = require('../middlewares/email');
const User = require('../models/userModel');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    server: 'node + mongodb',
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      status: 'error',
      message: 'Please insert username and password',
    });
  }

  const user = await User.findOne({ username }).select('+password');

  if (!user) {
    res.status(400).json({
      status: 'error',
      message: 'Incorrect username or password',
    });
  }

  const correct = await user.correctPassword(password, user.password);

  if (!correct) {
    res.status(400).json({
      status: 'error',
      message: 'Incorrect username or password',
    });
  }

  createSendToken(user, 200, req, res);
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  }

  if (!token || token === undefined) {
    res.status(400).json({
      status: 'error',
      message: 'Token non present',
    });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The token area expired, please login.', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('Yot are changed password, please log in', 401));
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
});
