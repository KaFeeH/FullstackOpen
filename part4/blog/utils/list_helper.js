const dummy = (_blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((prev, curr) => prev + curr.likes, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((currFav, blog) => {
    if (!currFav || blog.likes > currFav.likes) {
      return blog;
    }

    return currFav;
  }, null);

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const blogsByAuthor = new Map();

  for (const { author } of blogs) {
    const count = (blogsByAuthor.get(author) ?? 0) + 1;
    blogsByAuthor.set(author, count);
  }

  let mostAuthor;
  let mostCount = 0;

  for (const [author, count] of blogsByAuthor) {
    if (count > mostCount) {
      mostAuthor = author;
      mostCount = count;
    }
  }

  return {
    author: mostAuthor,
    blogs: mostCount,
  };
};

const mostLikes = (blogs) => {
  const likesByAuthor = new Map();

  for (const { author, likes } of blogs) {
    const count = (likesByAuthor.get(author) ?? 0) + likes;
    likesByAuthor.set(author, count);
  }

  let mostAuthor = "";
  let mostCount = 0;

  for (const [author, count] of likesByAuthor) {
    if (count > mostCount) {
      mostAuthor = author;
      mostCount = count;
    }
  }

  return {
    author: mostAuthor,
    likes: mostCount,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
