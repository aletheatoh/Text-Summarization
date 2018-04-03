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
     create: (user_id, article, callback) => {

       // generate summary
       node_sum.summarize(`${article.url}`, function(result, failure) {
       	if (failure) {
       		console.log("An error occured! " + result.error);
       	}

        var summary = result.summary.join("\n");

        // set up query
        var queryString = `INSERT INTO articles (user_id, title, url, summary)
          VALUES ($1, $2, $3, $4);`;

        var values = [
          user_id,
          article.title,
          article.url,
          summary
        ];

        // execute query
        dbPool.query(queryString, values, (error, queryResult) => {
          // invoke callback function with results after query has executed
          callback(error, queryResult);
        });
       });
     },

     update: (id, article, callback) => {
       // set up query

       var queryString = `UPDATE articles SET title='${article.title}', url='${article.url}', summary='${article.summary}' WHERE id='${id}';`;

       // execute query
       dbPool.query(queryString, (error, queryResult) => {
         // invoke callback function with results after query has executed

         callback(error, queryResult);
       });
     },

     deleteArticle: (id, article, callback) => {
       // set up query

       var queryString = `DELETE FROM articles WHERE id=${id};`;

       // execute query
       dbPool.query(queryString, (error, queryResult) => {
         // invoke callback function with results after query has executed

         callback(error, queryResult);
       });
     },

     get: (id, callback) => {
       dbPool.query("SELECT * from articles WHERE id=" + id, (error, queryResult) => {
         callback(error, queryResult);
       });
     },

     getUserArticles: (username, callback) => {

       // select articles of each user
       var queryString = `SELECT articles.id, articles.title, articles.url, articles.summary from articles INNER JOIN users ON articles.user_id = users.id WHERE name='${username}';`;

       dbPool.query(queryString, (error, queryResult) => {
         callback(error, queryResult);
       });
     }
   };
 };
