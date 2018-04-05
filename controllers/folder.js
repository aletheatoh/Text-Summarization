/**
 * Article controller functions.
 *
 * Each article-related route in `routes.js` will call
 * one controller function here.
 *
 * Export all functions as a module using `module.exports`,
 * to be imported (using `require(...)`) in `routes.js`.
 */
 /**
  * ===========================================
  * Controller logic
  * ===========================================
  */
 const get = (db) => {
   return (request, response) => {
     // use article model method `get` to retrieve article data
     db.folder.get(request.params.id, (error, queryResult) => {
       // queryResult contains article data returned from the article model
       if (error) {
         console.error('error getting folder:', error);
         response.sendStatus(500);
       } else {
         // render article.handlebars in the article folder
         response.render('article/article', { article: queryResult.rows[0] });
       }
     });
   };
 };

 const foldersHomePage = (db) => {
   return (request, response) => {
     // retrieve cookies
     let loggedIn = request.cookies['loggedIn'];
     let username = request.cookies['username'];
     // let email = request.cookies['email'];

     db.article.getUserArticles(username, (error, queryResult) => {
       // queryResult contains article data returned from the article model

       db.folder.getUserFolders(username, (err, qr) => {

         db.folder.folders_and_articles((e, res) => {
           if (e) {
             console.error('error getting article:', e);
             response.sendStatus(500);
           }

           else {

             var folder_articles = {};

             res.rows.forEach(function(item){
               console.log(item);
               var folder_id = parseInt(item.folder_id);
               var article_id = item.article_id;
               if (folder_articles[item.folder_id] === undefined) {
                 folder_articles[item.folder_id] = {};
                 folder_articles[item.folder_id]['folder_id'] = folder_id;
                 folder_articles[item.folder_id]['articles'] = [];
               }
               folder_articles[item.folder_id]['articles'].push(article_id);
             });

             console.log(folder_articles);


             let context = {
               loggedIn: loggedIn,
               username: username,
               articles: queryResult.rows,
               folders: qr.rows,
               folder_articles: folder_articles
             };

             response.render('folder/folders', context);
           }
         });
       });
     });
   };
 };

 const updateForm = (db) => {
   return (request, response) => {
     db.folder.get(request.params.id, (error, queryResult) => {

       if (error) {
         console.error('error getting folder:', error);
         response.sendStatus(500);
       } else {

         response.render('folder/edit', { folder: queryResult.rows[0] });
       }
     });
   };
 };

 const update = (db) => {
   return (request, response) => {

     db.folder.update(request.params.id, request.body, (error, queryResult) => {

       if (error) {
         console.error('error getting folder:', error);
         response.sendStatus(500);
       }

       response.redirect(`/articles/${request.params.id}`);
     });
   };
 };

 const deleteArticle = (db) => {
   return (request, response) => {
     db.article.deleteArticle(request.params.id, request.body, (error, queryResult) => {
       // queryResult of creation is not useful to us, so we ignore it
       // (console log it to see for yourself)
       // (you can choose to omit it completely from the function parameters)

       if (error) {
         console.error('error getting article:', error);
         response.sendStatus(500);
       }
       response.send('successfully deleted');
     });
   };
 };

 const createForm = (request, response) => {
   response.render('article/new');
 };

 const create = (db) => {
   return (request, response) => {
     let user_id = parseInt(request.cookies['user-id']);

     db.folder.create(request.body.name, user_id, (error, queryResult) => {
       // queryResult of creation is not useful to us, so we ignore it

       if (error) {
         console.error('error getting folder:', error);
         response.sendStatus(500);
       }

       if (queryResult.rowCount >= 1) {
         console.log('folder created successfully');
       } else {
         console.log('article could not be created');
       }

       // redirect to articles page after creation
       response.redirect('/articles');
     });
   };
 };

 /**
  * ===========================================
  * Export controller functions as a module
  * ===========================================
  */
 module.exports = {
   get,
   foldersHomePage,
   updateForm,
   update,
   deleteArticle,
   createForm,
   create
 };