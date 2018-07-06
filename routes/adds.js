var express = require('express');
var router = express.Router();
var connection = require('.././config')


/* GET users listing. */


router.get('/', function(req, res, next) {
	if(req.isAuthenticated()){
		console.log("req.user" + JSON.stringify(req.user));
		res.render('add',{user:req.user})
	} else {
		res.redirect('/login')
	}
});

router.post('/add', function(req,res){
	var datas = {
		'name' : req.body.name,
		'email' : req.body.email,
		'image' : req.body.image
	}

	connection.query("insert into list set ?",datas,function(err){
		if(err) throw err;
		res.redirect('/adds/listadds')
	})
})

router.get('/listadds',function(req,res){
	if(req.isAuthenticated()){
		console.log("req.user" + JSON.stringify(req.user));
		var un = req.user;
		//console.log("zxj :"+un.name);
		connection.query("select * from list where email = ?",[un.name],function(err,results){
		//console.log("name is >>>>>>>>>>>> :"+ req.user)

		if(err){
			throw err;
		}else{
			var listdata= [];
			for(var i=0;i<results.length;i++){

				var lista = {
					'id' : results[i].id,
					'name' : results[i].name,
					'email' : results[i].email,
					'image' : results[i].image
				}

				listdata.push(lista);
			}
			res.render('listadds',{values:listdata})
			console.log(results);
		}
	})
	} else {
		res.redirect('/login')
	}
	
	
})


router.get('/edit/:id',function(req,res){
	connection.query("select * from list where id ="+req.params.id,function(err,result){
		if(err)
			throw err;
		if(result.length > 0){
			var stud = {
				id : result[0].id,
				name : result[0].name,
				image : result[0].image
			}
			res.render('edit',{stud:stud})
		}
	})

})


router.post('/edit/:id', function(req,res){
	var studuser = {
		name : req.body.name,
		image : req.body.image
	}
	console.log("log id is :"+ req.params.id)
	console.log(studuser)
	connection.query("update list set ?  where id ="+req.params.id,studuser,function(err){
		if(err){
			throw err;
		}
		res.redirect('/adds/listadds');
	})
	
})

router.get('/delete/:id', function(req,res){
	connection.query("delete from list where id = ?",+req.params.id,function(err){
		if(err){
			throw err
		}
		res.redirect('/adds/listadds');
	})
})





module.exports = router;

