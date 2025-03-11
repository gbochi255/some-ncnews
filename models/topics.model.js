const db = require("../db/connection");
const format = require("pg-format");

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