const express = require("express");
const { patchCommentVotes } = require("../../controller/comments.controller");

const commentsRouter = express.Router();
commentsRouter.patch("/:comment_id", patchCommentVotes);

module.exports = commentsRouter;