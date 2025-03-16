const { fetchCommentsByArticleId } = require("../models/comments.model")
const { insertCommentByArticleId } = require("../models/comments.model")
const { deleteCommentById } = require("../models/comments.model")
const { updateCommentVotes } = require("../models/comments.model");



exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).json({ comments })
    })
    .catch(next);
}

exports.patchCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    if(inc_votes === undefined){
        return res.status(400).json({ msg: "Bad request: inc_votes is required" });
    }
    if(isNaN(Number(comment_id))){
        return res.status(400).json({ msg: "Bad request: comment_id must be a number" });
    }
    updateCommentVotes(comment_id, inc_votes)
    .then((updatedComment) => {
        res.status(200).json({ comment: updatedComment });
    })
    .catch(next)
};

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body;
    if(!username || !body){
        return res.status(400).json({ error: { msg: "Missing required field" } })
    }

    insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
        res.status(201).json({ comment });
    })
    .catch(next)
}
exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    deleteCommentById(Number(comment_id))
    .then(() => {
        res.status(204).send();
    })
        .catch(next);
};
