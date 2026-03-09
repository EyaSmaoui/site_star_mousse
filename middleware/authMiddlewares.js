const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const requireAuthUser = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json("token not found");
  }

  jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json("invalid token");
    }

    const user = await userModel.findById(decodedToken.id);
    req.session.user = user;
    next();
  });
};

module.exports = { requireAuthUser };
      