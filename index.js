const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const db = require('./db');
const http = require("https");
const jsonfile = require('jsonfile');

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Set handlebars to be the default view engine
app.engine('handlebars', handlebars.create().engine);
app.set('view engine', 'handlebars');

/**
 * ===================================
 * Routes
 * ===================================
 */

// Import routes to match incoming requests
require('./routes')(app, db);

// tell Express to look into the public/ folder for assets that should be publicly available (eg. CSS files, JavaScript files, images, etc.)
app.use(express.static('public'));

// Root GET request (it doesn't belong in any controller file)
app.get('/', (request, response) => {
  let loggedIn = request.cookies['loggedIn'];
  let username = request.cookies['username'];
  let email = request.cookies['email'];

  // get id user
  var queryString = `SELECT id FROM users WHERE name='${username}' AND email='${email}';`;

  db.pool.query(queryString, (error, queryResult) => {

    if (error) console.error('error!', error);
    response.cookie('user-id', queryResult.rows[0].id); // set cookie

    let context = {
      loggedIn: loggedIn,
      username: username,
    };

    if (loggedIn) response.render('home', context);
    else response.render('user/login');

  });

});

// Catch all unmatched requests and return 404 not found page
app.get('*', (request, response) => {
  response.render('404');
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

// Run clean up actions when server shuts down
server.on('close', () => {
  console.log('Closed express server');

  db.pool.end(() => {
    console.log('Shut down db connection pool');
  });
});
