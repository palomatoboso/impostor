function ClienteWS(){
	this.socket=undefined;
	this.nick=undefined;
	this.codigo=undefined;
	this.ini=function(){
		this.socket=io.connect();
		this.lanzarSocketSrv();
	}
	
	this.crearPartida=function(nick,numero){
		this.nick=nick;
		this.socket.emit("crearPartida", nick,numero);//{"nick":nick,"numero":numero}
	}
	this.unirAPartida=function(codigo,nick){
		this.nick=nick;
		this.socket.emit("unirAPartida",codigo, nick);
	}
	this.iniciarPartida=function(){
		this.socket.emit("iniciarPartida",this.codigo,this.nick);
	}
	this.listaPartidasDisponibles=function(){
		this.socket.emit("listaPartidasDisponibles");
	}
	this.listaPartidas=function(){
		this.socket.emit("listaPartidas");
	}
	this.echarVotacion=function(){
		this.socket.emit("echarVotacion",this.codigo,this.nick);
	}
	this.saltarVoto=function(){
		this.socket.emit("saltarVoto",this.codigo,this.nick);
	}
	this.votar=function(sospechoso){
		this.socket.emit("votar",this.codigo,this.nick,sospechoso);
	}
	this.obtenerEncargo=function(){
		this.socket.emit("obtenerEncargo",this.codigo,this.nick);
	}
	this.atacar=function(inocente){
		this.socket.emit("atacar",this.codigo,this.nick,inocente);
	}
	/*this.ini=function(){
		this.socket=io.connect();
		this.lanzarSocketSrv();
	}*/

	//Servidor de WS dentro del cliente
	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect', function(){			
			console.log("conectado al servidor de Ws");
		});

		this.socket.on('partidaCreada', function(data){
			cli.codigo=data.codigo;
			console.log(data);
			//pruebasWS();
		});
		this.socket.on('unidoAPartida', function(data){
			cli.codigo=data.codigo;
			console.log(data);
		});
		this.socket.on('nuevoJugador',function(nick){
			console.log(nick+"se une a la partida");
		});
		this.socket.on('partidaIniciada',function(fase){
			console.log("Partida esta en fase:"+fase);
		});
		this.socket.on('recibirListaPartidasDisponibles',function(lista){
			console.log(lista);
		});
		this.socket.on('recibirListaPartidas',function(lista){
			console.log(lista);
		});
		this.socket.on("votacion"function(data){
			console.log(data);
		});
		this.socket.on("comprobarFinalVotacion",function(data){
			console.log(data);
		});
		this.socket.on("haVotado",function(data){
			console.log(data);
		});
		this.socket.on("recibirEncargo",function(data){
			console.log(data);
		});
		this.socket.on("final",function(data){
			console.log(data);
		});
		this.socket.on("muereInocente",function(data){
			console.log(data);
		});
		
	}

		this.ini();
}
var ws2,ws3,ws4;
function pruebasWS(){
	ws2=new ClienteWS();
	ws3=new ClienteWS();
	ws4=new ClienteWS();
	var codigo=ws.codigo;

	ws2.unirAPartida("palomaT",codigo);
	ws3.unirAPartida("palomaToboso",codigo);
	ws4.unirAPartida("Saiz", codigo);

	//ws.iniciarPartida();
}

function saltarVotos(){
	ws.saltarVoto();
	ws2.saltarVoto();
	ws3.saltarVoto();
	ws4.saltarVoto();
}
function votar(){
	ws.votar("palomaT");
	ws2.votar("palomaT");
	ws3.votar("palomaT");
	ws4.votar("palomaT");
}
function obtenerEncargos(){
	ws.obtenerEncargo();
	ws2.obtenerEncargo();
	ws3.obtenerEncargo();
	ws4.obtenerEncargo();
}