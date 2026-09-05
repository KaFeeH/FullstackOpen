const logger = require("./logger.js");

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

  if (response.headersSent) {
    return next(error);
  }

  logger.error(error.message);
  return response.status(500).json({
    error: "internal server error",
  });
};

module.exports = {
  errorHandler,
};
