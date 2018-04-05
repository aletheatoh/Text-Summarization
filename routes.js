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
 const folders = require('./controllers/folder');

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
   app.get('/articles', articles.articlesHomePage(db));
   app.get('/articles/:id/edit', articles.updateForm(db)); // done
   app.put('/articles/:id/edit', articles.update(db)); // done
   app.get('/articles/new', articles.createForm); // done
   app.post('/articles', articles.create(db)); // done
   app.get('/articles/:id', articles.get(db)); // done
   app.delete('/articles/:id', articles.deleteArticle(db));

   // CRUD folders
   app.get('/folders/new', folders.createForm); // done
   app.get('/folders', folders.foldersHomePage(db));
   app.post('/folders', folders.create(db)); // done
   app.get('/folders/:id', folders.get(db)); // done
   app.get('/folders/:id/edit', folders.updateForm(db)); // done
   app.put('/folders/:id/edit', folders.update(db)); // done
   app.delete('/folders/:id', folders.deleteFolder(db));

 };
