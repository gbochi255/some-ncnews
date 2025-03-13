const articles = require("../db/data/test-data/articles");
const topics = require("../db/data/test-data/topics")
const { fetchAllArticles, fetchArticleById, patchArticleVotes } = require("../models/articles.model")
const { checkTopicExists } = require("../models/topics.model")



exports.getArticles = (req, res, next) => {
    const { sort_by, order, topic } = req.query;
    if(topic){
        checkTopicExists(topic)
        .then(() => fetchAllArticles({ sort_by, order, topic }))
        .then((articles) => res.status(200).json({ articles }))
        .catch(next);
    }else{
        fetchAllArticles({ sort_by, order })
        .then((articles) => res.status(200).json({ articles }))
        .catch(next)
    }
    
    fetchAllArticles({ sort_by, order, topic })
    .then((articles) => {
        res.status(200).json({ articles });
    })
    .catch(next);
}

/*exports.getArticles = (req, res, next) => {
    fetchAllArticles()
    .then((articles) => {
        res.status(200).json({ articles });
    })
    .catch(next)
}*/

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
if(!(Number(article_id))){
    return res.status(400).json({ error: {msg: "Invalid sort_by column" }});
}
    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).json({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if(inc_votes === undefined || typeof inc_votes !== "number") {
        return res.status(400).json({ error: {msg: "Invalid or missing inc_votes" } });
    }
    patchArticleVotes(Number(article_id), inc_votes)
    .then((article) => {
        res.status(200).json({ article });
    })
    .catch(next);
}