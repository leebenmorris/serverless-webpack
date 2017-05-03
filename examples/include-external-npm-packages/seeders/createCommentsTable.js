const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });

const dbCredentials = require('../dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

const dropCommentsTable = `DROP TABLE IF EXISTS comments`;
const createCommentsTable = (`
  CREATE TABLE comments (
    id SERIAL PRIMARY KEY, 
    comment TEXT, 
    date_added DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0, 
    article_id INT, 
    user_id INT,
    connecting_comment_id INT,
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (connecting_comment_id) REFERENCES comments(id)
  )`
);
const seedCommentsTable = (`
  INSERT INTO comments (comment, article_id, user_id, connecting_comment_id)
  VALUES 
    ('hello comment 1', 1, 1, null), 
    ('hello comment 2', 1, 1, 1), 
    ('hello comment 3', 1, 1, 1), 
    ('hello comment 4', 1, 1, 2), 
    ('hello comment 5', 1, 1, 2),
    ('hello comment 6', 1, 1, 3), 
    ('hello comment 7', 1, 1, 3),
    ('hello comment 8', 1, 1, 3), 
    ('hello comment 9', 1, 1, 3)`
);

async function createComments() {
  try {
    await db.query(dropCommentsTable);
    await db.query(createCommentsTable);
    await db.query(seedCommentsTable);
    pgp.end();
    return 'comments table created';
  }
  catch (err) {
    pgp.end();
    return err;
  }
}

createComments()
  .then(result => console.log(result))
  .catch(error => new Error(error));

module.exports = createComments;
