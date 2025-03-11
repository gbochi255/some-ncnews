const db = require("../db/connection");
const format = require("pg-format");

exports.fetchCommentsByArticleId = (article_id) => {
    const queryStr = `SELECT comment_id, votes, created_at, author, body, article_id 
    FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC; `;
    return db
        .query(queryStr, [article_id])
        .then(({ rows }) => rows)
        .catch((err) => {
            console.error("Database query error", err);
            throw err;
        })
}

exports.insertCommentByArticleId = (article_id, username, body) => {
    const queryStr = `
    INSERT INTO comments(author, body, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING comment_id, votes, created_at, author, body, article_id; `;
    return db
    .query(queryStr, [username, body, article_id])
    .then(({ rows }) => rows[0])
    .catch((err) => {
        console.error("Database query error", err);
        throw err;
    })
}