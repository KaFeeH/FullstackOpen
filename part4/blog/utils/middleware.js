const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user.js");
const config = require("./config.js");
const logger = require("./logger.js");

const tokenExtractor = (request, _response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const token = request.token;
  if (!token) {
    return response.status(401).json({
      error: "token missing",
    });
  }

  const decodedToken = jwt.verify(token, config.SECRET);

  if (!mongoose.isValidObjectId(decodedToken.id)) {
    return response.status(401).json({
      error: "token invalid",
    });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({
      error: "token user not found",
    });
  }

  request.user = user;
  next();
};

const errorHandler = (error, _request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({
      error: "malformatted id",
    });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message,
    });
  }

  if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  }

  if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  if (response.headersSent) {
    return next(error);
  }

  logger.error(error.message);

  return response.status(500).json({
    error: "internal server error",
  });
};

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler,
};
