/**
 * Article model functions.
 *
 * Any time a database SQL query needs to be executed
 * relating to an article (be it C, R, U, or D),
 * one or more of the functions here should be called.
 *
 * Export all functions as a module using `module.exports`,
 * to be imported (using `require(...)`) in `db.js`.
 */

 var node_sum = require('node-tldr');

 /**
  * ===========================================
  * Export model functions as a module
  * ===========================================
  */
 module.exports = (dbPool) => {
   // `dbPool` is accessible within this function scope
   return {
     // create an article
     create: (name, user_id, callback) => {

       var user_id = parseInt(user_id);
       // set up query
       var queryString = `INSERT INTO folders (name, user_id) VALUES ('${name}', ${user_id});`;

       // execute query
       dbPool.query(queryString, (error, queryResult) => {
         // invoke callback function with results after query has executed
         callback(error, queryResult);
       });
     },

     update: (id, folder, callback) => {
       // set up query

       var queryString = `UPDATE folders SET name='${folder.name}' WHERE id='${id}';`;

       // execute query
       dbPool.query(queryString, (error, queryResult) => {
         // invoke callback function with results after query has executed
         callback(error, queryResult);
       });
     },

     deleteFolder: (id, callback) => {
       // set up query

       var queryString = `DELETE FROM folders WHERE id=${id};`;

       // execute query
       dbPool.query(queryString, (error, queryResult) => {
         // invoke callback function with results after query has executed
         var qs = `DELETE FROM organized_articles WHERE folder_id=${id};`;
         // execute query
         dbPool.query(qs, (err, qr) => {
           // invoke callback function with results after query has executed
           callback(err, qr);
         });
       });
     },

     get: (id, callback) => {
       dbPool.query("SELECT * from folders WHERE id=" + id, (error, queryResult) => {
         callback(error, queryResult);
       });
     },

     getUserFolders: (username, callback) => {

       // select folders of each user
       var queryString = `SELECT folders.id, folders.name from folders INNER JOIN users ON folders.user_id = users.id WHERE users.name='${username}';`;

       dbPool.query(queryString, (error, queryResult) => {
         callback(error, queryResult);
       });
     },

     getFolderArticles: (folder_id, callback) => {

       // select articles of each folder
       var queryString = `SELECT articles.id, articles.title, articles.url, articles.summary from articles INNER JOIN organized_articles ON articles.id = organized_articles.article_id WHERE organized_articles.folder_id=${folder_id};`;

       dbPool.query(queryString, (error, queryResult) => {
         callback(error, queryResult);
       });
     },

     getArticleFolders: (article_id, callback) => {

       // select folders of each article
       var queryString = `SELECT folders.id, folders.name from folders INNER JOIN organized_articles ON folders.id = organized_articles.folder_id WHERE organized_articles.article_id=${article_id};`;

       dbPool.query(queryString, (error, queryResult) => {
         callback(error, queryResult);
       });
     },

     folders_and_articles: (callback) => {
       // select foldesr of each user
       var queryString = `SELECT * FROM organized_articles;`;

       dbPool.query(queryString, (error, queryResult) => {
         callback(error, queryResult);
       });
     },

     addArticleToFolder: (article_id, folder_id, callback) => {

       var queryString = `INSERT INTO organized_articles (folder_id, article_id) VALUES (${folder_id}, ${article_id});`

       dbPool.query(queryString, (error, queryResult) => {
         callback(error, queryResult);
       });
     }

   };
 };
