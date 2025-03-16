const db = require("../db/connection");
const format = require("pg-format");


exports.updateCommentVotes = (comment_id, inc_votes) => {
    if (typeof inc_votes !== "number"){
        return Promise.reject({ status: 400, msg: "Bad request: inc_votes must be a number" });
    }
    const queryStr  = ` 
    UPDATE comments 
    SET votes = votes + $1 
    WHERE comment_id = $2 
    RETURNING *; `;
    return db.query(queryStr, [inc_votes, comment_id])
    .then(({ rows }) =>{
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Comment not found" });
        }
        return rows[0];
    });
};

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
    INSERT INTO comments
    (author, body, article_id) 
    VALUES 
    ($1, $2, $3) 
    RETURNING comment_id, votes, created_at, author, body, article_id ; `
    ;
    return db
    .query(queryStr, [username, body, article_id])
    .then(({ rows }) => rows[0])
    .catch((err) => {
        console.error("Database query error", err);
        throw err;
    })
}

exports.deleteCommentById = (comment_id) => {
    const queryStr = ` 
    DELETE FROM comments 
    WHERE comment_id = $1 ;`;

    return db
    .query(queryStr, [comment_id])
    .then(({ rowCount }) => {
        if (rowCount === 0){
            return Promise.reject({ status: 404, msg: "Comment not found" })
        }
        return;
    })
    .catch((err) => {
       console.error("Database query error", err);
       throw err;
   });
};