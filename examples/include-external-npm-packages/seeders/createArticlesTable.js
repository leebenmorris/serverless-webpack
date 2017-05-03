const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });

const dbCredentials = require('../dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

const dropArticlesTable = `DROP TABLE IF EXISTS articles`;
const createArticlesTable = `
  CREATE TABLE articles (
    id SERIAL PRIMARY KEY, 
    href TEXT UNIQUE, 
    title TEXT,
    description TEXT,
    is_fake BOOLEAN DEFAULT false,
    pending BOOLEAN DEFAULT true,
    user_id INT,
    domain_id INT,
    post_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (domain_id) REFERENCES domains(id)
  )`;
const seedArticlesTable = `
  INSERT INTO articles (href, title, description, is_fake, user_id, domain_id)
  VALUES 
    ('www.theguardian.com/article1', 'Article 1', 'Article Text 1', true, 1, 1), 
    ('www.independent.co.uk/article2', 'Article 2', 'Article Text 2', true, 1, 2), 
    ('www.telegraph.co.uk/article3', 'Article 3', 'Article Text 3', true, 1, 3), 
    ('www.bbc.co.uk/article4', 'Article 4', 'Article Text 4', true, 1, 4), 
    ('www.thetimes.co.uk/article5', 'Article 5', 'Article Text 5', true, 1, 5)`;

async function createArticles() {
  try {
    await db.query(dropArticlesTable);
    await db.query(createArticlesTable);
    await db.query(seedArticlesTable);
    pgp.end();
    return 'articles table created';
  }
  catch (err) {
    pgp.end();
    return err;
  }
}

createArticles()
  .then(result => console.log(result))
  .catch(error => new Error(error));

module.exports = createArticles;

