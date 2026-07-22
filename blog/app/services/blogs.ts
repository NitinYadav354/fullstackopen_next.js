const blogs = [
  {
    "id": 1,
    "title": "Getting Started with React",
    "author": "Dan Abramov",
    "url": "https://example.com/getting-started-react",
    "likes": 120
  },
  {
    "id": 2,
    "title": "Understanding Node.js Event Loop",
    "author": "Ryan Dahl",
    "url": "https://example.com/nodejs-event-loop",
    "likes": 95
  },
  {
    "id": 3,
    "title": "Mastering JavaScript ES6+",
    "author": "Kyle Simpson",
    "url": "https://example.com/mastering-es6",
    "likes": 180
  },
  {
    "id": 4,
    "title": "Building REST APIs with Express",
    "author": "Andrew Mead",
    "url": "https://example.com/express-rest-api",
    "likes": 76
  },
  {
    "id": 5,
    "title": "Introduction to TypeScript",
    "author": "Anders Hejlsberg",
    "url": "https://example.com/introduction-typescript",
    "likes": 210
  }
]

let nextId = 6

export const getBlogs = () => {
  return blogs
}

export const addBlogs = (title: string, author: string, url: string) => {
  blogs.push({id: nextId++, title, author, url, likes: 0})
}