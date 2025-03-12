const db = require("../db/connection");
const format = require("pg-format");

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT 
        author, title, article_id, body, topic, created_at, votes, article_img_url
        FROM articles
        WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {
            
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

exports.patchArticleVotes = (article_id, inc_votes) => {
    const queryStr = ` 
     UPDATE articles 
    SET  votes = votes + $1 
    WHERE  article_id  =  $2 
    RETURNING 
    author, 
    title, 
    article_id, 
    body, 
    topic, 
    created_at, 
    votes, 
    article_img_url ; 
    `;
    console.log("WHEN", queryStr)
    return db
    .query(queryStr, [inc_votes, article_id])
    
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found" });
        }
        return rows[0]
        
    })
    .catch((err) => {
        console.error("Database query error", err)
        throw err;
    })
    
}

exports.fetchArticlesSort = ({ sort_by = "created_at", order = "desc"} = {}) => {
if(order.toLowerCase() !== "asc" && order.toLowerCase() !== "desc"){
    return Promise.reject({ status: 400, msg: "Invalid order query. Use 'asc' or 'desc'. " });
}
const sortColumns = [ "author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count" ];
if(!sortColumns.includes(sort_by)){
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
}
let queryStr = ` 
SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
 COUNT (comments.comment_id) AS comment_count 
 FROM articles 
 LEFT JOIN comments ON articles.article_id = comments.article_id 
 GROUP BY  articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url `;
 
 queryStr += ` ORDER BY ${sort_by} ${order.toUpperCase()};`;
 console.log("Executing query:", queryStr);

 return db
 .query(queryStr)
 .then(({ rows }) => rows)
 .catch((err) => {
    console.error("Database query error", err)
    throw err;
 });
};