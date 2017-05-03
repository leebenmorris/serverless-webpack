global._babelPolyfill || require('babel-polyfill');

const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });
const url = require('url');

const dbCredentials = require('../dbCredentials/dbCredentials.js');
const db = pgp(dbCredentials);

const getDomainId = 'SELECT id FROM domains WHERE domain = $1';
const getArticleId = 'SELECT id FROM articles WHERE href = $1';

const addDomain = `
  INSERT INTO domains (domain) 
  VALUES ($1)
  ON CONFICT DO NOTHING
  RETURNING id`;
const addArticle = `
  INSERT INTO articles (title, domain_id, href, user_id) 
  VALUES ($1, $2, $3, $4)
  ON CONFLICT DO NOTHING
  RETURNING id`;
const addComment = `
  INSERT INTO comments (comment, user_id, article_id) 
  VALUES ($1, $2, $3)`;
const incrementArticleCountInDomainTable = `
  UPDATE domains 
  SET article_count = article_count + 1 
  WHERE domains.id = $1`;

async function updateTables(body) {
  body = JSON.parse(body);

  const title = body.title;
  const comment = body.comment;
  const href = body.href;
  const userId = body.userId;

  const urlObj = url.parse(href);
  const articleHref = urlObj.protocol ? urlObj.hostname + urlObj.pathname : urlObj.pathname;
  const articleDomain = urlObj.protocol ? urlObj.hostname : url.parse('http://' + href).hostname;

  let andDomainText = '';

  try {
    let articleId = await db.oneOrNone(getArticleId, articleHref);
    articleId = articleId && articleId.id;
    
    if (articleId) {
      await db.none(addComment, [comment, userId, articleId]);
      
      pgp.end();
      return {
        message: 'article and domain already in database, and comment added to database',
        newArticle: false,
        articleId: articleId,
        statusCode: 201
      };
    }

    let domainId = await db.oneOrNone(getDomainId, articleDomain);
    domainId = domainId && domainId.id;

    if (!domainId) {
      await db.none(addDomain, articleDomain);

      domainId = await db.oneOrNone(getDomainId, articleDomain);
      domainId = domainId && domainId.id;

      andDomainText = 'and domain ';
    }

    await db.none(addArticle, [title, domainId, articleHref, userId]);

    articleId = await db.oneOrNone(getArticleId, articleHref);
    articleId = articleId && articleId.id;
    
    await db.none(incrementArticleCountInDomainTable, domainId);
    
    await db.none(addComment, [comment, userId, articleId]);
    
    pgp.end();
    return {
      message: 'article ' + andDomainText + 'added to database, and comment added to database',
      newArticle: true,
      articleId: articleId,
      statusCode: 201
    };
  }
  catch (err) {
    return err;
  }
}

module.exports.handler = (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  updateTables(event.body)
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
