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

// handle duplicates
  function uniq(a) {
    var seen = {};
    return a.filter(function(item, index) {
        return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true);
    });
  }

 const get = (db) => {
   return (request, response) => {
     // use article model method `get` to retrieve article data
     db.writing_piece.get(request.params.id, (error, queryResult) => {
       // queryResult contains article data returned from the article model
       db.folder.getWritingPieceFolders(request.params.id, (err, res) => {
         // queryResult contains article data returned from the article model
         if (error) {
           console.error('error getting writing piece:', error);
           response.sendStatus(500);
         }

         else {
           let context = {
             writing_piece: queryResult.rows[0],
             folders: uniq(res.rows)
           }

           if (request.query.success == "true") {
             context['edit_success'] = true;
           }

           // render article.handlebars in the article folder
           response.render('writing_piece/writing_piece', context);

         }
       });
     });
   };
 };

 const writingPiecesHomePage = (db) => {
   return (request, response) => {
     // retrieve cookies
     let loggedIn = request.cookies['loggedIn'];
     let username = request.cookies['username'];
     // let email = request.cookies['email'];

     db.article.getUserArticles(username, (error, queryResult) => {
       // queryResult contains article data returned from the article model
       db.writing_piece.getUserWritingPieces(username, (anotherErr, anotherQr) => {

         db.folder.getUserFolders(username, (err, qr) => {

           db.folder.folders_and_articles((e, res) => {

             db.folder.folders_and_writing_pieces((er, r) => {

               if (er) {
                 console.error('error getting article:', er);
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

                 var folder_writing_pieces = {};

                 r.rows.forEach(function(item){
                   var folder_id = parseInt(item.folder_id);
                   var writing_id = item.writing_id;
                   if (folder_writing_pieces[item.folder_id] === undefined) {
                     folder_writing_pieces[item.folder_id] = {};
                     folder_writing_pieces[item.folder_id]['folder_id'] = folder_id;
                     folder_writing_pieces[item.folder_id]['writing_pieces'] = [];
                   }
                   folder_writing_pieces[item.folder_id]['writing_pieces'].push(writing_id);
                 });

                 let context = {
                   loggedIn: loggedIn,
                   username: username,
                   articles: queryResult.rows,
                   writing_pieces: anotherQr.rows,
                   folders: qr.rows,
                   folder_articles: folder_articles,
                   folder_writing_pieces: folder_writing_pieces
                 };

                 response.render('writing_piece/writing_pieces', context);
               }
             });
           });
         });
       });
     });
   };
 };

 const updateForm = (db) => {
   return (request, response) => {

     db.writing_piece.get(request.params.id, (error, queryResult) => {
       // queryResult contains article data returned from the article model
       let username = request.cookies['username'];
       db.folder.getUserFolders(username, (err, qr) => {

         if (err) {
           console.error('error getting writing piece:', err);
           response.sendStatus(500);
         } else {
           let context = {
             writing_piece: queryResult.rows[0],
             folders: qr.rows
           }
           // render article.handlebars in the article folder
           response.render('writing_piece/edit', context);
         }
       });
     });
   };
 };

 const update = (db) => {
   return (request, response) => {

     db.writing_piece.update(request.params.id, request.body, (error, queryResult) => {
       console.log(request.body);
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
           db.folder.addWritingPieceToFolder(parseInt(request.params.id), parseInt(id), (err, ar) => {
             if (err) {
               console.error('error:', err);
               response.sendStatus(500);
             }
             if (queryResult.rowCount >= 1) {
               console.log('writing piece added successfully');
             } else {
               console.log('writing piece could not be added');
             }
           });
         });
       }
       response.redirect(`/writing_pieces/${request.params.id}?success=true`);
     });
   };
 };

 const deleteWritingPiece = (db) => {
   return (request, response) => {
     db.writing_piece.deleteWritingPiece(request.params.id, (error, queryResult) => {

       if (error) {
         console.error('error getting writing piece:', error);
         response.sendStatus(500);
       }
       let context = {
         delete_success: true
       }
       response.render('writing_piece/edit', context);
     });
   };
 };

 const createForm = (request, response) => {
   response.render('writing_piece/new');
 };

 const create = (db) => {
   return (request, response) => {
     let user_id = parseInt(request.cookies['user-id']);

     // use article model method `create` to create new article entry in db
     db.writing_piece.create(user_id, request.body, (error, queryResult) => {
       // queryResult of creation is not useful to us, so we ignore it

       if (error) {
         console.error('error getting writing piece:', error);
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
       response.render('writing_piece/new', context);
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
   writingPiecesHomePage,
   updateForm,
   update,
   deleteWritingPiece,
   createForm,
   create
 };
