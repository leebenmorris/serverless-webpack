const url = require('url');
const href = 'www.bbc5.co.uk/article45';

const urlObj = url.parse(href);

const articleDomain = urlObj.protocol && urlObj.hostname || url.parse('http://' + href).hostname;
const articleHref = urlObj.protocol ? urlObj.hostname + urlObj.pathname : urlObj.pathname;

console.log('articleDomain: ', articleDomain);
console.log('articleHref: ', articleHref);

const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });
const dbCredentials = require('./dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

const getDomainId = 'SELECT id FROM domains WHERE domain = $1';
const getArticleId = 'SELECT id FROM articles WHERE href = $1';
const updateReliabilityInDomainTable = 'UPDATE domains SET reliability = reliability + $1';
const incrementArticleCountInDomainTable = 'UPDATE domains SET article_count = article_count + 1';
const addDomain = 'INSERT INTO domains (domain) VALUES ($1)';
const addArticle = 'INSERT INTO articles (title, domain_id, description, is_fake, href, userId) VALUES ($1, $2, $3, $4, $5, $6)';

db.oneOrNone(getArticleId, articleHref)
  .then(articleId => {
    articleId = articleId && articleId.id;
    console.log('articleId: ', articleId);
  })
  .catch(err => console.log(err))
  .then(pgp.end());

db.oneOrNone(getDomainId, articleDomain)
  .then(domainId => {
    domainId = domainId && domainId.id;
    console.log('domainId: ', domainId);
  })
  .catch(err => console.log(err))
  .then(pgp.end());