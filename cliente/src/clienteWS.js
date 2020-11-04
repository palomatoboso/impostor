function ClienteWS(){
	this.socket;
	this.crearPartida=function(nick,numero){
		this.socket.emit("crearPartida", nick,numero);//{"nick":}
	}
	this.unirAPartida=function(nick,codigo){
		this.socket.emit("unirAPartida", nick,codigo);//{"nick":}
	}
	this.iniciarPartida=function(nick,codigo){
		this.socket.emit("iniciarPartida",nick,codigo);
	}
	this.ini=function(){
		this.socket=io.connect();
		this.lanzarSocketSrv();
	}
	//Servidor de WS dentro del cliente
	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect', function(){			
			console.log("conectado al servidor de Ws");
		});

		this.socket.on('partidaCreada', function(codigo){
			console.log(data);
		});
		this.socket.on('unidoAPartida', function(data){
			console.log(data);
		});
		this.socket.on('nuevoJugador',function(nick){
			console.log(nick+"se une a la partida");
		});
		this.socket.on('partidaIniciada',function(fase){
			console.log("Partida esta en fase:"+fase);
		});

		}

		this.ini();
	}
	

