const { test, describe } = require("node:test");
const assert = require("node:assert");

const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require("../utils/list_helper.js");
const {
  emptyBlogList,
  listWithOneBlog,
  listWithManyBlogs,
  listWithSplitLikes,
} = require("../mocks/blogs.mock.js");

describe("dummy", () => {
  test("returns one", () => {
    const blogs = emptyBlogList;

    const result = dummy(blogs);

    assert.strictEqual(result, 1);
  });
});

describe("total likes", () => {
  test("returns 0 for an empty list", () => {
    const blogs = emptyBlogList;

    const result = totalLikes(blogs);

    assert.strictEqual(result, 0);
  });

  test("returns the likes of the blog for a list with one blog", () => {
    const blogs = listWithOneBlog;

    const result = totalLikes(blogs);

    assert.strictEqual(result, 5);
  });

  test("returns the total likes for a list with many blogs", () => {
    const blogs = listWithManyBlogs;

    const result = totalLikes(blogs);

    assert.strictEqual(result, 97);
  });
});

describe("favorite blog", () => {
  test("returns an empty blog with 0 likes for an empty list", () => {
    const blogs = emptyBlogList;

    const result = favoriteBlog(blogs);

    assert.deepStrictEqual(result, {
      title: "",
      author: "",
      likes: 0,
    });
  });

  test("returns that blog for a list with one blog", () => {
    const blogs = listWithOneBlog;

    const result = favoriteBlog(blogs);

    assert.deepStrictEqual(result, {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("returns the blog with the most likes for a list with many blogs", () => {
    const blogs = listWithManyBlogs;

    const result = favoriteBlog(blogs);

    assert.deepStrictEqual(result, {
      title: "Clean Code",
      author: "Robert C. Martin",
      likes: 20,
    });
  });
});

describe("most blogs", () => {
  test("returns 0 blogs with no author for an empty list", () => {
    const blogs = emptyBlogList;

    const result = mostBlogs(blogs);

    assert.deepStrictEqual(result, {
      author: "",
      blogs: 0,
    });
  });

  test("returns the author of that blog for a list with one blog", () => {
    const blogs = listWithOneBlog;

    const result = mostBlogs(blogs);

    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("returns the author with the most blogs for a list with many blogs", () => {
    const blogs = listWithManyBlogs;

    const result = mostBlogs(blogs);

    assert.deepStrictEqual(result, {
      author: "Eric S. Raymond",
      blogs: 2,
    });
  });
});

describe("most likes", () => {
  test("returns 0 likes with no author for an empty list", () => {
    const blogs = emptyBlogList;

    const result = mostLikes(blogs);

    assert.deepStrictEqual(result, {
      author: "",
      likes: 0,
    });
  });

  test("returns the author of that blog for a list with one blog", () => {
    const blogs = listWithOneBlog;

    const result = mostLikes(blogs);

    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("returns the author with the most likes in total for a list with split likes", () => {
    const blogs = listWithSplitLikes;

    const result = mostLikes(blogs);

    assert.deepStrictEqual(result, {
      author: "Author A",
      likes: 21,
    });
  });
});
