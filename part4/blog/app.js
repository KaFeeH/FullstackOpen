const blogsRouter = require("./controllers/blogs.js");
const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { errorHandler } = require("./utils/middleware.js");
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status - :response-time ms", {
    skip: () => process.env.NODE_ENV === "test",
  }),
);

app.get("/info", (_request, response) => {
  const date = new Date();
  response.send(`Live ${date.toString()}`);
});

app.use("/api/blogs", blogsRouter);
app.use(errorHandler);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error(error.message);
  });

module.exports = app;
