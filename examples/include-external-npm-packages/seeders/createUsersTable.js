const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });

const dbCredentials = require('../dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

const dropUsersTable = `DROP TABLE IF EXISTS users`;
const createUsersTable = `
  CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    first_name TEXT, 
    last_name TEXT,
    username TEXT,
    password TEXT,
    email TEXT,
    moderator BOOLEAN,
    join_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;
const seedUsersTable = `
  INSERT INTO users (first_name, last_name, username, password, email, moderator)
  VALUES 
    ('Lee', 'Morris', 'LeeMorris', 'password1', 'lee@email.com', true),
    ('Richard', 'Thompson', 'RichardThompson', 'password2', 'richard@email.com', true),
    ('Laura', 'Kenny', 'LauraKenny', 'password3', 'laura@email.com', true),
    ('Joe', 'Caine', 'JoeCaine', 'password4', 'joe@email.com', true),
    ('Sam', 'Caine', 'SamCaine', 'password5', 'sam@email.com', true)`;

async function createUsers() {
  try {
    await db.query(dropUsersTable);
    await db.query(createUsersTable);
    await db.query(seedUsersTable);
    pgp.end();
    return 'users table created';
  }
  catch (err) {
    pgp.end();
    return err;
  }
}

createUsers()
  .then(result => console.log(result))
  .catch(error => new Error(error));

module.exports = createUsers;
