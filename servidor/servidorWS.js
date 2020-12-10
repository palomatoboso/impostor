var modelo=require("./modelo");

function ServidorWS(){

	this.enviarRemitente=function(socket,mens,datos){
		socket.emit(mens,datos);
	}
	this.enviarATodos=function(io,nombre,mens,datos){
		io.sockets.in(nombre).emit(mens,datos);
	}
	this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
		socket.broadcast.to(nombre).emit(mens,datos)
	};
	this.enviarGlobal=function(socket,mensaje,datos){
		socket.broadcast.emit(mensaje,datos);
	};

	this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){		    
			socket.on('crearPartida', function(nick,numero) {
				//var usr=new modelo.Usuario(nick);
				var codigo=juego.crearPartida(numero,nick);	
				socket.join(codigo);	        				
				console.log('usuario nick: '+nick+" crea partida codigo: "+codigo);
				cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo,"owner":nick})
				//enviar a todos los clientes la lista de Partidas
				var lista = juego.listarPartidasDisponibles();  
				cli.enviarGlobal(socket,"recibirListaPartidasDisponibles",lista); 
			});
			socket.on('unirAPartida',function(codigo, nick){
		    		//nick o codigo nulo 
		    		var res=juego.unirAPartida(codigo,nick);
		    		socket.join(codigo);
		    		var owner=juego.partidas[codigo].nickOwner;
		    		console.log('usuario: '+res.nick+" se une a partida: "+res.codigo);
		    		cli.enviarRemitente(socket,"unidoAPartida",res);
				cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",nick);
		    	});

			socket.on('iniciarPartida', function(codigo, nick){
		    	//iniciar partida ToDo
		    	//controlar si nick es el owner
		    	//cli.enviarATodos(socket,codigo,"partidaIniciada",fase);
		    	juego.iniciarPartida(codigo, nick);
		    	var fase=juego.partidas[codigo].fase.nombre;
		    	if(fase=="jugando"){
		    	cli.enviarATodos(io, codigo, "partidaIniciada",fase);
		    	}else{
		    		cli.enviarRemitente(socket,"esperando",fase);
		    	}
		    });
			socket.on('listaPartidasDisponibles', function() {
				var lista = juego.listarPartidasDisponibles();
				cli.enviarRemitente(socket,"recibirListaPartidasDisponibles", lista);     		        
			});
			socket.on('listaPartidas', function() {
				var lista = juego.listarPartidas();
				cli.enviarRemitente(socket,"recibirListaPartidas", lista);     		        
			});
			socket.on('estoyDentro',function(nick,codigo){
				//var usr=juego.obtenerJugador(nick,codigo);
				//var numero=juego.partidas[codigo].usuarios[nick].numJugador;
				//var datos={nick:nick, numJugador:usr.numero};
				//cli.enviarATodosMenosRemitente(socket,codigo,"dibujarRemoto",datos);
				var lista = juego.obtenerListaJugadores(codigo);
				cli.enviarRemitente(socket,"dibujarRemoto",lista);
			});
			socket.on('movimiento',function(datos){
				cli.enviarATodosMenosRemitente(socket,datos.codigo,"moverRemoto",datos);
			});
			

			socket.on("echarVotacion",function(codigo, nick){
				juego.lanzarVotacion(codigo, nick);
				var fase=juego.partidas[codigo].fase.nombre;
				cli.enviarATodos(io,codigo,"votacion",fase);
			});

			socket.on("saltarVoto",function(codigo,nick){
				var partida=juego.partidas[codigo];
				juego.saltarVoto(codigo, nick);
				if (partida.hanVotadoTodos()){
					var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
					cli.enviarATodos(io,codigo,"finalVotacion",data);
				}else{
					cli.enviarATodos(io,codigo,"haVotacion",partida.listaHanVotado());
				}
				
			});

			socket.on("votar",function(codigo,nick,sospechoso){
				var partida=juego.partidas[codigo];
				juego.votar(codigo,nick,sospechoso);
				if (partida.todosHanVotado()){
					var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
					cli.enviarATodos(io, codigo,"finalVotacion",data);	
				}
				else{
					cli.enviarATodos(io, codigo,"haVotado",partida.listaHanVotado());		    	
				}
			});

			socket.on("obtenerEncargo",function(codigo,nick){
				cli.enviarRemitente(socket,"recibirEncargo",juego.obtenerEncargo(codigo, nick));
			});

			
			socket.on("atacar",function(codigo, nick,atacado){
				juego.atacar(codigo,nick,atacado);
				var partida=juego.partidas[codigo];
				if (partida.fase.nombre == "final"){
					var data={"Fase":partida.fase.nombre,"Ganadores":partida.fase.ganadores};
					cli.enviarATodos(io,codigo,"final",data);
				}else{
					//avisar al inocente
					cli.enviarRemitente(socket,"muereInocente", partida.fase.nombre);
				}

		});
			socket.on('listarParticipantes', function(codigo) {
				var lista = juego.listarParticipantes(codigo);
				cli.enviarRemitente(socket,"recibirListaParticipantes", lista);     		        
			});
	});

}


}
module.exports.ServidorWS=ServidorWS;