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
    db.folder.get(request.params.id, (error, queryResult) => {
      // queryResult contains article data returned from the article model
      db.folder.getFolderArticles(request.params.id, (err, qr) => {
        // queryResult contains article data returned from the article model
        db.folder.getFolderWritingPieces(request.params.id, (e, res) => {
          // queryResult contains article data returned from the article model
          if (e) {
            console.error('error getting folder:', e);
            response.sendStatus(500);
          }

          else {
            let context = {
              folder: queryResult.rows[0],
              articles: uniq(qr.rows),
              writing_pieces: uniq(res.rows)
            }

            console.log(context);
            // render article.handlebars in the article folder
            response.render('folder/folder', context);
          }
        });
      });
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

                response.render('folder/folders', context);
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

      db.folder.getFolderArticles(request.params.id, (err, qr) => {

        db.folder.getFolderWritingPieces(request.params.id, (e, res) => {

          if (e) {
            console.error('error getting folder:', e);
            response.sendStatus(500);
          }

          var folder = {
            id: request.params.id,
            name: request.body.name
          }

          let context = {
            edit_success: true,
            folder: folder,
            articles: qr.rows,
            writing_pieces: res.rows
          }

          response.render('folder/folder', context);
        });
      });
    });
  };
};

const deleteFolder = (db) => {
  return (request, response) => {
    db.folder.deleteFolder(request.params.id, (error, queryResult) => {

      if (error) {
        console.error('error getting folder:', error);
        response.sendStatus(500);
      }
      let context = {
        delete_success: true
      }
      response.render('folder/edit', context);
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
      response.redirect('back');
    });
  };

};

const removeArticle = (db) => {
  return (request, response) => {

    db.folder.removeArticleFromFolder(request.params.article_id, request.params.folder_id, (error, queryResult) => {

      if (error) {
        console.error('error getting folder:', error);
        response.sendStatus(500);
      }

      response.redirect(`/articles/${request.params.article_id}`);
    });
  }
};

const removeWriting = (db) => {
  return (request, response) => {

    db.folder.removeWritingFromFolder(request.params.writing_id, request.params.folder_id, (error, queryResult) => {
      if (error) {
        console.error('error getting folder:', error);
        response.sendStatus(500);
      }

      response.redirect(`/articles/${request.params.writing_id}`);
    });
  }
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
  deleteFolder,
  createForm,
  create,
  removeArticle,
  removeWriting
};
