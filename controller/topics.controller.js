const topics = require("../db/data/test-data/topics")
const { fetchTopics } = require("../models/topics.model")


exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).json({ topics });
    })
    .catch(next);
}