var http = require('http');
var express = require('express');
var app = express();
var ent = require('ent');
var join = require('path').join;

var server = http.createServer(app);
var io = require('socket.io').listen(server);

// Serve statics files
app.use('/assets',express.static('assets'));
app.use('/images',express.static('images'));

//Routes
app.get("/", function(req, res){
		res.sendFile(join(__dirname, 'index.html'));
});
app.get("/forum", function(req, res){
	res.sendFile(join(__dirname, 'forum.html'))
});

io.sockets.on('connection', (socket) =>{
	console.log('Nouvelle connexion ');
	socket.on('message_chat', function(msg){
		msg = ent.encode(msg);
		console.log('Message received: '+msg);
		//io.emit('message_chat', {pseudo: socket.pseudo, message: msg});

		//On envoie le message a tout le monde sauf #nous
		socket.broadcast.emit('message_chat', {pseudo: socket.pseudo, message: msg});
	});
	socket.on('send_pseudo', function(pseudo){
		socket.pseudo = pseudo;
		socket.broadcast.emit('message_info', socket.pseudo+' vient de se connecter !');
	});
	socket.emit('message_info', 'Vous êtes bien connecté !');
	socket.on('disconnect', function(){
		console.log("Un utilisateur s'est deconnecté !");
		socket.broadcast.emit('message_info', socket.pseudo+ " s\'est deconnecté !" );
	})
});

	server.listen(8000, ()=>{ console.log("Server is runing at  8000")});
