const db = require('./db/connection');
//const { dropTables, createTables } = require("./db/data/test-data");
const { dropTables, createTables } = require("./run-seed")
const  { topicData, userData, articleData, commentData } = require("./db/data/test-data/index")

const seed = async(data ) => {
    const { topicData, userData, articleData, commentData } = data;

    await dropTables();
    await createTables();

    await db.query(
        `INSERT INTO topics(slug, description, img_url)
        VALUES ($1, $2, $3)`,
        [topicData.slug,
            topicData.description,
            topicData.img_url]
        );
        await db.query(
            `INSERT INTO users(username, name, avatar_url)
            VALUES ($1, $2, $3)`,
            [userData.username,
                userData.name,
                userData.avatar_url]
            );
            await db.query(
                `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url)
                VALUES9$1, $2, $3, $4, $5, $6, $7`, 
                [
                    articleData.title,
                    articleData.topic,
                    articleData.author,
                    articleData.body,
                    articleData.created_at,
                    articleData.votes,
                    articleData.article_img_url
                ]
            );
            await db.query(
                `INSERT INTO comments(body, article_id, author, votes, created_at)
                VALUES ($1,$2, $3, $4, $5)`, [
                    commentData.body,
                    commentData.article_id,
                    commentData.author,
                    commentData.votes,
                    commentData.created_at
                ]
            )
    }