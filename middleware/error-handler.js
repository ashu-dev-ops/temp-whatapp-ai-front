const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err.msg);
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  // if (err instanceof CustomAPIError) {
  //   console.log(err);
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }
  if (err.name === "DateCastError") {
    customError.msg = `invalid`
    customError.statusCode = 404
  }
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value or email is already registered`;
    customError.statusCode = 400;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }); //run this to see the name of err then create some user friendly message for that err
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
