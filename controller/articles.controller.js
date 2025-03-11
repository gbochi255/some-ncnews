const articles = require("../db/data/test-data/articles");
const topics = require("../db/data/test-data/topics")
const { fetchAllArticles, fetchArticleById } = require("../models/articles.model")



exports.getArticles = (req, res, next) => {
    fetchAllArticles()
    .then((articles) => {
        res.status(200).json({ articles });
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
if(!(Number(article_id))){
    return res.status(400).json({ error: {msg: "Invalid article_id" }});
}

    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).json({ article });
    })
    .catch(next);
};

