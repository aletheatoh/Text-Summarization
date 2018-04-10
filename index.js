const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const db = require('./db');
const http = require("https");
// var passport = require('passport')
//   , FacebookStrategy = require('passport-facebook').Strategy;

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
const handlebarsConfigs = {
  extname: '.handlebars',
  layoutsDir: 'views'
  // defaultLayout: 'layout'
};

app.engine('.handlebars', handlebars(handlebarsConfigs));
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
  let user_id = request.cookies['user-id'];

  // get id user is user_id cookie does not exist

  var queryString = `SELECT id FROM users WHERE name='${username}' AND email='${email}';`;

  var context = {
    loggedIn: loggedIn,
    username: username,
    id: user_id
  };

  if (request.query.returninguser == "true") context['returningUser'] = true;

  if (loggedIn) {

    if (user_id == undefined) {
      console.log('im here again');

      db.user.getUserId(username, (error, queryResult) => {

        context['id'] = queryResult.rows[0].id;
        response.clearCookie('user-id');
        response.cookie('user-id', queryResult.rows[0].id);
        response.render('home', context);
        return;
      });
    }

    else {
      response.render('home', context);
      return;
    }
  }

  else {
    response.clearCookie('loggedIn');
    response.clearCookie('username');
    response.clearCookie('email');
    response.clearCookie('user-id');
    response.render('welcome');
  }
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

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log('~~~ Tuning in to the waves of port '+PORT+' ~~~'));

// Run clean up actions when server shuts down
server.on('close', () => {
  console.log('Closed express server');

  db.pool.end(() => {
    console.log('Shut down db connection pool');
  });
});
