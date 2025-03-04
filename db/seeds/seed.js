const db = require("../connection");
const format = require("pg-format");



const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS articles;")
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users;")
})
  .then(() => {
    return db.query("DROP TABLE IF EXISTS topics;")
})
  .then(() => {
    return db.query(
    `CREATE TABLE topics(
          slug VARCHAR(50) PRIMARY KEY,
          description VARCHAR(60) NOT NULL,
          img_url VARCHAR(1000));`
        );
          
  }).then(() => {  
    return db.query(
    `CREATE TABLE users(
      username VARCHAR(50) PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL);`
    );
      
}).then(() => {
  return db.query(
      `CREATE TABLE articles(
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR NOT NULL REFERENCES topics(slug),
          author VARCHAR NOT NULL REFERENCES users(username),
          body TEXT NOT NULL,
          create_dat TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000));`
  );
          
})
  .then(() => {
    return db.query(
          `CREATE TABLE comments(
          comment_id SERIAL PRIMARY KEY,
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          article_id INT);`
    );
          

}).then(() => {
  const topicValues = topicData.map(topic => 
  { return [ 
    topic.slug, 
    topic.description, 
    topic.img_url || null
  ]
  } );
 const topicInsert = format(`INSERT INTO topics(slug, description, img_url) VALUES %L;`,
  topicValues
);
console.log(topicInsert)
return db.query(topicInsert) ;
    
}) 
  
.then(() => {
      const userValues = userData.map(user => {
        return [
        user.username, 
        user.name, 
        user.avatar_url
      ]
});

      const insertQuery  = format(`INSERT INTO users(username, name) VALUES %L RETURNING *;`,
        userValues
      );
      return db.query(insertQuery)
  }) 
  .then(() => {
    const articleValues = articleData.map(article =>{
      return [
      article.title, 
      article.topic, 
      article.author, 
      article.body, 
      article.created_at, 
      article.votes || 0, 
      article.article_img_url || null
    ]
  })
      const articlesInsert = format(`INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L RETURNING *;`, articleValues);
        return db.query(articlesInsert);
  })
  .then(() => 
  {
    return db.query(`SELECT article_id, title, FROM articles`)
    .then(result => {
      const articleLookup = {};
      result.rows.forEach(article => {
        articleLookup[article.title] = article.article_id;
      })
      const commentValues = commentData.map(comment => {
        return [
        comment.body, 
        comment.votes,
        comments.author, 
        new Date(comment.created_at),
        articleLookup[comment.article_title]
      ]
    });
      const commentsInsert = format(`insert into comments(body, votes, author, created_at, article_id)
        VALUES &L RETURNING *;`, commentValues
      );
      return db.query(commentsInsert)
    });
  });
      } ;     
      module.exports = seed;
 







      