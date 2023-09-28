const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    try {
      const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      req.userId = decoded.id;
    } catch (err) {
      console.error(err);
    }
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const tokenString = req.headers.authorization.split(' ')[1];

    try {
      const decoded = await jwt.verify(tokenString, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch (err) {
      console.error(err);
    }
  }

  next();
};
