const db = require("../db/connection");
const format = require("pg-format");

exports.fetchUsers = () => {
    return db
    .query(`SELECT username, name, avatar_url 
        FROM users; `)
        .then(({ rows }) => rows)
        .catch((err) => {
            console.error("Database query error", err)
            throw err;
        })
}