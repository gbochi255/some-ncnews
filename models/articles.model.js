const db = require("../db/connection");
const format = require("pg-format");

exports.fetchAllArticles = ({ sort_by = "created_at", order = "desc", topic } = {}) => {
    const validSortColumns = [ "author", 
        "title", 
        "article_id", 
        "topic", 
        "created_at", 
        "votes", 
        "article_img_url" 
         ];
    if(!validSortColumns.includes(sort_by) && sort_by !== "comment_count"){
        return Promise.reject({ status: 400, msg: "Invalid sort_by column"});
    }
        const orderLower = order.toLowerCase();
        if(!["asc", "desc"].includes(orderLower)){
            return Promise.reject({ status: 400, msg: "Invalid order query. Use 'asc' or 'desc'. " });
        }
        let queryStr = 
        ` SELECT 
            articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
          COUNT(comments.comment_id)::INT AS comment_count 
          FROM articles 
          LEFT JOIN comments ON articles.article_id = comments.article_id `;
          const binders = [];
          if(topic) { 
            queryStr += ` WHERE articles.topic = $1 `;
            binders.push(topic);
          }
          queryStr += ` 
          GROUP BY articles.article_id 
          ORDER BY ${sort_by} ${orderLower.toUpperCase()}; `;
          return db
          .query(queryStr, binders)
          .then(({ rows }) => rows)
          .catch((err) => {
            console.error("Database query error", err)
          });
        };
   
exports.fetchArticleById = (article_id) => {
    return db
    .query(`
    SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.body,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url, 
        COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id; `,
    [article_id])
.then(({ rows }) => {
    if (rows.length === 0){
        returnPromise.reject({ status: 404, msg: "Articles not found"});
    }
    return rows[0];
})
.catch((err) => {
        console.error("Database query error", err)
        throw err;}) 
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
    