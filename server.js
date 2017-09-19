// server.js

var express = require('express');
var app = express();
let url = require("url");
let http = require("http");
let mongo = require("mongodb").MongoClient;

app.use(express.static('public'));

let mongoUri = process.env.MONGO_DB_URI;
var collectionName = 'imagesearch';


/**
 * Perform a log search in the given database, connects to the database and searches for the given term
 * inserts the item into the database
 * @param argument for the image search in db
 * @param callback Callback function
*/
function logSearch(argument, callback){
    mongo.connect(mongoUri, (err, db)=>{
      if(err){
        return callback(err);
      }
      
      let document = {
        term : argument,
        when : new Date()
      }
      
      db.collection(collectionName)
        .insert(document, (err, result) => {
          if(err){
            return callback(err);
          }
          
          db.close()
          callback(null);
      });
    });
}

mongo.connect(process.env.MONGO_DB_URI, (err, db)=>{
  if(err){
    console.log("Can't connect to DB")
    throw err
  }
  
  // define the collection to use
  let collection = db.collection("image_history");

  // home index
  app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
  });
  
  // url to get the images
  app.get("/imagesearch/:arg", (request, response)=> {
    let arg = request.params.arg;
    let offset = request.query.offset || 1;
    
  })

  // listen for requests :)
  let port = process.env.PORT || 8000

  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
  
});
