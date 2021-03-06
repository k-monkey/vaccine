var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//setup static file in 'public' dir
//look for file at http://localhost:5000/index.html
//instead of http://localhost:5000/public/index.html
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


