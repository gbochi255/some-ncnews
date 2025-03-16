const express = require("express");
const commentsRouter = require("./comments-router")
const usersRouter = require("./users-router")


const apiRouter = express.Router();

apiRouter.use("/comments", commentsRouter)

apiRouter.get("/", (req, res) => {
    res.status(200).json({ msg: "Welcome to the api" });
});
apiRouter.use("/users", usersRouter);



module.exports = apiRouter;