NC News API
This is the backend NC News, a Restful API that serves articles, comments, users and topics.
It provides endpoints for fetching, posting and updating data, making it ideal for building a new-related application.
The hosted version of the api is available at https://some-ncnews.onrender.com
Project Summary
NC News is a database -driven API that allows users to:
Fetch new articles by topic, author and popularity.
Sort articles by date, title or comment count.
Vote or down-vote articles and comments.
This API is built using Node.js, express, PostgreSQL, and follows RESTful principles.
Installation and Setup Guide:
Clone the repository
Install dependencies
Setup PostgreSQL Database
Create .env files - for environment variables,  .env.
.env.development, PGDATABASE=nc_news
.env.test, PGDATABASE=nc_news_test
Both .env files should be added to gitignore. This will secure vital information that should not be pushed to GitHub
Seed the local Database
Then run tests 
Minimum Requirement
Node.js: v18+
PostgreSQL: v12+.
Start the server locally: The server will run at localhost:9090 by default.
API DOCUMENTATION - For available endpoints and usage. Check the hosted version or the /API route when running locally.