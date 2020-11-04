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

	this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){		    
		    socket.on('crearPartida', function(nick,numero) {
		        console.log('usuario nick: '+nick+" crea partida numero: "+numero);
		        var usr=new modelo.Usuario(nick);
				var codigo=juego.crearPartida(num,usr);	
				socket.join(codigo);	        				
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo,"owner":owner} )		        		        
		    });
		    socket.on('unirAPartida',function(nick,codigo){
		    		//nick o codigo nulo 
		    		var res=juego.unirAPartida(codigo,nick);
		    		socket.join(codigo);
		    		var owner=juego.partidas[codigo].owner;
		    		codigo.log("Usuario"+nick);
		    		cli.enviarRemitente(socket,"unidoAPartida",{"codigo":codigo,"owner":owner});
		    		cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",nick);
		    });
		    socket.on('iniciarPartida', function(nick,codigo){
		    	//usr.iniciarPartida(); iniciar partida ToDo
		    	//comprobar si nick es el owner 
		    	//cli.enviarATodos(socket,codigo,"partidaIniciada",fase);
		    });
		    
		});

	}

module.exports.ServidorWS=ServidorWS;