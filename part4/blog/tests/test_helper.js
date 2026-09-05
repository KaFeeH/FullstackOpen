const Blog = require("../models/blog.js");

const initialBlogs = [
  {
    title: "The Cathedral and the Bazaar",
    author: "Eric S. Raymond",
    url: "https://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/",
    likes: 12,
  },
  {
    title: "Homesteading the Noosphere",
    author: "Eric S. Raymond",
    url: "https://www.catb.org/~esr/writings/homesteading/",
    likes: 7,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: "will be removed",
    author: "Test author",
    url: "https://example.com/will-be-removed",
  });

  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
};
