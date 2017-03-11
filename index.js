var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var a = 0;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	a+=1;
	console.log('a user connected'+a);	
	socket.on('disconnect', function(){
		a-=1;
		console.log('user disconnected'+a);
	});
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
    io.emit('chat message', msg);
	});

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

