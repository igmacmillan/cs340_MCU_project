/*  
    Uses express, dbcon for database connection, body parser to parse form data 
    handlebars for HTML templates  
*/
var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9339);
app.use('/static', express.static('public'));
app.set('mysql', mysql);
app.use('/characters', require('./Characters.js'));
app.use('/teams', require('./SuperTeams.js'));
app.use('/weapons', require('./Weapons.js'));
app.use('/powers', require('./Powers.js'));
app.use('/', express.static('public'));

app.get('/',function(req,res){
   res.render('homepage');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on flip3.engr.oregonstate.edu' + app.get('port') + '; press Ctrl-C to terminate');
});
