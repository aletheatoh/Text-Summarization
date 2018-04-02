/**
 * Routes file.
 *
 * All routes you want to match in the app should appear here.
 * Upon match, a corresponding controller method should be called.
 *
 * Export as a function using `module.exports`,
 * to be imported (using `require(...)`) in `index.js`.
 */
 const users = require('./controllers/user');
 const articles = require('./controllers/article');
 const writing_pieces = require('./controllers/writing_piece');

 module.exports = (app, db) => {
   /*
    *  =========================================
    *  Users
    *  =========================================
    */
   // CRUD users
   app.get('/users/new', users.newForm); // done
   app.post('/users', users.create(db)); // done

   // Authentication
   app.post('/users/logout', users.logout); // done
   app.get('/users/login', users.loginForm); // done
   app.post('/users/login', users.login(db)); // done
   app.get('/users/:id', users.get(db)); // done

   /*
    *  =========================================
    *  Articles
    *  =========================================
    */
   // CRUD articles
   app.get('/articles/:id/edit', articles.updateForm(db)); // done
   app.put('/articles/:id/edit', articles.update(db)); // done
   app.get('/articles/new', articles.createForm); // done
   app.post('/articles', articles.create(db)); // done
   app.get('/articles/:id', articles.get(db)); // done

 };
