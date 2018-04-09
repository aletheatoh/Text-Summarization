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
 const folder = require('./models/folder');
 const url = require('url');

 //check to see if we have this heroku environment variable
if( process.env.DATABASE_URL ){

  //we need to take apart the url so we can set the appropriate configs

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  //make the configs object
  var configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  };
}

else {

  //otherwise we are on the local network
  var configs = {
    user: 'alethea',
    host: '127.0.0.1',
    database: 'project_2',
    port: 5432
  };
}

 const pool = new pg.Pool(configs);

 pool.on('error', function (err) {
   console.log('idle client error', err.message, err.stack);
 });

 module.exports = {
   pool: pool,
   user: user(pool),
   article: article(pool),
   folder: folder(pool),
   writing_piece: writing_piece(pool)
 };
