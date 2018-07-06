var mysql = require('mysql');

var connection = mysql.createConnection({

	host : 'localhost',

	user : 'root',

	password: 'root',

	database: 'vapp'

});

connection.connect(function(err){

	if(err){
		throw err;
	} else {
		console.log("database connected");
	}

});

module.exports = connection;