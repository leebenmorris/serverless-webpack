const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });

const dbCredentials = require('../dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

const dropDomainsTable = `DROP TABLE IF EXISTS domains`;
const createDomiansTable = `
  CREATE TABLE domains (
    id SERIAL PRIMARY KEY,
    domain TEXT UNIQUE,
    reliability INT DEFAULT 0, 
    organisation TEXT, 
    org_description TEXT,
    article_count INT DEFAULT 0,
    date_added DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;
const seedDomainsTable = `
  INSERT INTO domains (domain, reliability, article_count, organisation, org_description) 
  VALUES 
    ('www.theguardian.com', 12, 1, 'The Guardian Newspaper', 'The Guardian is a British daily newspaper, known from 1821 until 1959 as the Manchester Guardian. Along with its sister papers The Observer and The Guardian Weekly, The Guardian is part of the Guardian Media Group, owned by The Scott Trust Limited.'),

    ('www.independent.co.uk', 12, 1, 'The Independent Newspaper', 'The Independent is a British online newspaper. Established in 1986 as an independent national morning newspaper published in London, it was controlled by Tony O-Reilly-s Independent News & Media from 1997 until it was sold to Russian oligarch Alexander Lebedev in 2010. The printed edition of the paper ceased in March 2016.'), 

    ('www.telegraph.co.uk', 12, 1, 'The Daily Telegraph Newspaper', 'The Daily Telegraph, commonly referred to simply as The Telegraph, is a national British daily broadsheet newspaper published in London by Telegraph Media Group and distributed across the United Kingdom and internationally. It was founded by Arthur B. Sleigh in 1855 as The Daily Telegraph and Courier.'),

    ('www.bbc.co.uk', 12, 1, 'The BBC News Website', 'The British Broadcasting Corporation (BBC) is a British public service broadcaster. It is headquartered at Broadcasting House in London. The BBC is the world-s oldest national broadcasting organisation and the largest broadcaster in the world by number of employees. It employs over 20,950 staff in total, 16,672 of whom are in public sector broadcasting. The total number of staff is 35,402 when part-time, flexible, and fixed contract staff are included.'),

    ('www.thetimes.co.uk', 12, 1, 'The Times Newspaper', 'The Times is a British daily (Monday to Saturday) national newspaper based in London, England. It began in 1785 under the title The Daily Universal Register, adopting its current name on 1 January 1788. The Times and its sister paper The Sunday Times (founded in 1821) are published by Times Newspapers, since 1981 a subsidiary of News UK, itself wholly owned by News Corp. The Times and The Sunday Times do not share editorial staff, were founded independently and have only had common ownership since 1967.')

  ON CONFLICT DO NOTHING`;

async function createDomains() {
  try {
    await db.query(dropDomainsTable);
    await db.query(createDomiansTable);
    await db.query(seedDomainsTable);
    pgp.end();
    return 'domains table created';
  }
  catch (err) {
    pgp.end();
    return err;
  }
}

createDomains()
  .then(result => console.log(result))
  .catch(error => new Error(error));

module.exports = createDomains;