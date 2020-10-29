//DEBE ESTAR GUARDADO EN :   cliente/ src 

function ClienteRest(){
	this.crearPartida=function(nick){
		$.getJSON("/crearPartida/"+nick+"/"+num,function(data){    
    		console.log(data);
		});
	}

	this.unirAPartida=function(codigo, nick){
		$.getJSON("/unirAPartida/"+codigo+"/"+nick,function(data){    
    		console.log(data);
		});
	}

}