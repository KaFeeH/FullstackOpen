const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  blog
    ? response.json(blog)
    : response.status(404).json({
        error: `blog with id ${request.params.id} not found`,
      });
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    await blog.deleteOne();
    return response.status(204).end();
  } else {
    return response.status(404).json({
      error: `blog with id ${request.params.id} not found`,
    });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedData = request.body;
  const blog = await Blog.findById(request.params.id);

  if (!blog)
    return response.status(404).json({
      error: `blog with id ${request.params.id} not found`,
    });

  const blogUpdated = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      $set: { ...updatedData },
    },
    { returnDocument: "after", runValidators: true },
  );
  response.status(200).json(blogUpdated);
});

blogsRouter.patch("/:id/like", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog)
    return response.status(404).json({
      error: `blog with id ${request.params.id} not found`,
    });

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      $inc: { likes: 1 },
    },
    { returnDocument: "after", runValidators: true },
  );
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
