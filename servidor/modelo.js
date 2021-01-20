//var cad=require('./cad.js');

///////////////////FUNCION JUEGO ////////////
function Juego(min){ //añadir el parametro test
	this.min=min;
	this.max=10;
	this.partidas={};
	//this.cad=new cad.Cad();
	this.numeroValido=function(num) {
		return num >= this.min && num<= this.max;
	}
	this.crearPartida=function(num,owner){
		let codigo="fallo";
		if(!this.partidas[codigo] && this.numeroValido(num)){
			if (!this.partidas[codigo] && this.numeroValido(num)){
					codigo=this.obtenerCodigo();
					this.partidas[codigo]=new Partida(num,owner,codigo,this);
					var fase=this.partidas[codigo].fase.nombre;
					//this.cad.insertarPartida({"codigo":codigo,"nick":owner,"numeroJugadores":num,"fase":fase}, function(res){})
			}
			else{
			console.log("acabas de superar el limite de participantes, lo siento ");
			}

		}
			return codigo;
	}
	this.unirAPartida=function(codigo,nick){
		var nickJugador= "fallo";
		
		//console.log(codigo+" "+nick);
		if(this.partidas[codigo]){
			//console.log(codigo+" "+nick);
			nickJugador=this.partidas[codigo].agregarUsuario(nick);
		}
		console.log(nickJugador);
		return nickJugador;
	}

	this.iniciarPartida=function(codigo, nick){
			var owner=this.partidas[codigo].nickOwner;
			if(nick==owner){
				this.partidas[codigo].iniciarPartida();
			}
	}

	this.eliminarPartida=function(codigo){
		delete this.partidas[codigo];
	}

	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}
	 this.obtenerCodigoDePartida = function(partidas, p) {
        return Object.keys(partidas).find(codigo => partidas[codigo] === p);
    }

	/*this.obtenerOwner = function(codigo) {
        let owner = "fallo";

        if(codigo != undefined && this.partidas[codigo]) {
            owner = this.partidas[codigo].nickOwner;
        }

        return owner;
    }*/
	this.listarPartidasDisponibles=function(){
			var lista = [];
			var huecos = 0;
			var maximo=0;
			var owner="";
			for (var key in this.partidas){
				let partida = this.partidas[key];
				huecos=partida.obtenerHuecos();
				owner=partida.nickOwner;
				let maximo = partida.maximo;
				if(huecos>0){
					lista.push({"codigo":key,"huecos":huecos,"maximo":maximo,"owner":owner})
				}
			}
			return lista;
	}
	this.echarVotacion=function(codigo, nick){
		var usr=this.partidas[codigo].usuarios[nick];
		this.reiniciarContadores(codigo);
		usr.echarVotacion();
	}

	this.listaPartidas=function(){
		let lista=[];
		let huecos=0;
		for(var key in this.partidas){
			let partida=this.partidas[key];
			let owner=this.partidas[key].nickOwner;
					lista.push({"codigo":key,"owner":owner})
				}
				return lista;
	}
	this.saltarVoto=function(codigo, nick){
			var usr=this.partidas[codigo].usuarios[nick];
			usr.skipear();
		}

	this.votar=function(codigo, nick, sospechoso){
			var usr=this.partidas[codigo].usuarios[nick];
			//usr=this.partida[codigo].obtenerUsuario(nick);
			usr.votar(sospechoso);
	}
	this.obtenerEncargo=function(codigo,nick){
			var res={};
			var encargo=this.partidas[codigo].usuarios[nick].encargo;
			var impostor=this.partidas[codigo].usuarios[nick].impostor;
			res={"encargo":encargo,"impostor":impostor};
			return res;
	}

	this.reiniciarContadores=function(codigo){
			if(this.partidas[codigo])
			this.partidas[codigo].reiniciarContadores();
	}

	this.atacar=function(codigo, nick, atacado){
			var usr=this.partidas[codigo].usuarios[nick];
			//usr=this.partida[codigo].obtenerUsuario(nick);
			usr.atacar(atacado);
	}
	this.listarParticipantes=function(codigo){
		var lista = [];
		var partida = this.partidas[codigo];
		 if (partida){
			lista = partida.devolverNicks();
		}
		return lista
	}
	this.obtenerListaJugadores=function(codigo){
		return this.partidas[codigo].obtenerListaJugadores();
	}

	this.realizarTarea=function(datos){
		let nick= datos.nick;
		let codigo = datos.codigo;

		let partida=this.partidas[codigo];
		partida.realizarTarea(nick);
		/*
		this.partidas[codigo].realizarTarea(nick);
		realizado = this.partidas[codigo].usuarios[nick].realizado;
		estadoRealizado = this.partidas[codigo].usuarios[nick].estadoRealizado;
		encargo = this.partidas[codigo].usuarios[nick].realizado;
		res={"encargo":encargo, "realizado":realizado, "estadoRealizado":estadoRealizado};
		return res;*/
	}

	this.obtenerEstadoTarea = function(nick, codigo) {
        return this.partidas[codigo].usuarios[nick].estadoTarea;
    }
	/*this.obtenerPercentTarea=function(codigo, nick){
		return this.partidas[codigo].usuarios[nick].obtenerPercentTarea(nick);
	}

	this.obtenerPercentGlobal=function(codigo){
		return this.partidas[codigo].obtenerPercentGlobal();
	}*/

	/*this.partidasCreadas=function(admin, callback){
		if(admin=="1234"){
			this.cad.obtenerPartidaCriterio({fase:"inicial"},function(lista){
				if(lista){
				callback(lista);
				}else{
						callback();
				}
			}
		}
	}*/

	/*
	this.insertarPartida=function(){
	
	}

	if(test=="noTest"){
		this.cad.connect(function(db){
			console.log("conectado a Atlas");
		})
	}*/

	this.abandonarPartida= function(codigo, nick){
		let partida = this.partidas[codigo];
		if(partida){
			 partida.usuarios[nick].abandonarPartida();
		}
	}

		
}


///////////////////FUNCION PARTIDAS ////////////
function Partida(num,owner,codigo, juego){
	this.juego=juego;
	this.maximo=num;
	this.nickOwner=owner;
	this.codigo=codigo;
	this.fase=new Inicial();
	this.usuarios={};
	this.elegido="no hay nadie elegido";
	this.encargos=["jardines","calles","mobiliario","basuras"];
	this.agregarUsuario=function(nick){
		return this.fase.agregarUsuario(nick,this)
	}
	this.puedeAgregarUsuario=function(nick){
		let nuevo=nick;
		let contador=1;
		while(this.usuarios[nuevo]){
			nuevo=nick+contador;
			contador=contador+1;
		}
		this.usuarios[nuevo]=new Usuario(nuevo);
		this.usuarios[nuevo].partida = this;
		var numero = this.numJugadores() - 1;
		this.usuarios[nuevo].numJugador = numero;
		if(this.comprobarMinimo()){
			this.fase=new Completado();
		}
		
		return {"codigo":this.codigo,"nick":nuevo,"numJugador":numero};
		

	}
	this.obtenerUsuarios=function(nick){
		return this.usuarios[nick]
	}

	this.numJugadores=function(){
		return Object.keys(this.usuarios).length
	}

	this.comprobarMinimo=function() {
		return Object.keys(this.usuarios).length >= this.juego.min;
	}

	this.comprobarMaximo=function() {
		return Object.keys(this.usuarios).length < this.maximo;
	}
	this.obtenerListaJugadores=function(){
		var lista=[];
		for (var key in this.usuarios){
			var numero = this.usuarios[key].numJugador;
			lista.push({"nick":key, "numJugador":numero});
		}
		return lista;//Objetc.key(this.usuarios);
	}
	this.obtenerHuecos=function(){
		return this.maximo - Object.keys(this.usuarios).length
	}
	this.numJugadores=function(){
		return Object.keys(this.usuarios).length
	}

	this.comprobarMinimo=function(){
		return Object.keys(this.usuarios).length>=4
	}
	this.comprobarMaximo=function(){
		return Object.keys(this.usuarios).length<this.maximo
	}
	this.iniciarPartida=function(){
		this.fase.iniciarPartida(this);
	}
	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}
	this.puedeAbandonarPartida=function(nick){
		let resul={};
		this.eliminarUsuario(nick);
		if (!this.comprobarMinimo()){
			this.fase=new Inicial();
		}
		if (this.numJugadores()<=0){
			this.juego.eliminarPartida(this.codigo);
			
		}

	
		return {nick:nick};
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.puedeIniciarPartida=function() {
		this.asignarEncargos();
		this.asignarImpostor();
		this.fase=new Jugando();
	}
	this.asignarEncargos=function(){
		i=0;
		for(var usr in this.usuarios){
			this.usuarios[usr].encargo=this.encargos[i];
			i=(i+1)%(this.encargos.length);

		}
	}
	this.asignarImpostor=function(){
		this.nicks=Object.keys(this.usuarios);
	this.usuarios[this.nicks[randomInt(0,this.nicks.length)]].asignarImpostor();
	}
	this.atacar=function(nick){
		if(this.usuarios[nick]){
			this.fase.atacar(nick,this);
		}else{
			console.log("ese usuario no existe");
		}
		
	}

	this.puedeAtacar=function(nick){
		this.usuarios[nick].esAtacado();
		/*let resul= this.comprobarFinal();
		resul.finPartidaCiudadanos();
		if(finPartidaCiudadanos){
			console.log("La partida ha terminado");
		}*/

		
	}
	this.numCiudadanos=function(){
		var i = 0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == false){
				i++;
			}
		}
		return i
	}
	this.numCiudadanosVivos=function(){
		var i = 0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == false && this.usuarios[usr].estadoVivo()){
				i++;
			}
		}
		return i
	}

	this.numImpostoresVivos=function(){
		var i=0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estadoVivo()){
				i++;
			}
		}
		return i
	}
	this.localizarImpostor=function(){
		var i=0;
		var impostor;
		for(var usr in this.usuarios){
				if (this.usuarios[usr].impostor == true && this.usuarios[usr].estadoVivo()){
						impostor = this.usuarios[usr];
				}
		}
		return impostor
	}
	this.devolverCiudadanosVivos=function(){
		var i=0;
		var ciudadanos = [];
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == false && this.usuarios[usr].estadoVivo()){
				ciudadanos[i] = this.usuarios[usr];
				i++;
			}
		}
		return ciudadanos
	}

	this.votar=function(sospechoso) {
		this.fase.votar(sospechoso,this);
	}
	this.puedeVotar=function(sospechoso) {
		this.usuarios[sospechoso].esVotado();
		this.comprobarVotacion();
	}
	this.jugadorMasVotado=function(){
		var votos = 0;
		var masVotado="No hay nadie mas votado";
		for(var usr in this.usuarios){
			if (this.usuarios[usr].votos > votos && this.usuarios[usr].estadoVivo()){
				votos = this.usuarios[usr].votos;
				masVotado = this.usuarios[usr];
			}
		}
		//comproar que solo hay 1 mas 
		return masVotado
	}
	this.eliminarAlMasVotado=function(){
		this.fase.eliminarAlMasVotado(this);
	}
	this.puedeEliminarMasVotado=function(){
		this.comprobarVotacion();
	}
	this.iniciarVotacion=function(){
		this.fase.iniciarVotacion(this);
	}

	this.puedeIniciarVotacion=function(){
		this.fase = new Votacion();
	}


	this.listaHanVotado=function(){
		var lista=[];
		for(var key in this.usuarios){
			//if (this.usuarios[key].estado.nombre=="vivo"&& this.)
			lista.push(key);
		}

		return lista;
	}

	this.reiniciarContadores=function(){
		this.elegido="No hay nadie elegido"
		for(var usr in this.usuarios){
			if (this.usuarios[usr].estadoVivo()){
				this.usuarios[usr].skip = false;
				this.usuarios[usr].votos = 0;
				this.usuarios[usr].haVotado = false;
			}
		}
	}
	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			this.finPartidaImpostores();
		}
		else if (this.gananCiudadanos()){
			this.finPartidaCiudadanos();
		}
		else{
			this.fase = new Jugando();
		}
	}
	this.comprobarVotacion=function(){
		if (this.todosHanVotado()){
			let elegido=this.jugadorMasVotado();
			if (elegido && elegido.votos>this.numeroSkips()){
				this.elegido=elegido.nick;
				elegido.esAtacado();
				//this.puedeAtacar(elegido.nick);
			}
			this.finalVotacion();
		}
	}
	this.finalVotacion=function(){
		this.fase=new Jugando();
		this.comprobarFinal();
	}

	this.numImpostoresVivos=function(){
		var i=0;
		for (var usr in this.usuarios) {
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estado.nombre=="vivo"){
				i++;
			}
		}
		return i;
	}
	this.gananImpostores=function(){
		return this.numImpostoresVivos() >= this.numCiudadanosVivos()
		//(en caso cierto: cambiar fase a Final)
	}
	this.gananCiudadanos=function(){
		return this.numImpostoresVivos() == 0
		//comprobar que numero impostores vivos es 0
	}
	this.masVotado=function(){
		let votado="no hay nadie mas votado";
		//faltan cosas
	}
	this.numeroSkips=function(){
		//numero de usuarios que han hecho skip
		//recorre usuarios vivos, incrementar contador si skip de ese 
		//usuario es true.
		var i = 0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].skip == true && this.usuarios[usr].estadoVivo()){
				i++;
			}
		}
		return i
	}

	
	this.finPartidaImpostores=function(){
		this.fase = new Final();
		this.fase.ganadores = "impostores";
	}
	this.finPartidaCiudadanos=function(){
		this.fase = new Final();
		this.fase.ganadores = "ciudadanos";
	}

	this.devolverPartidasLibres=function(){
		this.fase.devolverPartidasLibres(this);
	}
	this.puedeDevolverPartidasLibres=function(){
		if(this.obtenerHuecos() > 0){
			return this
		}
	}
	this.todosHanVotado=function(){
		let res=true;
		for(var key in this.usuarios){
			if(this.usuarios[key].estadoVivo() && !this.usuarios[key].haVotado){
				res=false;
				break;
			}
		}
		return res;
	}
	this.listaHanVotado=function(){
		var lista=[];
		for(var key in this.usuarios){
			if(this.usuarios[key].estadoVivo() && this.usuarios[key].haVotado){
				lista.push(key);
			}
		}
		return lista;
	}
	this.devolverNicks=function(){
		var lista=[];
		for(var key in this.usuarios){
			lista.push({"nick":key});
		}
		return lista;
	}
	this.obtenerListaJugadoresVivos=function(){
		var lista=[]
		for(var key in this.usuarios){
			if(this.usuarios[key].estadoVivo()){
				var numero = this.usuarios[key].numJugador;
				lista.push({nick:key, numJugador:numero});
			}
		}
		return lista;
	}

	
	this.realizarTarea=function(nick){
		this.fase.realizarTarea(nick, this);
	}
	this.puedeRealizarTarea=function(nick){
		let usuario=this.usuarios[nick];
		this.usuarios[nick].realizarTarea();
	}
	this.tareaTerminada=function(){
		if(this.comprobarTareasTerminadas()){
			this.finPartidaCiudadanos();
			console.log("Se han realizado todas las tareas por lo que termina el juego, ENHORABUENA");
		}
	}
	this.comprobarTareasTerminadas=function(){
		let res=true;
		for(var key in this.usuarios){
			if(this.usuarios[key].estadoTarea != "completada"){
				res=false;
				break;
			}
		}
		return res;
	}

	this.obtenerPercentTarea=function(nick){
		return this.usuarios[nick].obtenerPercentTarea();
	}

	this.obtenerPercentGlobal=function(){
		var total = 0;
		for(nick in this.usuarios){
			if (!this.usuarios[nick].impostor){
				total=total+this.obtenerPercentTarea(nick);
			}
		}
			total=total/this.numCiudadanosVivos();
			
		return total;	
	}



	this.agregarUsuario(owner);

}


///////////////////FUNCION INICIAL ////////////

function Inicial(){
	this.nombre="inicial";

	this.agregarUsuario=function(nick,partida){
		return partida.puedeAgregarUsuario(nick);
		/*if (partida.comprobarMinimo()){
		partida.fase=new Completado();
		}	*/	
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		 partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(nick,partida){
		//no se puede atacar pues no ha comenzado la partida
	}
	this.votar=function(nick,partida){
		//no
	}
	this.iniciarVotacion=function(partida){

	}
	this.eliminarMasVotado = function(partida) {
		//
	}
	this.skipear= function(usr){
		//
	}
	this.devolverPartidasLibres=function(partida){
		partida.puedeDevolverPartidasLibres();
	}
	this.realizarTarea=function(nick, partida){
		console.log("Aun no se ha comenzado la partida");
		//
	}
	
}


///////////////////FUNCION COMPLETADO ////////////
function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		partida.puedeIniciarPartida();
		//asignar encargos: jardines calles mobiliario basura Secuencialmente a todos los usuarios
		//asignar impostor: dado el array(Object.keys)
		//partida.fase=new Jugando();
	}
	this.agregarUsuario=function(nick,partida){
		if (partida.comprobarMaximo()){
			 return partida.puedeAgregarUsuario(nick);
		}
		else{
			console.log("Lo siento, numero máximo, partida llena");
		}
	}
	this.abandonarPartida=function(nick,partida){
		 partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(nick,partida){
		//partida sin empezar
	}
	this.votar=function(nick,partida){
			//no
	}

	this.iniciarVotacion=function(partida){
		
	}
	this.eliminarMasVotado = function(partida){
		//
	}
	this.skipear= function(usr){
		//
	}
	this.devolverPartidasLibres=function(partida){
		partida.puedeDevolverPartidasLibres();
	}
	this.realizarTarea=function(nick, partida){
		console.log("Aun no ha comenzado la partida");
		//
	}
}

///////////////////FUNCION JUGANDO ////////////
function Jugando(){
	this.nombre="jugando";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		 partida.puedeAbandonarPartida(nick);
		//comprobar si termina la partida
	}
	this.atacar=function(nick,partida){
		partida.puedeAtacar(nick);
	}
	this.votar=function(sospechoso,partida){
		//
	}

	this.iniciarVotacion=function(partida){
		partida.puedeIniciarVotacion();
	}
	this.eliminarMasVotado = function(partida){
		//
	}
	this.skipear = function(usr){
		//
	}
	this.devolverPartidasLibres= function(partida){
		//
	}
	this.realizarTarea=function(nick, partida){
		partida.puedeRealizarTarea(nick);
	}
	
}

///////////////////FUNCION VOTACION ////////////
function Votacion(){
	this.nombre="votacion";
	this.agregarUsuario=function(nick,partida){
		//
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		console.log(" No pùedes abandonar, Despues de votar si");
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(nick,partida){
		//
	}
	this.votar=function(sospechoso, partida) {
		partida.puedeVotar(sospechoso);
	}
	this.iniciarVotacion=function(partida){
		//
	}
	this.eliminarMasVotado=function(partida){
		partida.puedeEliminarMasVotado();
	}
	this.skipear=function(usr){
		usr.estado.skipear(usr);
	}
	this.devolverPartidasLibres=function(partida){
		//
	}
	this.realizarTarea=function(nick, partida){
		console.log("no se realizan tareas durante la votacion");
		//
	}
	
}



///////////////////FUNCION FIN ////////////
function Final(){
	this.nombre="final";
	this.ganadores="nadie";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ha terminado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		console.log(" la partida ha terminado");
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(nick,partida){
		//no puedes atacar con la partida acabada
	}
	this.votar=function(nick,partida){

	}

	this.iniciarVotacion=function(partida){
		
	}
	this.eliminarMasVotado=function(partida){
		//
	}
	this.skipear=function(usr){
		//
	}
	this.devolverPartidasLibres=function(partida){
		//
	}
	this.realizarTarea=function(nick, partida){
		console.log("la partida ha terminado no hay tareas");
	}

}


///////////////////FUNCION USUARIO ////////////
function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.skip = false;
	this.votos = 0;
	this.numJugador;
	this.partida;
	this.haVotado=false;
	this.estado = new Vivo();
	this.impostor=false;
	this.encargo="ninguno";
	this.maximoTareas=10;
	this.realizado=0;
	this.estadoTarea="noCompletada";

	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}

	this.estadoVivo=function(){
		return this.estado.estadoVivo();
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.abandonarPartida=function(){
		return this.partida.abandonarPartida(this.nick);
		if (this.partida.numJugadores <= 0){
			console.log(this.nick," era el ultimo jugador de la partida");
		}
	}
	/*this.unirAPartida=function(codigo){
		this.partida = this.juego.unirAPartida(codigo, this.nick);
	}*/
	this.atacar=function(nick){
		if(this.impostor && nick != this.nick){ 
		this.estado.atacar(nick, this.partida);
		}
	}
	this.esAtacado=function(){
		this.estado.esAtacado(this, this.partida);
	}
	this.votar=function(sospechoso){
		this.haVotado=true;
		this.partida.votar(sospechoso);
		//this.estado.votar(nick, this.partida, this);
	}
	this.esVotado=function(){
		this.estado.esVotado(this);
	}
	this.echarVotacion=function(){
		this.estado.echarVotacion(this);
	}
	this.puedeecharVotacion=function(){
		this.partida.iniciarVotacion();
	}
	this.skipear=function(){
		this.partida.fase.skipear(this);
	}
	this.puedeSkipear=function(){
		this.skip = true;
		this.haVotado=true;
		this.partida.comprobarVotacion();
	}
	this.realizarTarea=function(){
		if(!this.impostor){
			this.realizado = this.realizado + 1;
			if (this.realizado >= this.maximoTareas){
				this.estadoRealizado = true;
				this.partida.tareaTerminada();
			}
			console.log("usuario: "+this.nick+" realiza "+this.encargo+" realizada numero: "+this.realizado+" estado tarea: "+this.estadoTarea+"");
		}

	}
	this.asignarImpostor=function(){
		this.impostor = true;
		this.estadoTarea ="completada";
		this.realizado = this.maximoTarea;
	}
	this.obtenerPercentTarea=function(){
		return ((this.realizado*100)/this.maximoTarea)
		
	}

}






///////////////////FUNCION VIVO ////////////
function Vivo(){
	this.nombre="vivo";
	this.atacar=function(nick,partida){
		partida.atacar(nick);
	}
	this.esAtacado=function(atacado, partida){
		atacado.estado = new Muerto();
		partida.comprobarFinal();
	}
	this.votar=function(nick,partida, votante){
		votante.haVotado=true;
		partida.votar(nick);
	}
	this.esVotado=function(haVotado){
		haVotado.votos ++;
	}
	this.echarVotacion=function(usuario){
		usuario.puedeecharVotacion(this);
	}
	this.skipear=function(usr){
		usr.puedeSkipear();
	}

	this.estadoVivo=function(){
		return true;
	}
}



///////////////////FUNCION MUERTO ////////////
function Muerto(){
	this.nombre="muerto";
	this.atacar=function(nick,partida){
		//muerto no ataca
	}
	this.esAtacado=function(atacado, partida){
		//tampoco puedes atacar a un miertp
		
	}
	this.votar=function(nick, partida,votante){
		//los muertos no pueden votar
	}
	this.esVotado=function(votado){
		//y tampoco se puede votar a los muertos
	}
	this.echarVotacion=function(usuario){
		//muerto no puede hacer nada
	}
	this.skipear=function(usr){
		//
	}
	this.estadoVivo=function(){
		return false;
	}

}


function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}


function numeroValido(num, min) {
	if(!(num<min || num>10)){
		return true;
	}else{
		return false;
	}
}

/*function inicio(){

	juego=new Juego();
	var usr=new Usuario("pepe",juego);
	var codigo=usr.crearPartida(4);
	if (codigo != "Error"){
		juego.unirAPartida(codigo,"luis");
		juego.unirAPartida(codigo,"luisita");
		juego.unirAPartida(codigo,"luisito");
		juego.unirAPartida(codigo,"pepe2");

		usr.iniciarPartida(); 
	}

}*/
//esto de abajo solo hace falta en el modelo js del servidor

module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.Inicial=Inicial;