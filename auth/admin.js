const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require("../config.js");

function adminAuth(req, res, next) {
  try {
    const token = req.headers.token;

    if (!token) {
      res.status(403).json({
        message: "Please sign in again!",
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
    req.adminId = decoded.id;

    next();
  } catch (e) {
    res.status(401).json({
        message : "Invalid token"
    });
    return;
  }
}

module.exports = adminAuth;
