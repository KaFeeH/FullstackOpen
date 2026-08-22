const config = require("../utils/config.js");
const logger = require("../utils/logger.js");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true},
  author: String,
  url: String,
  likes: Number,
});

mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info("Connected to MongoDB")
}).catch((error) => {logger.error(error.message)});

module.exports = mongoose.model("Blog", blogSchema);
