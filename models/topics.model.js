const db = require("../db/connection");
const format = require("pg-format");

exports.checkTopicExists = (topic) => {
    return db
    .query("SELECT * FROM topics WHERE slug = $1;", [topic])
    .then(({ rows }) => {
        if(rows.length === 0 || !topics.topic ) {
            return Promise.reject({ status: 404, msg: "Topi not found"});
        }
        return;
    });
};

exports.fetchTopics = () => {
return db
.query(`SELECT * FROM topics;`)
.then(({ rows }) => rows)
.catch((err) => {
    console.error("Database query error", err);
    throw err;
});
};
exports.fetchTopics = () => {
    return db
    .query(`SELECT slug, description FROM topics;`)
    .then(({ rows }) => rows)
    .catch((err) => {
        console.error("Database query error", err);
        throw err;
    });
};