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
     db.article.get(request.params.id, (error, queryResult) => {
       // queryResult contains article data returned from the article model
       db.folder.getArticleFolders(request.params.id, (err, res) => {
         // queryResult contains article data returned from the article model
         if (error) {
           console.error('error getting article:', error);
           response.sendStatus(500);
         }

         else {
           let context = {
             article: queryResult.rows[0],
             folders: res.rows
           }

           if (request.query.success == "true") {
             context['edit_success'] = true;
           }
           // render article.handlebars in the article folder
           response.render('article/article', context);
         }
       });
     });
   };
 };

 const articlesHomePage = (db) => {
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
               var folder_id = parseInt(item.folder_id);
               var article_id = item.article_id;
               if (folder_articles[item.folder_id] === undefined) {
                 folder_articles[item.folder_id] = {};
                 folder_articles[item.folder_id]['folder_id'] = folder_id;
                 folder_articles[item.folder_id]['articles'] = [];
               }
               folder_articles[item.folder_id]['articles'].push(article_id);
             });

             let context = {
               loggedIn: loggedIn,
               username: username,
               folder_articles: folder_articles
             };

             if (queryResult != undefined) {
               context['articles'] = queryResult.rows;
             }

             if (qr != undefined) {
               context['folders'] = qr.rows;
             }

             if (context['articles'].length == 0) {
               context['noArticles'] = true;
             }

             response.render('article/articles', context);
           }
         });
       });
     });
   };
 };

 const updateForm = (db) => {
   return (request, response) => {

     db.article.get(request.params.id, (error, queryResult) => {
       // queryResult contains article data returned from the article model
       let username = request.cookies['username'];
       db.folder.getUserFolders(username, (err, qr) => {

         if (err) {
           console.error('error getting article:', err);
           response.sendStatus(500);
         } else {
           let context = {
             article: queryResult.rows[0],
             folders: qr.rows
           }
           // render article.handlebars in the article folder
           response.render('article/edit', context);
         }
       });
     });
   };
 };

 const update = (db) => {
   return (request, response) => {

     db.article.update(request.params.id, request.body, (error, queryResult) => {

       if (request.body.folders != '') {
         var array = request.body['folders'].split('<i class=&quot;folder icon&quot;></i>');

         array.forEach(function(item, index) {
           array[index] = item.replace(',', '');
         });
         var removed = array.splice(0,1);

         var res = request.body;
         res['folders'] = array;

         var folder_ids = [];

         if (typeof request.body['id'] == 'string') {
           let folder = request.body['name'];

           if (array.includes(folder.toLowerCase())) folder_ids.push(request.body['id']);
         }

         else request.body['id'].forEach(function(item, index) {
           let folder = request.body['name'][index];
           if (array.includes(folder.toLowerCase())) {
             folder_ids.push(item);
           }
         });

         folder_ids.forEach(function(id) {
           db.folder.addArticleToFolder(parseInt(request.params.id), parseInt(id), (err, ar) => {
             if (err) {
               console.error('error:', err);
               response.sendStatus(500);
             }
             if (queryResult.rowCount >= 1) {
               console.log('article added successfully');
             } else {
               console.log('article could not be added');
             }
           });
         });
       }

       response.redirect(`/articles/${request.params.id}?success=true`);
     });
   };
 };

 const deleteArticle = (db) => {
   return (request, response) => {
     db.article.deleteArticle(request.params.id, (error, queryResult) => {

       if (error) {
         console.error('error getting article:', error);
         response.sendStatus(500);
       }
       let context = {
         delete_success: true
       }
       response.render('article/edit', context);
     });
   };
 };

 const createForm = (request, response) => {
   response.render('article/new');
 };

 const create = (db) => {
   return (request, response) => {
     let user_id = parseInt(request.cookies['user-id']);

     // use article model method `create` to create new article entry in db
     db.article.create(user_id, request.body, (error, queryResult) => {
       // queryResult of creation is not useful to us, so we ignore it

       if (error) {
         console.error('error getting article:', error);
         response.sendStatus(500);
       }

       if (queryResult.rowCount >= 1) {
         console.log('article created successfully');
       } else {
         console.log('article could not be created');
       }

       let context = {
         create_success: true
       }
       response.render('article/new', context);

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
   articlesHomePage,
   updateForm,
   update,
   deleteArticle,
   createForm,
   create
 };
