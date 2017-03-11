var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var oddhold;
var pairs = {};
var loose;
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	if(loose){
		pairs[loose]=socket.id;
		pairs[socket.id]=loose;
		loose=null;
	}else{loose=socket.id;}

	console.log(socket.id);

	socket.on('disconnect', function(){
		console.log('user disconnected');

		io.to(pairs[socket.id]).emit('chat message', 'user disconnected, findingg new');	
		if(loose){
			pairs[loose]=pairs[socket.id];
			pairs[pairs[socket.id]]=loose;
			loose=null;
		}else{loose=pairs[socket.id];
			pairs[pairs[socket.id]]=null;
		}

		pairs[socket.id]=null;
	});
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		if(pairs[socket.id]){
			io.to(pairs[socket.id]).emit('chat message', msg);
		}else{

			if(loose){
				pairs[loose]=socket.id;
				pairs[socket.id]=loose;
				loose=null;
			}else{loose=socket.id;}


			console.log('failed to send, no partner');

		}
	});

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

