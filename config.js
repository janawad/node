var mysql = require('mysql');

var connection = mysql.createConnection({

	host : 'us-cdbr-iron-east-04.cleardb.net',

	user : 'b9c0273ea47152',

	password: '81dd6b2d',

	database: 'heroku_942e356d507640f'

});

connection.connect(function(err){

	if(err){
		throw err;
	} else {
		console.log("database connected");
	}

});

module.exports = connection;