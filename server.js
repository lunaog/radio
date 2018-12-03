// Adapted from Daniel Shiffman's A2Z F18
// https://github.com/shiffman/A2Z-F18
// http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010

// Using express: http://expressjs.com/
var express = require('express');

// Create the app
var app = express();
var bodyParser = require('body-parser');

// This is allowing you to create processes so you can use youtube-dl
var child_process = require('child_process');

// File System for loading the list of words
var fs = require('fs');

// Cors for allowing "cross origin resources"
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
var cors = require('cors');
app.use(cors());

var router = new express.Router();
app.use('/form.html', function(req, res) {
  var lat = req.query.lat;
  var lon = req.query.lon;
  console.log(lat);
  console.log(lon);
  //console.log(req);
  //console.log(res);
  res.sendFile('form.html', {root: "public"});
});
// This is for hosting files
app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// artist.json "database" (in addition to what is in the AFINN-111 list)
// check first to see if it exists
var Artist;
var exists = fs.existsSync('artists.json');
if (exists) {
  // Read the file
  console.log('loading artists');
  var txt = fs.readFileSync('artists.json', 'utf8');
  // Parse it  back to object
 artists = JSON.parse(txt);
} else {
  // Otherwise start with blank list
  console.log('No artists');
  artists = [];
}


// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

//return all artists as  a json
app.get('/api/get', function(req, res){
  res.json(artists);
});

// Route for sending all the concordance data
app.get('/all', showAll);

// Callback
function showAll(req, res) {
  // Send the entire dataset
  // express automatically renders objects as JSON
  res.send(artists);
}

// A route for adding a new word with a score
app.post('/api/create', addArtist);

// Handle that route
function addArtist(req, res) {
  // Word and score
  //var word = req.params.word;
  // Make sure it's not a string by accident
 // var score = Number(req.params.score);

 console.log(req.body);
 var name = req.body.name;
 var continent = req.body.continent; 
 var country = req.body.country;
 var state = req.body.state;
 var city = req.body.city;
 var file = req.body.file;
 var genre = req.body.genre;
 var lat = req.body.lat;
 var lon = req.body.lon;
 
// YOUTUBE-DL
  options = [
    '--format=bestaudio', //download the one w best audio
    '--extract-audio', //ensures that u only get audio, throw out video 
    '--prefer-ffmpeg', //convert w FFMPEG
    '--ffmpeg-location', '/Users/lunaolavarriagallegos/.local/bin/ffmpeg', //ffmpeg located in this bin 
    '--recode-video', 'webm', //recode using webm
    '--output', 'music/%(title)s.%(ext)s', //the file will end up in the music folder w name "titleofvide.webm"
    '--print-json',
    '--no-progress',
    file]
  //child_process.execFile("/Users/lunaolavarriagallegos/Library/Python/2.7/bin/youtube-dl", options, callback); 
  var buff = child_process.execFileSync("/Users/lunaolavarriagallegos/Library/Python/2.7/bin/youtube-dl", options);
  var filename = JSON.parse(buff.toString())["_filename"];

  // Let the request know it's all set
  var artist = {
    name:name, 
    continent:continent,
    country:country,
    state:state, 
    city:city, 
    file:file,
    genre:genre,
    lat:lat,
    lon:lon,
    filename:filename
  };
    
  //Artist Data
  artists.push(artist);

  console.log('adding: ' + JSON.stringify(artist));

  // Write a file each time we get a new word
  // This is kind of silly but it works
  var json = JSON.stringify(artists, null, 2);
  fs.writeFile('artists.json', json, 'utf8', finished);
  function finished(err) {
    console.log('Finished writing artists.json');
    // Don't send anything back until everything is done
    res.send(artist);
  }
}

//write a function called set lat and long 
