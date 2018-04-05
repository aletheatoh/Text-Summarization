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

 var summary = require('node-sumuparticles');

 /**
  * ===========================================
  * Export model functions as a module
  * ===========================================
  */
 module.exports = (dbPool) => {
   // `dbPool` is accessible within this function scope
   return {
     // create a writing piece
     create: (user_id, writing_piece, callback) => {

       // generate summary
       // summary.summarize(`${article.url}`, function(title, result, failure) {
       // 	if (failure) {
       // 		console.log("An error occured! " + result.error);
       // 	}

        var summary = "hello";

        // set up query
        var queryString = `INSERT INTO writing_pieces (user_id, title, original, summary)
          VALUES ($1, $2, $3, $4);`;

        var values = [
          user_id,
          writing_piece.title,
          writing_piece.original,
          summary
        ];

        // execute query
        dbPool.query(queryString, values, (error, queryResult) => {
          // invoke callback function with results after query has executed
          callback(error, queryResult);
        });

     },

     update: (id, writing_piece, callback) => {
       // set up query

       var queryString = `UPDATE writing_pieces SET title='${writing_piece.title}', original='${writing_piece.original}', summary='${writing_piece.summary}' WHERE id='${id}';`;

       // execute query
       dbPool.query(queryString, (error, queryResult) => {
         // invoke callback function with results after query has executed

         callback(error, queryResult);
       });
     },

     deleteWritingPiece: (id, callback) => {
       // set up query

       var queryString = `DELETE FROM writing_pieces WHERE id=${id};`;

       // execute query
       dbPool.query(queryString, (error, queryResult) => {
         var qs = `DELETE FROM organized_writing WHERE writing_id=${id};`;
         // execute query
         dbPool.query(qs, (err, qr) => {
           // invoke callback function with results after query has executed
           callback(err, qr);
         });
       });
     },

     get: (id, callback) => {
       dbPool.query("SELECT * from writing_pieces WHERE id=" + id, (error, queryResult) => {
         callback(error, queryResult);
       });
     },

     getUserWritingPieces: (username, callback) => {

       // select articles of each user
       var queryString = `SELECT writing_pieces.id, writing_pieces.title, writing_pieces.original, writing_pieces.summary from writing_pieces INNER JOIN users ON writing_pieces.user_id = users.id WHERE name='${username}';`;

       dbPool.query(queryString, (error, queryResult) => {
         callback(error, queryResult);
       });
     }

   };
 };
