var express = require('express');
var router = express.Router();
var connection = require('.././config');
var handle = require('./handler');



router.get('/',function(req,res,next){
	res.render('superadmin/login');
})

router.post('/login',function(req,res){


	var table = "adminrole";
	var data = req.body.name;

	handle.loginsuccess(table,data,function(err,result){
		if(err){
			throw err;
		}else{
			if(result.length > 0){
				if(req.body.password == result[0].password){
					res.redirect('/super-admin/home')
				}else{
					res.render("superadmin/login",{title:"super-admin",msg:"password is wrong"});
				}
			}else{
				res.render("superadmin/login",{title:"super-admin",msg:"user is wrong"});
			}
		}
	})

	/* connection.query("select * from adminrole where name = ?",req.body.name,function(err,result){
		if(err){
			throw err;
		}else{
			if(result.length > 0){
				if(req.body.password == result[0].password){
					res.redirect('/super-admin/home')
				}else{
					res.render("superadmin/login",{title:"super-admin",msg:"password is wrong"});
				}
			}else{
				res.render("superadmin/login",{title:"super-admin",msg:"user is wrong"});
			}
		}
		
	}) */



	//if(req.body.name == req.body.password){
	//	res.send("login success");
	//}else{
	//	res.send("not login");
	//}
})


router.get('/home',function(req,res,next){
	res.render('superadmin/home');
})

router.get('/users',function(req,res,next){
	
	var table = "registeration"

	handle.userslist(table,function(err,result){
		if(err){
			throw err
		}else{
			var userlist = [];
			for(var i=0; i<result.length; i++){
				var user = {
					id : result[i].id,
					name : result[i].name,
					email : result[i].email,
					password : result[i].password,
					phone : result[i].phone
				}

				userlist.push(user);
			}

			res.render('superadmin/users',{userlist:userlist});

		}

	})

})



router.get('/lists',function(req,res,next){
	var table = "list"

	handle.tragetlist(table,function(err,result){
		if(err){
			throw err
		}
		else{
			var userlist = [];
			for(var i=0; i<result.length; i++){
				var user = {
					id : result[i].id,
					name : result[i].name,
					image : result[i].image,
					email : result[i].email
				}
				userlist.push(user)
			}
			res.render('superadmin/tragetlist',{userlist:userlist})
			
		}
	})
})






module.exports = router;