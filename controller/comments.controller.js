const { fetchCommentsByArticleId } = require("../models/comments.model")
const { insertCommentByArticleId} = require("../models/comments.model")

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

fetchCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).json({ comments })
    })
    .catch(next);
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body;

    insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
        res.status(200).json({ comment });
    })
    .catch(next)
}