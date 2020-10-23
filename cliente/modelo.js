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
		let codigo="Error";
		return codigo;
	}

}
	this.unirAPartida=function(codigo,nick){
		if (this.partidas[codigo]){
			this.partidas[codigo].agregarUsuario(nick);
		}
		return this.partidas[codigo];
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
}

function Partida(num,owner){
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
	this.agregarUsuario(owner);
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

	this.agregarUsuario(owner);


this.gananImpostores=function(){
	//comprobar si impostores vivos>=ciudadanos vivos
	//(en caso cierto: cambiar fase a Final)
this.gananCiudadanos=function(){
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
}

this.reiniciarContadores=function(){
	//recorrer usuarios y poner votos a 0 y skip a false
}

this.comprobarFinal=function(){
	if (this.gananImpostores()){
		this.finPartida();
}
	else if (this.gananCiudadanos()){
		this.finPartida();
}

}




}

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
}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		partida.puedeIniciarPartida();
		//partida.fase=new Jugando();
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
}

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
	
}

function Votacion(){

}


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
}

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
}


}

function Vivo(){
	this.nombre="vivo";
	this.atacar=function(nick,partida){
		partida.atacar(nick);
	}
	this.esAtacado=function(atacado){
		atacado.estado = new Muerto();
	}
}

function Muerto(){
	this.nombre="muerto";
	this.atacar=function(nick,partida){
	}
	this.esAtacado=function(nick){
		
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

function inicio(){

	juego=new Juego();
	var usr=new Usuario("pepe",juego);
	var codigo=usr.crearPartida(4);

	juego.unirAPartida(codigo,"luis");
	juego.unirAPartida(codigo,"luisita");
	juego.unirAPartida(codigo,"luisito");
	juego.unirAPartida(codigo,"pepe2");

	usr.iniciarPartida(); 


}