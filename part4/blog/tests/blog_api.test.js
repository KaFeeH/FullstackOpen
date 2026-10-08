const { test, after, beforeEach, before, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app.js");
const Blog = require("../models/blog.js");
const User = require("../models/user.js");
const config = require("../utils/config.js");
const {
  initialBlogs,
  blogsInDb,
  usersInDb,
  tokenFor,
  withToken,
  createUserWithToken,
  nonExistingId,
  malformedId,
  rootData,
} = require("./test_helper.js");

const api = supertest(app);

let rootToken;

const withRootToken = (request) => withToken(request, rootToken);

const createOtherUserWithToken = () =>
  createUserWithToken({
    username: "other",
    name: "other",
    password: "sekret",
  });

describe("blogs API", () => {
  let rootUser;

  before(async () => {
    await User.deleteMany({});
    ({ user: rootUser, token: rootToken } =
      await createUserWithToken(rootData));
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({ _id: { $ne: rootUser._id } });
    const blogs = initialBlogs.map((blog) => ({
      ...blog,
      user: rootUser._id,
    }));

    const savedBlogs = await Blog.insertMany(blogs);
    await User.findByIdAndUpdate(rootUser._id, {
      blogs: savedBlogs.map((blog) => blog._id),
    });
  });

  describe("viewing blogs", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
      const blogsAtStart = await blogsInDb();

      const response = await api.get("/api/blogs");

      assert.strictEqual(response.body.length, blogsAtStart.length);
    });

    test("blogs have an id property and hide database fields", async () => {
      const response = await api.get("/api/blogs");

      response.body.forEach((blog) => {
        assert.strictEqual(typeof blog.id, "string");
        assert(blog.id.length > 0);
        assert.strictEqual(blog._id, undefined);
        assert.strictEqual(blog.__v, undefined);
      });
    });

    test("a specific blog is within the returned blogs", async () => {
      const response = await api.get("/api/blogs");

      assert(
        response.body.some(
          (blog) => blog.title === "The Cathedral and the Bazaar",
        ),
      );
    });

    describe("viewing a specific blog", () => {
      test("succeeds with a valid id", async () => {
        const blogsAtStart = await blogsInDb();
        const blogToView = blogsAtStart[0];

        const response = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        const users = await usersInDb();
        const user = users.find(
          (user) => user.id === blogToView.user.toString(),
        );

        assert.deepStrictEqual(response.body, {
          ...blogToView,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
          },
        });
      });

      test("fails with status code 404 if blog does not exist", async () => {
        const id = nonExistingId();

        await api.get(`/api/blogs/${id}`).expect(404);
      });

      test("fails with status code 400 if id is malformed", async () => {
        await api.get(`/api/blogs/${malformedId}`).expect(400);
      });
    });
  });

  describe("adding a blog", () => {
    test("succeeds with valid data", async () => {
      const newBlog = {
        title: "The Mythical Man-Month",
        author: "Frederick P. Brooks Jr.",
        url: "https://en.wikipedia.org/wiki/The_Mythical_Man-Month",
      };

      const blogsAtStart = await blogsInDb();

      await withRootToken(api.post("/api/blogs"))
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
      assert(blogsAtEnd.some((blog) => blog.title === newBlog.title));
    });

    test("fails with status code 401 if the token is missing", async () => {
      const blogsAtStart = await blogsInDb();

      await api
        .post("/api/blogs")
        .send({
          title: "Unauthenticated blog",
          author: "A blog author",
          url: "https://example.com/unauthenticated",
        })
        .expect(401);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 401 if the token is invalid", async () => {
      await withToken(api.post("/api/blogs"), "invalid-token")
        .send({
          title: "Invalid token blog",
          author: "A blog author",
          url: "https://example.com/invalid-token",
        })
        .expect(401);
    });

    test("fails with status code 401 if the token is expired", async () => {
      const expiredToken = tokenFor(rootUser, { expiresIn: -1 });
      const blogsAtStart = await blogsInDb();

      const response = await withToken(api.post("/api/blogs"), expiredToken)
        .send({
          title: "Expired token blog",
          author: "A blog author",
          url: "https://example.com/expired-token",
        })
        .expect(401);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(response.body.error, "token expired");
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 401 if the token user no longer exists", async () => {
      const { user: deletedUser, token } = await createUserWithToken({
        username: "deleted",
        password: "sekret",
      });
      await deletedUser.deleteOne();
      const blogsAtStart = await blogsInDb();

      const response = await withToken(api.post("/api/blogs"), token)
        .send({
          title: "Blog without a user",
          author: "A blog author",
          url: "https://example.com/orphan-token",
        })
        .expect(401);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(response.body.error, "token user not found");
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 401 if the token has no id", async () => {
      const tokenWithoutId = jwt.sign(
        { username: rootUser.username },
        config.SECRET,
        { expiresIn: 60 * 60 },
      );
      const blogsAtStart = await blogsInDb();

      const response = await withToken(api.post("/api/blogs"), tokenWithoutId)
        .send({
          title: "No id token blog",
          author: "A blog author",
          url: "https://example.com/no-id-token",
        })
        .expect(401);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(response.body.error, "token invalid");
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 401 if the token contains an invalid id", async () => {
      const tokenWithInvalidId = jwt.sign(
        { username: rootUser.username, id: "invalid-id" },
        config.SECRET,
        { expiresIn: 60 * 60 },
      );
      const blogsAtStart = await blogsInDb();

      const response = await withToken(api.post("/api/blogs"), tokenWithInvalidId)
        .send({
          title: "Invalid id token blog",
          author: "A blog author",
          url: "https://example.com/invalid-id-token",
        })
        .expect(401);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(response.body.error, "token invalid");
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("returns the creator for a newly created blog", async () => {
      const newBlog = {
        title: "A blog with a creator",
        author: "A blog author",
        url: "https://example.com/blog-with-a-creator",
      };

      const response = await withRootToken(api.post("/api/blogs"))
        .send(newBlog)
        .expect(201);

      const blogId = response.body.id;
      const blogResponse = await api.get(`/api/blogs/${blogId}`).expect(200);

      assert.strictEqual(blogResponse.body.id, blogId);
      assert.deepStrictEqual(blogResponse.body.user, {
        id: rootUser.id,
        username: rootUser.username,
        name: rootUser.name,
      });
    });

    test("lists a newly created blog under its user", async () => {
      const newBlog = {
        title: "A blog listed under a user",
        author: "A blog author",
        url: "https://example.com/blog-listed-under-a-user",
      };

      const response = await withRootToken(api.post("/api/blogs"))
        .send(newBlog)
        .expect(201);

      const blogId = response.body.id;
      const usersResponse = await api.get("/api/users").expect(200);
      const userResponse = usersResponse.body.find(
        (returnedUser) => returnedUser.id === rootUser.id,
      );

      assert(userResponse);
      assert(userResponse.blogs.some((blog) => blog.id === blogId));
    });

    test("associates the blog with its user in both directions", async () => {
      const newBlog = {
        title: "Title example",
        author: "Author example",
        url: "https://exampleurl.com",
        likes: 0,
      };

      const response = await withRootToken(api.post("/api/blogs"))
        .send(newBlog)
        .expect(201);
      const userAtEnd = await User.findById(rootUser.id);
      const blogAtEnd = await Blog.findById(response.body.id);

      assert(
        userAtEnd.blogs.some(
          (blogId) => blogId.toString() === response.body.id,
        ),
      );
      assert.strictEqual(blogAtEnd.user.toString(), rootUser.id);
    });

    test("defaults likes to 0 if likes is omitted", async () => {
      const newBlog = {
        title: "A blog without likes",
        author: "A blog author",
        url: "https://example.com/blog-without-likes",
      };

      const response = await withRootToken(api.post("/api/blogs"))
        .send(newBlog)
        .expect(201);

      assert.strictEqual(response.body.likes, 0);
    });

    test("fails with status code 400 if title is missing", async () => {
      const newBlog = {
        author: "A blog author",
        url: "https://example.com/untitled-blog",
      };

      const blogsAtStart = await blogsInDb();

      await withRootToken(api.post("/api/blogs")).send(newBlog).expect(400);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 400 if url is missing", async () => {
      const newBlog = {
        title: "A blog without url",
        author: "A blog author",
      };

      const blogsAtStart = await blogsInDb();

      await withRootToken(api.post("/api/blogs")).send(newBlog).expect(400);

      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("ignores a userId sent by the client", async () => {
      const { user: otherUser } = await createOtherUserWithToken();
      const newBlog = {
        title: "A blog claiming another user",
        author: "A blog author",
        url: "https://example.com/other-userId",
        userId: otherUser.id,
      };

      const response = await withRootToken(api.post("/api/blogs"))
        .send(newBlog)
        .expect(201);
      const rootAtEnd = await User.findById(rootUser._id);
      const otherAtEnd = await User.findById(otherUser.id);

      assert.strictEqual(response.body.user, rootUser.id);
      assert(rootAtEnd.blogs.some((id) => id.toString() === response.body.id));
      assert.strictEqual(otherAtEnd.blogs.length, 0);
    });
  });

  describe("deleting a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await withRootToken(api.delete(`/api/blogs/${blogToDelete.id}`)).expect(204);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
      assert(!blogsAtEnd.some((blog) => blog.id === blogToDelete.id));
    });

    test("fails with status code 401 if the token is missing", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

      const blogsAtEnd = await blogsInDb();

      assert(blogsAtEnd.some((blog) => blog.id === blogToDelete.id));
    });

    test("fails with status code 403 if the blog belongs to another user", async () => {
      const { token: otherToken } = await createOtherUserWithToken();
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await withToken(
        api.delete(`/api/blogs/${blogToDelete.id}`),
        otherToken,
      ).expect(403);

      const blogsAtEnd = await blogsInDb();

      assert(blogsAtEnd.some((blog) => blog.id === blogToDelete.id));
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const id = nonExistingId();

      await withRootToken(api.delete(`/api/blogs/${id}`)).expect(404);
    });

    test("fails with status code 400 if id is malformed", async () => {
      await withRootToken(api.delete(`/api/blogs/${malformedId}`)).expect(400);
    });

    test("removes the blog from the user's blog list", async () => {
      const newBlog = {
        title: "A blog that will be deleted",
        author: "A author that will be deleted",
        url: "https://example.com/a-blog-that-will-be-deleted",
      };

      const response = await withRootToken(api.post("/api/blogs"))
        .send(newBlog)
        .expect(201);

      await withRootToken(api.delete(`/api/blogs/${response.body.id}`)).expect(
        204,
      );
      const userAtEnd = await User.findById(rootUser.id);

      assert(
        !userAtEnd.blogs.some(
          (blogId) => blogId.toString() === response.body.id,
        ),
      );
    });
  });

  describe("updating a blog", () => {
    describe("increasing likes", () => {
      test("increases the number of likes by 1", async () => {
        const blogsAtStart = await blogsInDb();
        const blogToLike = blogsAtStart[0];

        const response = await api
          .patch(`/api/blogs/${blogToLike.id}/like`)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        assert.strictEqual(response.body.likes, blogToLike.likes + 1);
      });

      test("fails with status code 400 if id is malformed", async () => {
        await api.patch(`/api/blogs/${malformedId}/like`).expect(400);
      });

      test("fails with status code 404 if the blog does not exist", async () => {
        const id = nonExistingId();
        await api.patch(`/api/blogs/${id}/like`).expect(404);
      });
    });

    describe("updating blog data", () => {
      test("changes to the blog data are persistent", async () => {
        const blogsAtStart = await blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        const spoofedUserId = nonExistingId();
        const updatedData = {
          title: "The Cathedral and the Bazaar: Updated",
          author: "Updated author",
          url: "https://example.com/updated-blog",
          likes: 20,
          user: spoofedUserId,
        };

        const response = await withRootToken(
          api.put(`/api/blogs/${blogToUpdate.id}`),
        )
          .send(updatedData)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        const blogsAtEnd = await blogsInDb();
        const updatedBlog = blogsAtEnd.find(
          (blog) => blog.id === blogToUpdate.id,
        );

        assert.deepStrictEqual(
          {
            title: updatedBlog.title,
            author: updatedBlog.author,
            url: updatedBlog.url,
            likes: updatedBlog.likes,
          },
          {
            title: updatedData.title,
            author: updatedData.author,
            url: updatedData.url,
            likes: updatedData.likes,
          },
        );
        assert.strictEqual(response.body.id, blogToUpdate.id);
        assert.strictEqual(response.body.user, blogToUpdate.user.toString());
      });

      test("fails with status code 401 if the token is missing", async () => {
        const blogsAtStart = await blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        await api
          .put("/api/blogs/" + blogToUpdate.id)
          .expect(401);

        const blogAtEnd = (await blogsInDb()).find(
          (blog) => blog.id === blogToUpdate.id,
        );
        assert.strictEqual(blogAtEnd.title, blogToUpdate.title);
      });

      test("fails with status code 403 if the blog belongs to another user", async () => {
        const { token: otherToken } = await createOtherUserWithToken();
        const blogToUpdate = (await blogsInDb())[0];

        await withToken(
          api.put(`/api/blogs/${blogToUpdate.id}`),
          otherToken,
        )
          .expect(403);

        const blogAtEnd = (await blogsInDb()).find(
          (blog) => blog.id === blogToUpdate.id,
        );
        assert.strictEqual(blogAtEnd.title, blogToUpdate.title);
      });

      test("leaves the blog unchanged if the owner sends no body", async () => {
        const blogToUpdate = (await blogsInDb())[0];

        await withRootToken(api.put(`/api/blogs/${blogToUpdate.id}`)).expect(200);

        const blogAtEnd = (await blogsInDb()).find(
          (blog) => blog.id === blogToUpdate.id,
        );
        assert.deepStrictEqual(blogAtEnd, blogToUpdate);
      });

      test("fails with status code 400 if id is malformed", async () => {
        await withRootToken(api.put(`/api/blogs/${malformedId}`))
          .send({ likes: 20 })
          .expect(400);
      });

      test("fails with status code 404 if the blog does not exist", async () => {
        const id = nonExistingId();

        await withRootToken(api.put(`/api/blogs/${id}`))
          .send({ likes: 20 })
          .expect(404);
      });

      test("fails with status code 400 if the data is invalid", async () => {
        const blogToUpdate = (await blogsInDb())[0];

        await withRootToken(api.put(`/api/blogs/${blogToUpdate.id}`))
          .send({ title: "" })
          .expect(400);

        const blogAtEnd = (await blogsInDb()).find(
          (blog) => blog.id === blogToUpdate.id,
        );
        assert.strictEqual(blogAtEnd.title, blogToUpdate.title);
      });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
