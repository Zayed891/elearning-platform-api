const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../config.js");

function userAuth(req, res, next) {
  try {
    const token = req.headers.token;

    if (!token) {
      res.status(403).json({
        message: "Please sign in again!",
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_USER_SECRET);
    req.userId = decoded.id;

    next();
  } catch (e) {
    res.status(401).json({
        message : "Invalid token"
    });
    return;
  }
}

module.exports = userAuth;