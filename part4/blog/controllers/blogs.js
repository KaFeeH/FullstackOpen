const blogsRouter = require("express").Router();

const Blog = require("../models/blog.js");
const User = require("../models/user.js");
const { userExtractor } = require("../utils/middleware.js");

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  return response.status(200).json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });

  if (!blog) {
    return response.status(404).json({
      error: `blog with id ${id} not found`,
    });
  }

  return response.status(200).json(blog);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;
  const userId = request.user.id;

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: userId,
  });

  const savedBlog = await blog.save();
  await User.findByIdAndUpdate(userId, {
    $push: { blogs: savedBlog.id },
  });
  return response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(404).json({
      error: `blog with id ${id} not found`,
    });
  }

  if (!blog.user.equals(request.user.id)) {
    return response.status(403).json({
      error: "you can only delete your own blogs",
    });
  }

  await blog.deleteOne();
  await User.findByIdAndUpdate(request.user.id, {
    $pull: { blogs: blog.id },
  });

  return response.status(204).end();
});

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(404).json({
      error: `blog with id ${id} not found`,
    });
  }

  if (!blog.user.equals(request.user.id)) {
    return response.status(403).json({
      error: "you can only update your own blogs",
    });
  }

  const { title, author, url, likes } = request.body ?? {};
  const blogUpdated = await Blog.findByIdAndUpdate(
    id,
    {
      $set: { title, author, url, likes },
    },
    { returnDocument: "after", runValidators: true },
  );
  return response.status(200).json(blogUpdated);
});

blogsRouter.patch("/:id/like", async (request, response) => {
  const id = request.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    {
      $inc: { likes: 1 },
    },
    { returnDocument: "after", runValidators: true },
  );

  if (!updatedBlog) {
    return response.status(404).json({
      error: `blog with id ${id} not found`,
    });
  }

  return response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
