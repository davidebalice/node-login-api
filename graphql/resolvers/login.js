const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  return {
    status: 'success',
    token,
    server: 'node + mongodb',
  };
};

module.exports = {
  Mutation: {
    login: async (parent, args, context, info) => {
      try {
        const { username, password } = args;

        if (!username || !password) {
          throw new Error('Per favore, inserisci nome utente e password.');
        }

        const user = await User.findOne({ username }).select('+password');

        if (!user) {
          throw new Error('Nome utente o password non corretti.');
        }

        const correct = await user.correctPassword(password, user.password);

        if (!correct) {
          throw new Error('Nome utente o password non corretti.');
        }

        const tokenData = createSendToken(user, context.res);

        return tokenData;
      } catch (error) {
        throw new Error('Errore durante il login.' + error);
      }
    },
  },
};
