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
     create: (article, callback) => {

       // generate summary
       node_sum.summarize(`${article.url}`, function(result, failure) {
       	if (failure) {
       		console.log("An error occured! " + result.error);
       	}

       	console.log(result.title);
       	console.log(result.words);
       	console.log(result.compressFactor);
       	console.log(result.summary.join("\n"));

        var summary = result.summary.join("\n");

        // set up query
        var queryString = `INSERT INTO articles (user_id, title, url, summary)
          VALUES ($1, $2, $3, $4);`;

        var values = [
          parseInt(article.user_id),
          article.title,
          article.url,
          summary
        ];

        // execute query
        dbPool.query(queryString, values, (error, queryResult) => {
          // invoke callback function with results after query has executed
          callback(error, queryResult);
          console.log(queryResult);
        });
       });
     },

     update: (article, callback) => {
       // set up query

       console.log("request is " + article.user_id);

       var user_id_int = parseInt(article.user_id);

       var queryString = `UPDATE articles SET user_id=${user_id_int}, title='${article.title}', url='${article.url}', summary='${article.summary}' WHERE id='${article.id}';`;
       console.log("qs is " + queryString);

       // execute query
       dbPool.query(queryString, (error, queryResult) => {
         // invoke callback function with results after query has executed

         callback(error, queryResult);
       });
     },

     get: (id, callback) => {

       dbPool.query("SELECT * from articles WHERE id=" + id, (error, queryResult) => {
         callback(error, queryResult);
         console.log(queryResult);
       });
     }
   };
 };
