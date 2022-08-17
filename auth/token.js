const jwt = require("jsonwebtoken"),
  key = process.env.JWTKEY,
  helpers = require("../helpers/api");

const generateToken = (_id) => {
  return jwt.sign({ id: _id }, key, { expiresIn: "2 days" });
};

const auth = (req, res, next) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
  } catch (err) {
    return helpers.handleError("Invalid token", res);
  }
  return next();
};

module.exports = { generateToken, auth };
