const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const blogsRouter = require("./controllers/blogs.js");
const loginRouter = require("./controllers/login.js");
const usersRouter = require("./controllers/users.js");
const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const { tokenExtractor, errorHandler } = require("./utils/middleware.js");

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
  return response.status(200).send(`Live ${date.toString()}`);
});

app.use(tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(errorHandler);

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error(error.message);
  });

module.exports = app;
