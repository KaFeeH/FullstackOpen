const listWithOneBlog = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
  },
];

const listWithManyBlogs = [
  ...listWithOneBlog,
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
  {
    title: "You Are Not Google",
    author: "Alex Ewerlof",
    url: "https://alexewerlof.medium.com/you-are-not-google-4a0f2c5c7e55",
    likes: 8,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
    likes: 20,
  },
  {
    title: "TDD Harms Architecture",
    author: "Robert C. Martin",
    url: "https://web.archive.org/web/20170622160828/http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andy Hunt",
    url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    likes: 15,
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma",
    url: "https://www.oreilly.com/library/view/design-patterns-elements/0201633612/",
    likes: 17,
  },
  {
    title: "You Don't Know JS Yet",
    author: "Kyle Simpson",
    url: "https://github.com/getify/You-Dont-Know-JS",
    likes: 13,
  },
];

const emptyBlogList = [];

module.exports = {
  emptyBlogList,
  listWithOneBlog,
  listWithManyBlogs,
};
