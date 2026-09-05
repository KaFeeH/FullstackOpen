const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require("../utils/list_helper.js");
const {
  listWithOneBlog,
  listWithManyBlogs,
  emptyBlogList,
} = require("../mocks/blogs.mock.js");
const { test, describe } = require("node:test");
const assert = require("node:assert");

describe("dummy", () => {
  test("returns one", () => {
    const blogs = [];
    assert.strictEqual(dummy(blogs), 1);
  });
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has multiple blogs, equals the total likes", () => {
    const result = totalLikes(listWithManyBlogs);
    assert.strictEqual(result, 97);
  });
});

describe("favorite blog", () => {
  test("when list has many blogs, returns the blog with the most likes", () => {
    const result = favoriteBlog(listWithManyBlogs);
    assert.deepStrictEqual(result, {
      title: "Clean Code",
      author: "Robert C. Martin",
      likes: 20,
    });
  });

  test("when the list has a blog, it returns that blog", () => {
    const result = favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });
});

describe("most blogs", () => {
  test("returns the author with the most blogs", () => {
    const result = mostBlogs(listWithManyBlogs);
    assert.deepStrictEqual(result, {
      author: "Eric S. Raymond",
      blogs: 2,
    });
  });


});

describe("most likes", () => {
  test("returns 0 likes with no author for an empty list", () => {
    const result = mostLikes(emptyBlogList);
    assert.deepStrictEqual(result, {
      author: "",
      likes: 0,
    });
  });

  test("returns the author whose blogs have the most likes in total", () => {
    const blogs = [
      { author: "Author A", likes: 11 },
      { author: "Author A", likes: 10 },
      { author: "Author B", likes: 20 },
    ];

    const result = mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Author A",
      likes: 21,
    });
  });
});
