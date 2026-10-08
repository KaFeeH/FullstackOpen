const dummy = (_blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((top, blog) => {
    if (!top || blog.likes > top.likes) {
      return blog;
    }

    return top;
  }, null);

  if (!favorite) {
    return { title: "", author: "", likes: 0 };
  }

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const topAuthorBy = (blogs, getValue) => {
  const totalByAuthor = new Map();

  for (const blog of blogs) {
    const total = (totalByAuthor.get(blog.author) ?? 0) + getValue(blog);
    totalByAuthor.set(blog.author, total);
  }

  let topAuthor = "";
  let topTotal = 0;

  for (const [author, total] of totalByAuthor) {
    if (total > topTotal) {
      topAuthor = author;
      topTotal = total;
    }
  }

  return { author: topAuthor, total: topTotal };
};

const mostBlogs = (blogs) => {
  const { author, total } = topAuthorBy(blogs, () => 1);

  return { author, blogs: total };
};

const mostLikes = (blogs) => {
  const { author, total } = topAuthorBy(blogs, (blog) => blog.likes);

  return { author, likes: total };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
