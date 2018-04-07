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
   app.get('/users/:id/edit', users.updateForm(db)); // done
   app.put('/users/:id/edit', users.update(db)); // done

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
   app.delete('/deletearticle/:article_id/delete/:folder_id', folders.removeArticle(db));

   // CRUD writing_pieces
   app.get('/writing_pieces', writing_pieces.writingPiecesHomePage(db));
   app.get('/writing_pieces/:id/edit', writing_pieces.updateForm(db)); // done
   app.put('/writing_pieces/:id/edit', writing_pieces.update(db)); // done
   app.get('/writing_pieces/new', writing_pieces.createForm); // done
   app.post('/writing_pieces', writing_pieces.create(db)); // done
   app.get('/writing_pieces/:id', writing_pieces.get(db)); // done
   app.delete('/writing_pieces/:id', writing_pieces.deleteWritingPiece(db));
   app.delete('/deletewriting/:writing_id/delete/:folder_id', folders.removeWriting(db));

   // CRUD folders
   app.get('/folders/new', folders.createForm); // done
   app.get('/folders', folders.foldersHomePage(db));
   app.post('/folders', folders.create(db)); // done
   app.get('/folders/:id', folders.get(db)); // done
   app.get('/folders/:id/edit', folders.updateForm(db)); // done
   app.put('/folders/:id/edit', folders.update(db)); // done
   app.delete('/folders/:id', folders.deleteFolder(db));

 };
