

///////////////////FUNCION JUEGO ////////////
function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		
		if(numeroValido(num)){
			let codigo=this.obtenerCodigo();
			if (!this.partidas[codigo]){
					this.partidas[codigo]=new Partida(num,owner,codigo,this);
				//owner.partida=this.partidas[codigo];
			}
			return codigo;
		} else{
		let codigo="Error"; //tam partida
		return codigo;
		}

	}
	this.unirAPartida=function(cod,nick){
		//var res=-1;
		if (this.partidas[cod]){
			this.partidas[cod].agregarUsuario(nick);
		}
		return cod;
	}

	this.iniciarPartida=function(codigo, nick){
			var owner=this.partidas[codigo].nickOwner;
			if(nick==owner){
				this.partidas[codigo].iniciarPartida();
			}
	}

	this.eliminarPartida=function(cod){
		delete this.partidas[cod];
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
	this.listarPartidasDisponibles=function(){
			var lista = [];
			var huecos = 0;
			var maximo=0;
			var owner="";
			for (var key in this.partidas){
				var partida = this.partidas[key];
				huecos=partida.obtenerHuecos();
				owner=partida.nickOwner;
				maximo = partida.maximo;
				if(huecos>0){
					lista.push({"codigo":key,"huecos":huecos, "maximo":maximo,"owner":owner})
				}
			}
			return lista;
	}
	this.echarVotacion=function(nick,codigo){
		var usr=this.partidas[codigo].usuario[nick];
		this.reiniciarContadores(codigo);
		usr.lanzarVotacion();
	}

	this.listaPartidas=function(){
		var lista=[];
		var huecos=0;
		for(var key in this.partidas){
			var partida=this.partidas[key];
			var owner=this.partidas[key].nickOwner;
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
			res={"nick":nick,"encargo":encargo,"impostor":impostor};
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

}


///////////////////FUNCION PARTIDAS ////////////
function Partida(num,owner,codigo){
	this.juego=juego;
	this.maximo=num;
	this.nickOwner=owner;
	this.codigo=codigo;
	this.fase=new Inicial();
	this.usuarios={};
	this.elegido="no hay nadie elegido";
	this.encargos=["jardines","calles","mobiliario","basuras"];
	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this)
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
	}
	this.obtenerUsuarios=function(nick){
		return this.usuarios[nick]
	}

	this.numJugadores=function(){
		return Object.keys(this.usuarios).length
	}

	this.comprobarMinimo=function () {
		return Object.keys(this.usuarios).length >= 4
	}

	this.comprobarMaximo=function () {
		return Object.keys(this.usuarios).length < this.maximo
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
		this.eliminarUsuario(nick);
		if (!this.comprobarMinimo()){
			this.fase=new Inicial();
		}
		if (this.numJugadores()<=0){
			this.juego.eliminarPartida(this.codigo);
		}
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
		for(var usr in this.usuarios){
			i=0;
			this.usuarios[usr].encargo=this.encargos[i];
			i+1;
		}
	}
	this.asignarImpostor=function(){
		this.nicks=Object.keys(this.usuarios);
		this.usuarios[this.nicks[randomInt(0,this.nicks.length)]].impostor=true;
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
	}
	this.numCiudadanosVivos=function(){
		var i = 0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == false && this.usuarios[usr].estado.nombre == "vivo"){
				i++;
			}
		}
		return i
	}

	this.numImpostoresVivos=function(){
		var i=0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estado.nombre == "vivo"){
				i++;
			}
		}
		return i
	}
	this.localizarImpostor=function(){
		var i=0;
		var impostor;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estado.nombre == "vivo"){
				impostor = this.usuarios[usr];
			}
		}
		return impostor
	}
	this.devolverCiudadanosVivos=function(){
		var i=0;
		var ciudadanos = [];
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == false && this.usuarios[usr].estado.nombre == "vivo"){
				ciudadanos[i] = this.usuarios[usr];
				i++;
			}
		}
		return ciudadanos
	}

	this.votar=function(nick) {
		this.fase.votar(nick,this);
	}
	this.puedeVotar=function(nick) {
		this.usuarios[nick].esVotado();
		this.comprobarVotacion();
	}
	this.recuentoMasVotado=function(){
		var votos = 0;
		var masVotado="No hay nadie mas votado";
		for(var usr in this.usuarios){
			if (this.usuarios[usr].votos > votos && this.usuarios[usr].estado.nombre == "vivo"){
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
	this.terminarVotacion=function(){
		this.comprobarFinal();
		this.reiniciarContadores();
	}
	this.todosHanVotado=function(){
		let res=true;
		for(var key in this.usuarios){
			//if (this.usuarios[key].estado.nombre=="vivo"&& this.)
		}
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
			if (this.usuarios[usr].estado.nombre == "vivo"){
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
		let elegido=this.recuentoMasVotado();
		if (elegido && elegido.votos>this.numeroSkips()){
			elegido.esAtacado();
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
		return this.numImpostoresVivos >= this.numCiudadanosVivos()
		//(en caso cierto: cambiar fase a Final)
	}
	this.gananCiudadanos=function(){
		return this.numImpostoresVivos == 0
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
			if (this.usuarios[usr].skip == true && this.usuarios[usr].estado.nombre == "vivo"){
				i++;
			}
		}
		return i
	}

	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			this.finPartida();
		}
		else if (this.gananCiudadanos()){
			this.finPartida();
		}else{
			this.fase=new Jugando();
		}

	}
	this.finPartidaImpostores=function(){
		this.fase = new Final();
		this.fase.ganadores = "impostores";
	}
	this.finPartidaCiudadanos=function(){
		this.fase = new Final();
		this.fase.ganadores = "ciudadanos";
	}
	this.comprobarVotacion=function(){
		if (this.todosHanVotado()){
			let elegido=this.recuentoMasVotado();
			if (elegido && elegido.votos>this.numeroSkips()){
				this.elegido=elegido.nick;
				elegido.esAtacado();
				
			}
			this.finalVotacion();
		}
		
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
			if(this.usuarios[key].estado.nombre=="vivo" && !this.usuarios[key].haVotado){
				res=false;
				break;
			}
		}
		return res
	}
	this.listaHanVotado=function(){
		var lista=[];
		for(var key in this.usuarios){
			if(this.usuarios[key].estado.nombre=="vivo" && this.usuarios[key].haVotado){
				lista.push(key);
			}
		}
		return lista;
	}



	this.agregarUsuario(owner);

}


///////////////////FUNCION INICIAL ////////////

function Inicial(){
	this.nombre="inicial";

	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()){
			partida.fase=new Completado();
		}		
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
	this.eliminarMasVotado = function (partida) {
		//
	}
	this.skipear = function (usr) {
		//
	}
	this.devolverPartidasLibres=function(partida){
		partida.puedeDevolverPartidasLibres();
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
			partida.puedeAgregarUsuario(nick);
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
	this.eliminarMasVotado = function (partida) {
		//
	}
	this.skipear = function (usr) {
		//
	}
	this.devolverPartidasLibres=function(partida){
		partida.puedeDevolverPartidasLibres();
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
	this.votar=function(nick,partida){
		//
	}

	this.iniciarVotacion=function(partida){
		partida.puedeComenzarVotacion();
	}
	this.eliminarMasVotado = function ( partida ) {
		//
	}
	this.skipear = function ( usr ) {
		//
	}
	this.devolverPartida = function ( partida ) {
		//
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
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(nick,partida){
		//
	}
	this.votar=function(nick, partida) {
		partida.puedeVotar(nick);
	}
	this.comenzarVotacion=function(partida){
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
	
}



///////////////////FUNCION FIN ////////////
function Final(){
	this.final="final";
	this.ganadores="nadie";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ha terminado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
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

}


///////////////////FUNCION USUARIO ////////////
function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.skip = false;
	this.votos = 0;
	this.partida;
	this.haVotado=false;
	this.estado = new Vivo();
	this.impostor=false;
	this.encargo="ninguno";


	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
		if (this.partida.numJugadores <= 0){
			console.log(this.nick," era el ultimo jugador de la partida");
		}
	}
	/*this.unirAPartida=function(cod){
		this.partida = this.juego.unirAPartida(cod, this.nick);
	}*/
	this.atacar=function(nick){
		if (this.impostor && !(this.nick==inocente)){
			this.partida.atacar(inocente);
		}
	}
	this.esAtacado=function(){
		this.estado.esAtacado(this, this.partida);
	}
	this.votar=function(nick){
		this.estado.votar(nick, this.partida, this);
	}
	this.esVotado=function(){
		this.estado.esVotado(this);
	}
	this.echarVotacion=function(){
		this.estado.echarVotacion(this);
	}
	this.puedeecharVotacion=function(){
		this.partida.comenzarVotacion();
	}
	this.skipear=function(){
		this.partida.fase.skipear(this);
	}
	this.puedeSkipear=function(){
		this.skip = true;
		this.haVotado=true;
		this.partida.comprobarVotacion();
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
}



///////////////////FUNCION MUERTO ////////////
function Muerto(){
	this.nombre="muerto";
	this.atacar=function(nick,partida){
		//muerto no ataca
	}
	this.esAtacado=function(nick){
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

}


function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}


function numeroValido(num) {
	if(!(num<4 || num>10)){
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