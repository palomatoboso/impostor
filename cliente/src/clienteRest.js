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

	this.listaPartidas=function(){
		$.getJSON("/listaPartidas",function(lista){
			console.log(lista);
		});
		}

		this.iniciarPartida=function(nick,codigo){
			$.getJSON("/iniciarPartida/"+nick+"/"+codigo,function(data){
				console.log(data);
			});
		}

}