const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app.js");
const Blog = require("../models/blog.js");
const User = require("../models/user.js");

const {
  usersInDb,
  createInitialUsers,
  nonExistingId,
  malformedId,
  tokenFor,
  withToken,
} = require("./test_helper.js");

const api = supertest(app);

describe("users API", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    await createInitialUsers();
  });

  describe("viewing users", () => {
    test("users are returned as json", async () => {
      await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all users are returned", async () => {
      const usersAtStart = await usersInDb();

      const response = await api.get("/api/users");

      assert.strictEqual(response.body.length, usersAtStart.length);
    });
  });

  describe("viewing a specific user", () => {
    test("returns the requested user by id", async () => {
      const usersAtStart = await usersInDb();
      const userToView = usersAtStart[0];

      const response = await api.get(`/api/users/${userToView.id}`);

      assert.deepStrictEqual(response.body, userToView);
    });

    test("fails with status code 404 if user does not exist", async () => {
      const id = nonExistingId();

      await api.get(`/api/users/${id}`).expect(404);
    });

    test("fails with status code 400 if id is malformed", async () => {
      await api.get(`/api/users/${malformedId}`).expect(400);
    });
  });

  describe("creating users", () => {
    test("succeeds with a fresh username", async () => {
      const usersAtStart = await usersInDb();

      const newUser = {
        username: "superuser",
        name: "superuser",
        password: "password",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test("fails with status code 400 if the password is shorter than three characters", async () => {
      const usersAtStart = await usersInDb();
      const newUser = {
        username: "superuser",
        name: "superuser",
        password: "12",
      };

      const response = await api.post("/api/users").send(newUser).expect(400);

      const usersAtEnd = await usersInDb();

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.strictEqual(
        response.body.error,
        "the minimum password length must be 3",
      );
    });

    test("fails with status code 400 if the username is missing", async () => {
      const usersAtStart = await usersInDb();
      const newUser = {
        name: "superuser",
        password: "password",
      };

      const response = await api.post("/api/users").send(newUser).expect(400);

      const usersAtEnd = await usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.strictEqual(response.body.error, "a username is required");
    });

    test("fails with status code 400 if the password is missing", async () => {
      const usersAtStart = await usersInDb();
      const newUser = {
        username: "superuser",
        name: "superuser",
      };

      const response = await api.post("/api/users").send(newUser).expect(400);

      const usersAtEnd = await usersInDb();

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.strictEqual(response.body.error, "a password is required");
    });

    test("fails with status code 400 if the username is shorter than three characters", async () => {
      const usersAtStart = await usersInDb();
      const newUser = {
        username: "ab",
        name: "superuser",
        password: "password",
      };

      const response = await api.post("/api/users").send(newUser).expect(400);

      const usersAtEnd = await usersInDb();

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.strictEqual(
        response.body.error,
        "the minimum username length must be 3",
      );
    });

    test("fails with status code 400 if the username is already taken", async () => {
      const usersAtStart = await usersInDb();
      const newUser = {
        username: usersAtStart[0].username,
        name: "duplicated",
        password: "password",
      };

      const response = await api.post("/api/users").send(newUser).expect(400);

      const usersAtEnd = await usersInDb();

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.strictEqual(
        response.body.error,
        "expected `username` to be unique",
      );
    });

    test("the password is hashed correctly", async () => {
      const plainPassword = "myPassword";
      const newUser = {
        username: "superuser",
        name: "superuser",
        password: plainPassword,
      };

      const response = await api.post("/api/users").send(newUser).expect(201);

      const user = await User.findById(response.body.id);
      assert.strictEqual(user.password, undefined);
      const passwordMatches = await bcrypt.compare(
        plainPassword,
        user.passwordHash,
      );
      assert(passwordMatches);
    });
  });

  describe("updating a user", () => {
    test("the user can update their own name and username", async () => {
      const [user] = await usersInDb();

      const response = await withToken(api.put(`/api/users/${user.id}`), tokenFor(user))
        .send({ username: "renamed", name: "New Name" })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const userAtEnd = await User.findById(user.id);
      assert.strictEqual(response.body.username, "renamed");
      assert.strictEqual(userAtEnd.username, "renamed");
      assert.strictEqual(userAtEnd.name, "New Name");
    });

    test("ignores passwordHash and blogs sent by the client", async () => {
      const [user] = await usersInDb();
      const { passwordHash: passwordHashAtStart } = await User.findById(user.id);

      await withToken(api.put(`/api/users/${user.id}`), tokenFor(user))
        .send({
          name: "New Name",
          passwordHash: "hacked",
          blogs: [nonExistingId()],
        })
        .expect(200);

      const userAtEnd = await User.findById(user.id);
      assert.strictEqual(userAtEnd.name, "New Name");
      assert.strictEqual(userAtEnd.username, user.username);
      assert.strictEqual(userAtEnd.passwordHash, passwordHashAtStart);
      assert.strictEqual(userAtEnd.blogs.length, 0);
    });

    test("fails with status code 401 if the token is missing", async () => {
      const [user] = await usersInDb();

      await api.put(`/api/users/${user.id}`).send({ name: "Hacked" }).expect(401);

      const userAtEnd = await User.findById(user.id);
      assert.strictEqual(userAtEnd.name, user.name);
    });

    test("fails with status code 403 if the user updates someone else", async () => {
      const [user, otherUser] = await usersInDb();

      await withToken(api.put(`/api/users/${otherUser.id}`), tokenFor(user))
        .send({ name: "Hacked" })
        .expect(403);

      const userAtEnd = await User.findById(otherUser.id);
      assert.strictEqual(userAtEnd.name, otherUser.name);
    });

    test("fails with status code 404 if the user does not exist", async () => {
      const [user] = await usersInDb();

      await withToken(api.put(`/api/users/${nonExistingId()}`), tokenFor(user))
        .send({ name: "Ghost" })
        .expect(404);
    });

    test("fails with status code 400 if the data is invalid", async () => {
      const [user] = await usersInDb();

      await withToken(api.put(`/api/users/${user.id}`), tokenFor(user))
        .send({ username: "ab" })
        .expect(400);

      const userAtEnd = await User.findById(user.id);
      assert.strictEqual(userAtEnd.username, user.username);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
