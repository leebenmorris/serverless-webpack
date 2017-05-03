global._babelPolyfill || require('babel-polyfill');

const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });

const dbCredentials = require('../dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

const changeVotes = `UPDATE comments SET votes = votes + $1 WHERE comments.id = $2`;

async function updateTables(params) {
  try {
    const voteChange = {up: 1, down: -1}[params.vote] || 0;

    await db.none(changeVotes, [voteChange, params.id]);
    pgp.end();

    return {
      message: 'comments table updated',
      statusCode: 200
    };
  }
  catch (err) {
    return err;
  }
}

module.exports.handler = (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  updateTables(event.queryStringParameters)
    .then(res => cb(null, {
      statusCode: '200',
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(res)
    }))
    .catch(err => cb(new Error(err)));
};
