var connection = require('.././config');



function userslist(table, callback){
	var sql = " select * from " + table;
	connection.query(sql, function(err, anil){

		callback(err, anil);
		
		console.log("err " + JSON.stringify(err))
		console.log("result " + JSON.stringify(anil))
	});
}

module.exports.userslist = userslist;





function tragetlist(table,callback){
	var sql = " select * from " + table;

	connection.query(sql,function(err,result){

		callback(err,result);
	})
}

module.exports.tragetlist = tragetlist;




function loginsuccess(table,data,callback){

	console.log("data is :"+ data);

	//select * from adminrole where name = ?",req.body.name

	var sql = " select * from " + table + " where name = ? ";

	connection.query(sql,data,function(err,result){

		callback(err,result)
	})
}

module.exports.loginsuccess = loginsuccess;