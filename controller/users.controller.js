const users = require("../db/data/test-data/users");
const { fetchUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).json({ users });
    })
    .catch(next)
}