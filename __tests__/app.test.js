const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const topics = require("../db/data/test-data/topics");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("200: responds with JSON of all available endpoint", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then((response) => {
      expect(response.body.endpoints).toBeDefined();
      //console.log("<<<<EndPoints", response.body.endpoints);
      expect(response.body.endpoints["GET /api/topics"]).toBeDefined();
    })
  })
});

describe("GET /api/topics", () => {
  test("responds with an array of topics", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      const topics = response.body.topics;
      expect(Array.isArray(topics)).toBe(true);
    })
  })
  test("200: responds with an array of topic objects slug and description", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      const topics = response.body.topics;
      expect(Array.isArray(topics)).toBe(true);
      topics.forEach((topic) => {
        expect(topic.slug).toBeDefined;
        expect(topic.description).toBeDefined;
      })
    })
  })
})
describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object for article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        //console.log("<<<<Articles schema", response.body.article)
        expect(article).toBeDefined();
        
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('title', expect.any(String))
          expect(article).toHaveProperty('article_id', expect.any(Number))
          expect(article).toHaveProperty('body', expect.any(String))
          expect(article).toHaveProperty('topic', expect.any(String))
          expect(article).toHaveProperty('created_at', expect.any(String))
          expect(article).toHaveProperty('votes', expect.any(Number))
          expect(article).toHaveProperty('article_img_url', expect.any(String))
      
      })
  })
  test("400: responds with 400 for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/NaN")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toEqual({ msg: "Invalid article_id" });
      });
  });
})
describe("GET /api/articles", () =>{
  test("200: responds with an array of article objects with required properties", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response) => {
      const articles = response.body.articles;
      expect(Array.isArray(articles)).toBe(true)
      
      articles.forEach((article) => {
      expect(articles[0]).toHaveProperty('author');
      expect(articles[0]).toHaveProperty('title');
      expect(articles[0]).toHaveProperty('article_id');
      expect(articles[0]).toHaveProperty('topic');
      expect(articles[0]).toHaveProperty('created_at');
      expect(articles[0]).toHaveProperty('votes');
      expect(articles[0]).toHaveProperty('article_img_url');
      expect(articles[0]).toHaveProperty('comment_count');
      expect(article).not.toHaveProperty('body')
    })
    });
    
  });
  test("200: responds with articles sorted by date descending", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response) => {
      const articles = response.body.articles;
      for(let i = 0; i < articles.length -1; i++){
        expect(new Date(articles[i].created_at).getTime()).toBeGreaterThanOrEqual(new Date(articles[i+1].created_at).getTime());
      }
    })
  })
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: respond with an array of comments for an article_id", ()=> {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then((response) => {
      const comments = response.body.comments;
      expect(Array.isArray(comments)).toBe(true)
      comments.forEach((comment) => {
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("create_at");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("body");
        expect(comment).toHaveProperty("article_id");
      })
    })
  })
  test("200: return empty array if article exist but has no comment", () => {
    return request(app)
    .get("/api/articles/5/comments")
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.comments)).toBe(true);
    })
  })
})
describe("POST /api/articles/:article_id/comments", () => {
  test("200: responds with posted comments when given article_id and body", () => {
    const newComment = { 
      username: "icellusedkars",
      body: "Some naive comment"
    };
    return request(app)
    .post("/api/articles/2/comments")
    .send(newComment)
    .expect(201)
    .then((response) => {
      const comment = response.body.comment;
      expect(comment).toHaveProperty("comment_id");
      expect(comment.author).toBe(newComment.username);
      expect(comment.body).toBe(newComment.body);
      expect(comment.article_id).toBe(2);
      expect(comment).toHaveProperty("votes");
      expect(comment).toHaveProperty("created_at");
    });
  });
    test("400: return for invalid article_id", ()  => {
      const newComment = {
        username: "icellusedkars",
      }
      return request(app)
              .post("/api/articles/not-a-number/comments")
              .send(newComment)
              .expect(400)
              .then((response) => {
                expect(response.body.error).toEqual({ msg: "Missing required field" });
              })
            })
            test("400: return for missing required field", ()  => {
              return request(app)
              .post("/api/articles/2/comments")
              .send({ username: "icellusedkars" })
              .expect(400)
              .then((response) => {
                expect(response.body.error).toEqual({ msg: "Missing required field" });
              })

            })    
          })
          describe("PATCH /api/articles/:article_id", () => {
            test("200: updates when provided a valid article_id", () => {
              return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then((response) => {
                
                const article = response.body.article;
                
                expect(article).toHaveProperty("votes")
              })

            })
          })
          describe("DELETE /api/comments/:comment_id", () => {
            test("204: responds with 204 on deleting and no content", () => {
              return request(app)
              .delete("/api/comments/1")
              .expect(204)
              .then((response) => {
                expect(response.body).toEqual({})
              })
            })
            test("respond with 404 if the comment does not exist", () => {
              return request(app)
              .delete("/api/comments/9999")
              .expect(404)
              .then((response) => {
                expect(response.body.error).toEqual({ msg: "Comment not found" })
              });
            });
          });
          describe.only("GET /api/users", () => {
            test("200: responds with an array of user object with required properties", () => {
              return request(app)
              .get("/api/users")
              .expect(200)
              .then((response) => {
                const users = response.body.users;
                expect(Array.isArray(users)).toBe(true)
                users.forEach((user) => {
                  expect(user).toHaveProperty("username");
                  expect(user).toHaveProperty("name");
                  expect(user).toHaveProperty("avatar_url");
                });
              });
            });
          });
          describe("GET /api/articles (sorting queries", () => {
            test("200: returns sorting by created_at in descending order as default", () => {
              return request(app)
              .get("/api/articles")
              .expect(200)
              .then((response) => {
                const articles = response.body.articles;
                expect(Array.isArray(articles)).toBe(true);
                //check that each article's created_at is >= the next article'sn created_at
                for (let i=0; i<articles.length -1; i++){
                  const current = new Date(articles[i].created_at).getTime();
                  const next = new Date(articles[i+1].created_at).getTime();
                  expect(current).toBeGreaterThanOrEqual(next)
                }
              });
            });
            test("200:")
          })