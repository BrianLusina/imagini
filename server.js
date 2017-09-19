// server.js

let express = require('express');
let app = express();
let url = require("url");
let https = require("https");
let mongo = require("mongodb").MongoClient;
let mongoUri = process.env.MONGO_DB_URI;
let googleApiKey = process.env.GOOGLE_API_KEY;
let googleCtx = process.env.GOOGLE_CTX;
let collectionName = 'imagesearch';

app.use(express.static('public'));

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

/**
* Lists the history of the images in the db, this is based on the searches from history of using this api
* @param the callback function to execute
*/
function listHistory(callback){
  mongo.connect(collectionName, (err, db)=>{
      if(err){
        return callback(err);
      }
    
    db.collection(collectionName)
      .find({ $query: {}, $orderby: { when: -1 } },{ _id: 0 })
      .limit(10).toArray().then((documents)=>{
        db.close();
        callback(null, documents);
      });
    });
}

/**
* Searches for the actual image given the argument, offset and a callback
* The argument is the actual image term to check,
* @param offset is the limit of the result
* @param callback is what is executed, incase of any errors
*/
function searchForImage(argument, offset, callback){
  logSearch(argument, (err)=>{
    if(err){
      return callback(err);
    }
    
    let startIn = (offset - 1) * 10 + 1
    let url = `https://www.googleapis.com/customsearch/v1?&searchType=image&q=${argument}&start=${startIn}&key=${googleApiKey}&cx=${googleCtx}`;
    
    https.get(url, (response) => {
      let body = "";
      response.on("data", (d)=>{
        body  += d;
      })
      
      response.on("end", (d)=>{
        let parsed = JSON.parse(body);
        
        let results = parsed.items.map((item)=>{
          return {
            url : item.link,
            snippet : item.snippet,
            thumbnail: item.image.thumbnailLink,
            context: item.image.contextLink
          }
        });
  
        callback(null, results);
      });
      
    });
      
  });
}


app.set('views', './views');
app.set('view engine', 'pug');
// home index
app.get("/", function (request, response) {
  response.render("index")
});

// url to get the images
app.get("/api/imagesearch/:arg", (request, response)=> {
  let arg = request.params.arg;
  let offset = request.query.offset || 1;
  
  searchForImage(arg, offset, (err, result) => {
    if(err){
      console.log(`Error while searching image ${err}`)
      throw err
    }
    
    response.send(result);
  });

})

// url to search for image search history
app.get("/api/images/latest", (request, response) => {
  listHistory((err, result) => {
        if(err){
          console.log(`Can't list image history with err ${err}`);
          throw err;
        }
    response.send(result);
  });
});

// listen for requests :)
let port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
