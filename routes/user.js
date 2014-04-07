var r = require('rethinkdb');
var crypto = require('crypto');

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.login = function(req, res){
	var brukernavn = req.body.brukernavn;
	var passord = req.body.passord;
	var hash = crypto.createHash('sha256').update(passord).digest('base64');	
	console.log(hash);

	r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    	if (err) throw err;
    	connection = conn;

    	r.db("enapp").table("user").filter({name: brukernavn, password: hash}).run(conn, function(err, cursor){
    		if (err) throw err;

    		cursor.toArray(function(err, result){
    			if(result.length == 0){
    				res.render("login", {msg: "Brukeren finnes ikke."})
    			}
    			else{
    				console.log(brukernavn);
    				req.session.user = brukernavn;
    				res.redirect("/menu");
    				//res.render("menu");
    			}
    		});
    	});
    });
};

exports.showmenu = function(req, res){
	if(req.session.user == null){
		res.redirect("/");		
	}
	else{
		r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    		if (err) throw err;
    		connection = conn;

    		r.db("enapp").table("user").run(conn, function(err, cursor){
    			if (err) throw err;
    			cursor.toArray(function(err, result){
    				res.render("menu", {res: result});
    			});
    		});
    	});
	}
}