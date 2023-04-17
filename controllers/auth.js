const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  //   const { name, email, password } = req.body;
  //   console.log(name);
  //   if (!name) {
  //     console.log("run");
  //     throw new BadRequestError("please provide valid details");
  //   }
  console.log(req.body);
  const user = await User.create({ ...req.body });
  const token = user.createJwt();
  res.status(StatusCodes.CREATED).json({ user: { user: user.name }, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("provide valid password and email");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("user doesnt exsit");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = await user.createJwt();
  res.status(StatusCodes.OK).json({ user: { user: user.name }, token });

  res.send("login");
};
module.exports = {
  login,
  register,
};
