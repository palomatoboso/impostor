var fs = require("fs");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var io = require('socket.io').listen(server);

var modelo=require("./servidor/modelo.js")
var wss=require("./servidor/servidorWS.js");


var servidorWS=new wss.ServidorWS();

var min=process.argv.slice(2);
//var test=process.argv.slice(3);

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var juego=new modelo.Juego(min);//añadir parametro test

app.get('/', function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html"); 
    
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
    
});

app.get('/game', function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index-game.html"); 
    
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
    
});
app.get('/nuevoUsuario/:nick',function (request,response){

});

app.get('/crearPartida/:nick/:num',function(request,response){
	var nick=request.params.nick;
	var num=parseInt(request.params.num);
	//ojo, nick nulo o numero nulo
	//var num=4;
	//var usr=new modelo.Usuario(nick);
	var codigo=juego.crearPartida(num,nick);

	response.send({"codigo":codigo});
});

app.get ('/unirAPartida/:codigo/:nick',function(request,response){
var nick=request.params.nick;
var codigo=request.params.codigo;
var res=juego.unirAPartida(codigo,nick);
response.send({"res":res}); 
});

app.get('/listaPartidasDisponibles',function(request,response){
	var lista=juego.listaPartidasDisponibles();
	response.send(lista);
});

app.get('/listaPartidas',function(request,response){
	var lista=juego.listaPartidas();
	response.send(lista);
});

app.get("/partidasCreadas/:admin", function (request,response){
	var admin=request.params.admin;
	juego.partidasCreadas(admin,function(lista){
		response.send(lista);
	})
});

//app.get("/partidasFinalizadas/:admin")

server.listen(app.get('port'), function(){
    console.log('Node esta ecuchando en el puerto', app.get('port'));
});

// app.listen(app.get('port'), function () {
//      console.log('Node app is running on port', app.get('port'));
// });

servidorWS.lanzarSocketSrv(io,juego);