global._babelPolyfill || require('babel-polyfill');

const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });

const dbCredentials = require('../dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

const addComment = `
  INSERT INTO comments (comment, user_id, connecting_comment_id, article_id) 
  VALUES ($1, $2, $3, $4)`;

async function updateTables(body) {
  body = JSON.parse(body);

  const comment = body.comment;
  const userId = body.userId;
  const threadId = body.threadId;
  const articleId = body.articleId;

  try {
    await db.none(addComment, [comment, userId, threadId, articleId]);
    return { status: 201 };
  }
  catch (err) {
    return err;
  }
}

module.exports.handler = (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  updateTables(event.body)
    .then(res => cb(null, {
      statusCode: '201',
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(res)
    }))
    .catch(err => cb(new Error(err)));
};
