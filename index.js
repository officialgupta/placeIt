var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var oddhold;
var pairs = {};
var loose;

var a = 0;
var path = require('path')
var express = require('express')
var place = {};
app.use(express.static('public'))


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	if(loose){
		pairs[loose]=socket.id;
		pairs[socket.id]=loose;
		io.to(loose).emit('chat message', 'you\'re connected!');
		loose=null;
		
	}else{loose=socket.id;
	
		io.to(loose).emit('chat message', 'you\'re not paired up yet, we\'ll find you a partner asap!');
	}

	console.log(socket.id);

	socket.on('disconnect', function(){
		console.log('user disconnected');

		io.to(pairs[socket.id]).emit('chat message', 'user disconnected, finding new partner');	
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
		a = msg.replace(/[^0-9\.\-]+/g,",").split(',').filter(Boolean).map(Number);
		console.log(a);
		console.log(place[socket.id][0]);
	if(a){if (a[0]<=place[socket.id][0]+0.5 && a[0]>= place[socket.id][0]-0.5){
	if (a[1]<=place[socket.id][1]+0.5 && a[1]>= place[socket.id][1]-0.5){
					io.to(pairs[socket.id]).emit('chat message', 'Yeah! u win!');
			io.to(socket.id).emit('chat message', 'Yeah! u win!');}}
	}
		console.log('message: ' + msg);
		if(pairs[socket.id]){
			io.to(pairs[socket.id]).emit('chat message', msg.replace(place[socket.id][2],'***'));
			io.to(socket.id).emit('chat message', msg.replace(place[socket.id][2],'***'));
		}else{

			if(loose!=socket.id){
				pairs[loose]=socket.id;
				pairs[socket.id]=loose;
				loose=null;
			}else{loose=socket.id;}

			io.to(socket.id).emit('chat message','You don\'t have a partner! wait for someone to connect!')
			console.log('failed to send, no partner');

		}
	});



socket.on('location', function(msg){
		console.log('got location: ' + msg);
	place[socket.id]=msg;
io.to(socket.id).emit('chat message', 'your partner must find the coordinates of ' + msg[2]);


});
});

http.listen((process.env.PORT || 3000), function(){
	console.log('listening on *:3000');
});

