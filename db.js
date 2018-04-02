/**
 * Postgres database configuration.
 *
 * Import models and `pg` package.
 * Initialise configuration object with database credentials.
 * Initialise the connection pool with config object.
 *
 * Export the pool and models as a module using `module.exports`.
 */

 const pg = require('pg');
 const user = require('./models/user');
 const article = require('./models/article');
 const writing_piece = require('./models/writing_piece');

 const configs = {
   user: 'alethea',
   host: '127.0.0.1',
   database: 'project_2',
   port: 5432
 };

 const pool = new pg.Pool(configs);

 pool.on('error', function (err) {
   console.log('idle client error', err.message, err.stack);
 });

 module.exports = {
   pool: pool,
   user: user(pool),
   article: article(pool),
   // writing_piece: writing_piece(pool)
 };
