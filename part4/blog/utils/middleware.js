const errorHandler = (error, _request, response, _next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message})
  }
}

module.exports = {
  errorHandler
}