var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

//encryption and description
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

// database 
var connection = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/adds');
var superadmin = require('./routes/super-admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// passport

var passport = require('passport')
var passportLocal = require('passport-local')
var expressSession = require('express-session')

app.use(expressSession({
	secret:'secret',
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


// strategy
passport.use(new passportLocal.Strategy(function(username, password, done) {
   	console.log("inside Strategy" + username +" "+ password);

   	connection.query("select * from registeration where email = ?",[username],function(err,results){
    if(err){
      console.log("err is :"+err);
    }
    else{
      if(results.length > 0){
        console.log(password+" "+cryptr.encrypt(password)+" --- "+cryptr.decrypt(cryptr.encrypt("password")))
        if(password == cryptr.decrypt(results[0].password)){
          
              done(null, {id: username, name:username});
            } else {
              done(null, null);
            }  
        }
      else{
        console.log("username is not found on the list");
      }
    }

  })

 }
));


passport.serializeUser(function(user, done) {
  console.log('inside serializeUser');
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  console.log('inside deserializeUser' + id);
  done(null, {id:id,name:id});
});

// end passport

app.get('/', function(req,res){
	if(req.isAuthenticated()){
		console.log("req.user" + JSON.stringify(req.user));
		res.render('home',{user:req.user})
	} else {
		res.redirect('/login')
	}
});


app.get('/login',function(req,res){
	if(req.isAuthenticated()){
		res.redirect('/')
	}else{
		res.render('login')
	}
})

app.post('/login', passport.authenticate('local'), function(req,res){
	console.log("req.isAuthenticated() " + req.isAuthenticated());

	if(req.isAuthenticated()){
		console.log("req.user" + JSON.stringify(req.user));
		res.render('home', {user:req.user})
	} else {
		res.redirect('/login')
	}
})





// registeration start

app.get('/register', function(req,res){
	res.render('register');
})

app.post('/register', function(req,res){

	var encryptedString = cryptr.encrypt(req.body.password);
	var user = {
		'name' : req.body.name,
		'email' : req.body.email,
		'password' : encryptedString,
		'confirmpassword' : req.body.conpassword,
		'phone' : req.body.phone
	};

	// validation fields
	console.log("length " + user.name.length)
	if(user.name == ''){
		res.render('register',{msg:'name should be manditory field'})
	}

	if(user.password == ''){
		res.render('register',{msg:'password should be manditory and minimum 8 charfield'})
	}

	if(user.email == ''){
		res.render('register',{msg:'email should be manditory field'})
	}

	if(user.phone == ''){
		res.render('register',{msg:'phone should be manditory field'})
	}

	var decryptedString = cryptr.decrypt(user.password);

	if(decryptedString == req.body.conpassword){
		
		console.log(user);
		connection.query("insert into registeration set ?",user,function(err){
			if(err){
				throw err;
			}else{
				console.log("1 row added");
				res.redirect('/login');
			}

		})

	}else{
		console.log("not match");
		res.render('register',{msg:'does not match passwords'})
	}
	
	
})

// registeration end

//logout start

app.get('/logout',function(req,res){
	req.session.destroy(function(err){
		if(err){
			throw err;
		}
		console.log('destroy the session');
		res.redirect('/login')
	});
})

//logout end

app.use('/', indexRouter);
app.use('/adds', usersRouter);
app.use('/super-admin', superadmin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
