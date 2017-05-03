if (!global._babelPolyfill) {
  require('babel-polyfill');
}

const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });

const dbCredentials = require('./dbCredentials/dbCredentials.js');

const db = pgp(dbCredentials);
const dropCarTable = `DROP TABLE IF EXISTS cars`;
const createCarTable = `CREATE TABLE IF NOT EXISTS cars (id SERIAL PRIMARY KEY, make TEXT UNIQUE, model TEXT, reg TEXT)`;
const insertCars = `INSERT INTO cars (make, model, reg) VALUES ('Ford', 'Fiesta', 'YD08 PET'), ('Vauxhall', 'Corsa', 'PO77 2VV'), ('Volkswagon', 'Golf', 'A211 JII'), ('Skoda', 'Yeti', 'A321 J90'), ('Jaguar', 'XKR', 'A321 J90') ON CONFLICT DO NOTHING`;
const getAllCars = `SELECT * FROM cars`;

async function createCars(event) {
  try {
    console.log(JSON.stringify({ event: event }));
    // console.log('dropping car table');
    // await db.query(dropCarTable);
    console.log('try creating car table');
    await db.query(createCarTable);
    console.log('car table created');
    await db.query(insertCars);
    console.log('cars inserted into table');
    const rows = await db.query(getAllCars);
    console.log('cars retrieved: ', rows);
    pgp.end();
    return rows;
  }
  catch (err) {
    pgp.end();
    return err;
  }
}

module.exports.carDB = (event, context, cb) => {
  console.log(JSON.stringify(event));
  context.callbackWaitsForEmptyEventLoop = false;
  const param1 = event.pathParameters ? event.pathParameters.stuff : 'param 1 not supplied';
  const param2 = event.pathParameters ? event.pathParameters.morestuff : 'param 2 not supplied';
  createCars(event)
    .then(rows => cb(null, {
      statusCode: '200',
      body: JSON.stringify({ cars: rows, param1: param1, param2: param2 }),
      headers: { 'Content-Type': 'application/json' }
    }))
    .catch(error => cb(new Error(error)));
};