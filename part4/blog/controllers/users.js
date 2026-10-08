const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user.js");
const { userExtractor } = require("../utils/middleware.js");

const blogFields = { url: 1, title: 1, author: 1 };

usersRouter.get("/", async (_request, response) => {
  const users = await User.find({}).populate("blogs", blogFields);
  return response.status(200).json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const user = await User.findById(id).populate("blogs", blogFields);

  if (!user) {
    return response.status(404).json({
      error: `user with id ${id} not found`,
    });
  }

  return response.status(200).json(user);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!username) {
    return response.status(400).json({
      error: "a username is required",
    });
  }
  if (username.length < 3) {
    return response.status(400).json({
      error: "the minimum username length must be 3",
    });
  }
  if (!name) {
    return response.status(400).json({
      error: "a name is required",
    });
  }
  if (!password) {
    return response.status(400).json({
      error: "a password is required",
    });
  }
  if (password.length < 3) {
    return response.status(400).json({
      error: "the minimum password length must be 3",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

usersRouter.put("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const user = await User.findById(id);
  if (!user) {
    return response.status(404).json({
      error: `user with id ${id} not found`,
    });
  }

  if (user.id !== request.user.id) {
    return response.status(403).json({
      error: "you can only update your own user",
    });
  }

  const { username, name } = request.body ?? {};
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $set: { username, name },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return response.status(200).json(updatedUser);
});

module.exports = usersRouter;
