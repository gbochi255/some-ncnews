const express = require("express");
const { getUserByUsername } = require("../../controller/users.controller");
const usersRouter = express.Router();

usersRouter.get("/:username", getUserByUsername)

module.exports = usersRouter;