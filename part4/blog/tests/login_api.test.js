const { describe, test, before, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = require("../app.js");
const User = require("../models/user.js");
const config = require("../utils/config.js");
const { createUser, rootData } = require("./test_helper.js");

const api = supertest(app);

describe("login API", () => {
  let rootUser;

  before(async () => {
    await User.deleteMany({});
    rootUser = await createUser(rootData);
  });

  test("response correctly contains the username, name and token", async () => {
    const response = await api
      .post("/api/login")
      .send({
        username: rootData.username,
        password: rootData.password,
      })
      .expect(200);

    assert.deepStrictEqual(Object.keys(response.body).sort(), [
      "name",
      "token",
      "username",
    ]);
    assert.strictEqual(typeof response.body.token, "string");
    assert.strictEqual(response.body.username, rootUser.username);
    assert.strictEqual(response.body.name, rootUser.name);
  });

  test("the decoded token correctly contains the username and id", async () => {
    const response = await api
      .post("/api/login")
      .send({
        username: rootData.username,
        password: rootData.password,
      })
      .expect(200);

    const decoded = jwt.verify(response.body.token, config.SECRET);

    assert.strictEqual(decoded.username, rootUser.username);
    assert.strictEqual(decoded.id, rootUser.id);
  });

  test("fails with status code 401 if the username does not exist", async () => {
    const response = await api
      .post("/api/login")
      .send({
        username: "nonexistent-username",
        password: rootData.password,
      })
      .expect(401);

    assert.strictEqual(response.body.error, "invalid username or password");
  });

  test("fails with status code 401 if the password is incorrect", async () => {
    const response = await api
      .post("/api/login")
      .send({
        username: rootData.username,
        password: "incorrect-password",
      })
      .expect(401);

    assert.strictEqual(response.body.error, "invalid username or password");
  });
});

after(async () => {
  await mongoose.connection.close();
});
