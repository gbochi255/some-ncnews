const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const { getUsers } = require("./controller/users.controller");
const { getCommentsByArticleId, postCommentByArticleId, removeCommentById } = require("./controller/comments.controller")
const { getArticles, getArticleById, patchArticleById } = require("./controller/articles.controller");
const { getTopics } = require("./controller/topics.controller");
const endpoints = JSON.parse(fs.readFileSync(path.join(__dirname, "endpoints.json"), "utf-8"));

app.use(express.json());

app.get("/api/articles", getArticles);

app.get("/api", (req, res) => {
    res.status(200).json({ endpoints });
});
app.get("/api/topics", getTopics);
app.get("/api", (req, res) => {
    res.status(200).json({ endpoints });
})
app.get("/api/users", getUsers)


app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/topics", getTopics);

//app.get("/api/articles", getArticles);
//app.get("/api/articles", getArticlesSort);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById)


app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", removeCommentById);


app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: { msg: err.msg || "Internal Server Error" } });
});
module.exports = app;