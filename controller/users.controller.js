const db = require("../db/connection");
const users = require("../db/data/test-data/users");
const { fetchUsers } = require("../models/users.model");


exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    if(!username){
        return res.status(400).json({ msg: "Bad request: username is required" });
    }
     db.query(` 
        SELECT username, avatar_url, name FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
            console.log("Query results for username", username, ":", rows)
            if(rows.length === 0) {
                return res.status(404).json({ msg: "User not found"})
            }
            res.status(200).json({ user: rows[0] });
        })
        .catch(next)
}



exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).json({ users });
    })
    .catch(next)
}
