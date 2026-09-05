const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app.js");
const Blog = require("../models/blog.js");
const { initialBlogs, blogsInDb, nonExistingId } = require("./test_helper.js");

const api = supertest(app);
const malformedId = "not-a-valid-object-id";

describe("blogs API", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
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

        assert.deepStrictEqual(response.body, blogToView);
      });

      test("fails with status code 404 if blog does not exist", async () => {
        const id = await nonExistingId();
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
        likes: 10,
      };
      const blogsAtStart = await blogsInDb();

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
      assert(blogsAtEnd.some((blog) => blog.title === newBlog.title));
    });

    test("defaults likes to 0 if likes is omitted", async () => {
      const newBlog = {
        title: "A blog without likes",
        author: "A blog author",
        url: "https://example.com/blog-without-likes",
      };

      const response = await api.post("/api/blogs").send(newBlog).expect(201);
      assert.strictEqual(response.body.likes, 0);
    });

    test("fails with status code 400 if title is missing", async () => {
      const newBlog = {
        author: "A blog author",
        url: "https://notitle.com/untitled-blog",
      };

      const blogsAtStart = await blogsInDb();
      await api.post("/api/blogs").send(newBlog).expect(400);
      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 400 if url is missing", async () => {
      const newBlog = {
        title: "A blog without url",
        author: "A blog author",
      };

      const blogsAtStart = await blogsInDb();
      await api.post("/api/blogs").send(newBlog).expect(400);
      const blogsAtEnd = await blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });
  });

  describe("deleting a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
      assert(!blogsAtEnd.some((blog) => blog.id === blogToDelete.id));
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const id = await nonExistingId();
      await api.delete(`/api/blogs/${id}`).expect(404);
    });

    test("fails with status code 400 if id is malformed", async () => {
      await api.delete(`/api/blogs/${malformedId}`).expect(400);
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
    });

    describe("updating blog data", () => {
      test("changes to the blog data are persistent", async () => {
        const blogsAtStart = await blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        const updatedData = {
          title: "The Cathedral and the Bazaar: Updated",
          author: "Updated author",
          url: "https://example.com/updated-blog",
          likes: 20,
        };

        const response = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
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
          updatedData,
        );
        assert.strictEqual(response.body.id, blogToUpdate.id);
      });

      test("fails with status code 400 if id is malformed", async () => {
        await api
          .put(`/api/blogs/${malformedId}`)
          .send({ likes: 20 })
          .expect(400);
      });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
