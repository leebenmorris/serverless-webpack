const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });

const dbCredentials = require('../dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

async function initDatabase() {
  try {
    await db.query(`DROP TABLE IF EXISTS comments`);
    await db.query(`DROP TABLE IF EXISTS articles`);
    await db.query(`DROP TABLE IF EXISTS domains`);
    await db.query(`DROP TABLE IF EXISTS users`);
    pgp.end();
    await require('./createUsersTable')();
    pgp.end();
    await require('./createDomainsTable')();
    pgp.end();
    await require('./createArticlesTable')();
    pgp.end();
    await require('./createCommentsTable')();
    pgp.end();
    return 'database reset';
  }
  catch (err) {
    pgp.end();
    return err;
  }
}

initDatabase()
  .then(result => console.log(result))
  .catch(error => new Error(error));



