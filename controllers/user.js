/**
* ===========================================
* Controller logic
* ===========================================
*/
const bcrypt = require('bcrypt');
const newForm = (request, response) => {
  response.render('user/new');
};

const get = (db) => {
  return (request, response) => {
    var context = {};
    // use user model method `get` to retrieve user data
    db.user.get(request.params.id, (error, queryResult) => {
      // queryResult contains user data returned from the user model
      if (error) {
        console.error('error getting user:', error);
        response.sendStatus(500);
      } else {
        // render pokemon.handlebars in the pokemon folder

        context.user = queryResult.rows[0];

        response.render('user/user', context);
      }
    });

    db.user.getArticles(request.params.id, (error, queryResult) => {
      // queryResult contains user data returned from the user model
      if (error) {
        console.error('error getting user article details:', error);
        response.sendStatus(500);
      } else {
        // render pokemon.handlebars in the pokemon folder
        if (queryResult != null) context.articles = queryResult.rows;
      }
    });
  };
};

const create = (db) => {
  return (request, response) => {
    // use user model method `create` to create new user entry in db
    db.user.create(request.body, (error, queryResult) => {
      // queryResult of creation is not useful to us, so we ignore it
      // (console log it to see for yourself)

      // (you can choose to omit it completely from the function parameters)

      if (error) {
        console.error('error getting user:', error);
        response.sendStatus(500);
      }

      if (queryResult.rowCount >= 1) {
        console.log('User created successfully');

        // drop cookies to indicate user's logged in status and username
        response.cookie('loggedIn', true);
        response.cookie('username', request.body.name);
        response.cookie('email', request.body.email);

      } else {
        console.log('User could not be created');
      }

      // redirect to home page after creation
      response.redirect('/');
    });
  };
};

const logout = (request, response) => {
  // clear all cookies
  response.clearCookie('loggedIn');
  response.clearCookie('username');
  response.clearCookie('email');
  response.clearCookie('user-id');

  // redirect to home page
  response.redirect(301, '/');
};

const loginForm = (request, response) => {
  response.render('user/login');
};

const login = (db) => {
  return (request, response) => {
    console.log('loggin in in users controller');
    response.clearCookie('loggedIn');
    response.clearCookie('username');
    response.clearCookie('email');
    response.clearCookie('user-id');

    // Hint: All SQL queries should happen in the corresponding model file
    // ie. in models/user.js - which method should this controller call on the model?
    db.user.login(request.body, (error, queryResult) => {

      var hash = queryResult.rows[0].password;

      bcrypt.compare(request.body.password, hash, function(err, res) {

        if( res === true ){
          // set cookie
          response.cookie('loggedIn', 'true');
          response.cookie('username', request.body.name);
          response.cookie('email', request.body.email);
          response.cookie('user-id', queryResult.rows[0].id);
          response.redirect(301,'/');

          return;
        }
        else {
          console.log('incorrect password');
          response.send("password incorrect!");
          return;
        }
      });

      if (error) {
        console.error('error getting user:', error);
        response.sendStatus(500);
      }
    });
  };
};

/**
* ===========================================
* Export controller functions as a module
* ===========================================
*/
module.exports = {
  newForm,
  get,
  create,
  logout,
  loginForm,
  login
};
