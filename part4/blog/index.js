const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const Blog = require("./models/blog");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { errorHandler } = require("./utils/middleware.js")

const app = express();

app.use(express.json());
app.use(cors());

app.get("/info", (request, response, next) => {
  const date = new Date();
  response.send(`Live ${date.toString()}`);
});

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.post("/api/blogs", (request, response, next) => {
  const blog = new Blog(request.body);
  blog.save().then((result) => {
    response.status(201).json(result);
  }).catch(next);
})

app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
