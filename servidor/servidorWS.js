var modelo=require("./modelo.js");

function ServidorWS(){

		this.enviarRemitente=function(socket,mens,datos){
			socket.emit(mens,datos);
		}
		this.enviarATodos=function(io,nombre,mens,datos){
			io.sockets.in(nombre).emit(mens,datos);
		}
		this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
			socket.broadcast.to(nombre).emit(mens,datos)
		}
		this.enviarGlobal=function(socket,mens,datos){
			socket.broadcast.emit(mens,datos);
		}


		this.lanzarSocketSrv=function(io,juego){
			var cli=this;
			io.on('connection',function(socket){
				socket.on('crearPartida', function(nick,numero) {
					//var usr=new modelo.Usuario(nick);
					var codigo=juego.crearPartida(numero,nick);	
					socket.join(codigo);	        				
					console.log('usuario nick: '+nick+" crea partida codigo: "+codigo);
					cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo,"owner":nick});
					//enviar a todos los clientes la lista de Partidas
					var lista = juego.listarPartidasDisponibles();  
					cli.enviarGlobal(socket,"recibirListaPartidasDisponibles",lista); 
				});
				socket.on('unirAPartida',function(codigo, nick){
						//console.log(codigo);
						//console.log(juego.partidas);
			    		var res=juego.unirAPartida(codigo,nick);
						socket.join(codigo);
						//console.log(juego.partidas);
						//var owner= juego.partidas[codigo].nickOwner;
						console.log('el usuario: '+nick+" se une a partida: "+codigo);
						cli.enviarRemitente(socket,"unidoAPartida",res);
						//var lista=juego.obtenerListaJugadores(codigo);
						//cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",nick);
						var lista = juego.listarPartidasDisponibles();
						//cli.enviarGlobal(socket,"recibirListaParticipantes",lista);
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
					var lista = juego.listaPartidas();
					cli.enviarRemitente(socket,"recibirListaPartidas", lista);     		        
				});

				socket.on('listaJugadores', function(codigo) {
		                var lista = juego.listaJugadores(codigo);
		                cli.enviarRemitente(socket, "recibirListaJugadores", lista);
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
					var puedeIniciarVotacion= juego.echarVotacion(codigo, nick);
					/*
					var partida=juego.partidas[codigo];
					juego.echarVotacion(codigo, nick);
					var lista= partida.obtenerListaJugadores();
					cli.enviarATodos(io,codigo,"votacion",lista);
					*/
					var fase=juego.partidas[codigo].fase.nombre;
					if(fase == "votacion") {

                    var partida = juego.partidas[codigo];
                    var lista = partida.obtenerListaJugadoresVivos();
                    cli.enviarATodos(io, codigo, 'echarVotacion', lista);
               		 }
				});

				socket.on("saltarVoto",function(codigo,nick){
					var partida=juego.partidas[codigo];
					juego.saltarVoto(codigo, nick);
					if (partida.todosHanVotado()){
						var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
						cli.enviarATodos(io,codigo,"finalVotacion",data);
					}else{
						cli.enviarATodos(io,codigo,"haVotado",partida.listaHanVotado());
					}
					
				});
				

				socket.on("votar",function(codigo,nick,sospechoso){
					var partida=juego.partidas[codigo];
					juego.votar(codigo,nick,sospechoso);
					if (partida.todosHanVotado()){
		                var elegido=partida.elegido; // elegido es un obj Usuario		                    
						var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
						cli.enviarATodos(io, codigo,"finalVotacion",data);	
					}
					else{
						cli.enviarATodos(io, codigo,"haVotado",partida.listaHanVotado());		    	
					}
				});

				socket.on("obtenerEncargo",function(codigo,nick){
					var res=juego.obtenerEncargo(codigo,nick);
					console.log(codigo+" "+nick);
					cli.enviarRemitente(socket,"recibirEncargo",res);
					//cli.enviarRemitente(socket,"recibirEncargo",res);
				});

				
				socket.on("atacar",function(codigo, nick,atacado){
					juego.atacar(codigo,nick,atacado);
					var partida=juego.partidas[codigo];
					var fase= partida.fase.nombre;
					cli.enviarATodos(io,codigo,"muereInocente",atacado);
					cli.enviarRemitente(socket,"hasAtacado",partida.fase.nombre);
					if (partida.fase.nombre== "final"){
						var data={"Fase":partida.fase.nombre,"Ganadores":partida.fase.ganadores};
						cli.enviarATodos(io,codigo,"final",data);
					}

				});
				socket.on('listarParticipantes', function(codigo) {
					var lista = juego.listarParticipantes(codigo);
					cli.enviarRemitente(socket,"recibirListaParticipantes", lista);     		        
				});
				socket.on('estoyDentro', function(nick,codigo) {
					//var usr=juego.obtenerJugador(nick,codigo);
					// var numero=juego.partidas[codigo].usuarios[nick].numJugador;
					// var datos = {nick:nick,numJugador:numero};
					// cli.enviarATodosMenosRemitente(socket,codigo,"dibujarRemoto",datos); 
					var lista = juego.obtenerListaJugadores(codigo);
					cli.enviarRemitente(socket,"dibujarRemoto", lista);       
				});

				socket.on('abandonarPartida', function(codigo, nick){
					var partida = juego.partidas[codigo];
					if(partida){
						var resul= juego.abandonarPartida(codigo, nick);
						//var finalPartida = resul.finalPartida;
						//var datos={finalPartida:resul.finalPartida, nick:nick};
						var fase = juego.partidas[codigo].fase.nombre;
						cli.enviarATodos(io, codigo, "jugadorAbandonaPartida");

						if(fase=="final"){
							var jM= "El jugador" + nick + "abandona la partida";
							cli.enviarATodos(io, codigo, "final");
							juego.eliminarPartida(codigo);

							var lista=juego.listarPartidasDisponibles();
							cli.enviarGlobal(socket, "recibirListaPartidasDisponibles", lista);

						}
						else {
								socket.join(codigo);
						}

					}

				});

				socket.on('movimiento', function( nick,codigo, numJugador,direccion, x,y) {
					var datos ={direccion:direccion, nick:nick,numJugador:numJugador,x:x,y:y};
					cli.enviarATodosMenosRemitente(socket,codigo,"moverRemoto",datos);
				});

				socket.on('realizarTarea',function(datos){
					res = juego.realizarTarea(datos);
					var nick= datos.nick;
					var codigo=datos.codigo;
					var partida = juego.partidas[codigo];
					var percent = partida.obtenerPercentTarea(nick);
					var global= partida.obtenerPercentGlobal();

					var partida=juego.partidas[codigo];
					//var fasePartida = juego.getEstadoPartida(codigo); // el objeto
                	var estadoTarea = juego.obtenerEstadoTarea(nick, codigo);

					//cli.enviarRemitente(socket, "tareaRealizada", {"percent": percent, "global": global, "estadoTarea":estadoTarea});

					if (partida.fase.nombre == "final"){
						var data={"Fase":partida.fase.nombre,"Ganadores":partida.fase.ganadores};
						cli.enviarATodos(io,codigo,"final",data);
					}
					//porcentaje 
					//percentGlobal = juego.obtenerPercentGlobal(codigo);
					//percentLocal = juego.obtenerPercentTarea(codigo, nick);
					//var datos = {percentGlobal:percentGlobal, percentLocal:percentLocal}
					//cli.enviarRemitente(socket,"realizandoTarea", datos);
			});

		});
	}

}

module.exports.ServidorWS=ServidorWS;