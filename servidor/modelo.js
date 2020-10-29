

///////////////////FUNCION JUEGO ////////////
function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		
		if(numeroValido(num)){
			let codigo=this.obtenerCodigo();
			if (!this.partidas[codigo]){
				this.partidas[codigo]=new Partida(num,owner.nick,codigo);
				owner.partida=this.partidas[codigo];
			}
			return codigo;
		} else{
		let codigo="Error"; //tam partida
		return codigo;
	}

}
this.unirAPartida=function(codigo,nick){
	var res=-1;
	if (this.partidas[codigo]){
		res=this.partidas[codigo].agregarUsuario(nick);
	}
	return res;
}

this.eliminarPartida=function(cod){
	if (this.partidas[cod]){
		delete this.partidas[cod];
	}
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

this.listaPartidas=function(){
	var lista=[];
	var huecos=0;
	for(var key in this.partidas){
		var partida=this.partidas[key];
		huecos=partida.obtenerHuecos();
		if (huecos >0 ){//&& !(partida.fase.nombre=="jugando")){
			
		lista.push({"codigo":key,"huecos":num});
		
		}
	}
	return lista;
}

///////////////////FUNCION PARTIDAS ////////////
function Partida(num,owner,codigo){
	this.maximo=num;
	this.nickOwner=owner;
	this.codigo=codigo;
	this.fase=new Inicial();
	this.usuarios={};
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

	this.obtenerHuecos=function(){
		return this.maximo-this.numJugadores();
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

	this.votar=function(nick) {
		this.fase.votar(nick,this);
	}
	this.puedeVotar=function(nick) {
		this.usuarios[nick].esVotado();
	}
	this.recuentoMasVotado=function(){
		var votos = 0;
		var masVotado;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].votos > votos && this.usuarios[usr].estado.nombre == "vivo"){
				votos = this.usuarios[usr].votos;
				masVotado = this.usuarios[usr];
			}
		}
		return masVotado
	}
	this.iniciarVotacion=function(){
		this.fase.iniciarVotacion(this);
	}

	this.terminarVotacion=function(){
		
	}
	this.reiniciarContadores=function(){
		for(var usr in this.usuarios){
			if (this.usuarios[usr].estado.nombre == "vivo"){
				this.usuarios[usr].skip == false;
				this.usuarios[usr].votos == 0;
			}
		}
	}
	this.comprobarVotacion=function(){
		let elegido=this.jugadorMasVotado();
		if (elegido && elegido.votos>this.numeroSkips()){
			elegido.esAtacado();
		}
	}

	this.numeroImpostoresVivos=function(){
		var i=0;
		for (var usr in this.usuarios) {
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estado.nombre=="vivo"){
				i++;
			}
		}
		return i;
	}




	this.gananImpostores=function(){
		return this.numImpostoresVivos >= this.numCiudadanosVivos
		//(en caso cierto: cambiar fase a Final)
	}
	this.gananCiudadanos=function(){
		return this.numImpostoresVivos == 0
		//comprobar que numero impostores vivos es 0
	}
	this.masVotado=function(){
		max=0
		//Recorre los usuarios vivos y
		// (para cada usr comprueba si max<votos de ese ussuario)=>en caso cierto, 
		//actualiza max y guarda el usr
		//DEvuelve el usr
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

	this.reiniciarContadores=function(){
		//recorrer usuarios y poner votos a 0 y skip a false
		for(var usr in this.usuarios){
			if (this.usuarios[usr].estado.nombre == "vivo"){
				this.usuarios[usr].skip == false;
				this.usuarios[usr].votos == 0;
			}
		}
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
	}
	this.votar=function(nick,partida){

	}

	this.iniciarVotacion=function(partida){

	}
}


///////////////////FUNCION COMPLETADO ////////////
function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		partida.puedeIniciarPartida();
		//asignar encargos: jardines calles mobiliario basura Secuencialmente a todos los usuarios
		//asignar impostor: dado el array(Object.keys)
		partida.fase=new Jugando();
	}
	this.agregarUsuario=function(nick,partida){
		if (partida.comprobarMaximo()){
			partida.puedeAgregarUsuario(nick);
		}
		else{
			console.log("Lo siento, numero máximo, partida llena")
		}
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (!partida.comprobarMinimo()){
			partida.fase=new Inicial();
		}
	}
	this.atacar=function(nick,partida){
	}
	this.votar=function(nick,partida){

	}

	this.iniciarVotacion=function(partida){
		
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
		partida.eliminarUsuario(nick);
		//comprobar si termina la partida
	}
	this.atacar=function(nick,partida){
		partida.puedeAtacar(nick);
	}
	this.votar=function(nick,partida){

	}

	this.iniciarVotacion=function(partida){
		
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
		//no puede atacar con la partida terminada
	}
	this.votar=function(nick, partida) {
		partida.puedeVotar(nick);
	}
	this.iniciarVotacion=function(partida){
		//
	}
}



///////////////////FUNCION FIN ////////////
function Final(){
	this.final="final";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ha terminado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		//esto es absurdo
	}
	this.atacar=function(nick,partida){
	}
	this.votar=function(nick,partida){

	}

	this.iniciarVotacion=function(partida){
		
	}
}


///////////////////FUNCION USUARIO ////////////
function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.skips = 0;
	this.votos = 0;
	this.partida;
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
	this.unirAPartida=function(cod){
		this.partida = this.juego.unirAPartida(cod, this.nick);
	}
	this.atacar=function(nick){
		if(this.impostor){
			this.estado.atacar(nick, this.partida);
		}
	}
	this.esAtacado=function(){
		this.estado.esAtacado(this);
	}
	this.votar=function(nick){
		this.haVotado = true;
		this.estado.votar(nick, this.partida);
	}
	this.esVotado=function(){
		this.estado.esVotado(this);
	}
}






///////////////////FUNCION VIVO ////////////
function Vivo(){
	this.nombre="vivo";
	this.atacar=function(nick,partida){
		partida.atacar(nick);
	}
	this.esAtacado=function(atacado){
		atacado.estado = new Muerto();
	}
	this.votar=function(nick,partida){
		partida.votar(nick);
	}
	this.esVotado=function(haVotado){
		haVotado.votos ++;
	}
}



///////////////////FUNCION MUERTO ////////////
function Muerto(){
	this.nombre="muerto";
	this.atacar=function(nick,partida){
	}
	this.esAtacado=function(nick){
		
	}
	this.votar=function(nick, partida){
		//los muertos no pueden votar
	}
	this.esVotado=function(votado){
		//y tampoco se puede votar a los muertos
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