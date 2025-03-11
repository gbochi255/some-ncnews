const db = require("../db/connection");
const format = require("pg-format");

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT 
        author, title, article_id, body, topic, created_at, votes, article_img_url
        FROM articles
        WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {
            //console.log("Full rows", rows)
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: "Article not found" })
            }
            return rows[0]
        })
        .catch((err) => {
            console.error("Database query error", err);
            throw err;
        })
}

exports.fetchAllArticles = () => {
    const queryStr = ` 
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY articles.created_at DESC; `;
    return db
        .query(queryStr)
        .then(({ rows }) => rows)
        .catch((err) => {
            console.error("Database query error", err)
            throw err
        });
};
