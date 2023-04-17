const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
  }
  const token = authHeader.split(" ")[1];
  //   req.user=
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // we are adding this to user property to req obj
    req.user = { userId: payload.userId, name: payload.name };
    // we can access this user in our jobs controller
    // another way of getting user
    // const user = User.findById(payload.UserId).select("-password");

    // req.user = user;
    next(); //we are going to access these in our jobs controller , specifically use id
  } catch (error) {
    throw new UnauthenticatedError("invalid credentials");
  }
};
module.exports = auth;
