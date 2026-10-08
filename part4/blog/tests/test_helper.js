const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Blog = require("../models/blog.js");
const User = require("../models/user.js");
const config = require("../utils/config.js");

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

const rootData = {
  username: "root",
  name: "root",
  password: "sekret",
};

const initialUsers = [
  rootData,
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "sekret",
  },
];

const malformedId = "not-a-valid-object-id";

// Low cost factor: tests only need a valid hash, not a secure one
const saltRounds = 4;

const createUser = async ({ username, name = username, password }) => {
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return User.create({ username, name, passwordHash });
};

const createInitialUsers = () => Promise.all(initialUsers.map(createUser));

const tokenFor = (user, options = { expiresIn: 60 * 60 }) =>
  jwt.sign(
    { username: user.username, id: user.id },
    config.SECRET,
    options,
  );

const withToken = (request, token) =>
  request.set("Authorization", `Bearer ${token}`);

const createUserWithToken = async (userData) => {
  const user = await createUser(userData);
  return { user, token: tokenFor(user) };
};

const nonExistingId = () => new mongoose.Types.ObjectId().toString();

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  rootData,
  malformedId,
  createInitialUsers,
  createUser,
  tokenFor,
  withToken,
  createUserWithToken,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
