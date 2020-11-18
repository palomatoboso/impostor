function ControlWeb($){

	this.mostrarCrearPartida=function(){
		var cadena='<div id ="mostrarCP">';
		  cadena=cadena+	'<div class="form-group">';
		  cadena =cadena + '<label for="nick">Nick:</label>';
		  cadena=cadena+ '<input type="text" class="form-control" id="nick">';
		  cadena=cadena+ '</div>';
		  cadena=cadena+ '<div class="form-group">';
		  cadena=cadena+ '<label for="num">Numero:</label>';
		  cadena=cadena+ '<input type="text" class="form-control" id="num">';
		  cadena=cadena+ '</div>';
		  cadena=cadena+ '<button type="button" id"btnCrear" class="btn btn-primary">Crear Partida</button>';
		  cadena=cadena+ '</div>';


		  $('#crearPartida').append(cadena);

		  $('#btnCrear').on('click',function(){
		  	var nick=$('#nick').val();
		  	var numero=$("#num").val();
		  	$("#mostrarCP").remove();
		  	ws.crearPartida(nick,num);
		  	//mostrarEsperandoRivak??
		  });

	}

	this.mostrarEsperandoRival=function(){
		$('#mER').remove();
		var cadena"<div id='mER'>";
		cadena=cadena+"<img src='cliente/img/loadin'>";
		cadena=cadena+'</div>';
		$('#esperando').append(cadena);
	}

	this.mostrarUnirAPartida=function(){
		$('#mUAP').remove();
		var cadena='<div id="mUAP">';
		cadena=cadena+ '<div class="list-group">';
		for(var i=0;i<lista.length;i++){
 		cadena=cadena+ ' <a href="#" value=" ' +lista[i].codigo+ ' " class="list-group-item">'+lista[i].codigo+'huecos:  ' +lista[i].huecos+'</a>';
 		}
 		cadena=cadena+'</div>';//cierra listGruop
 		cadena=cadena+ '<button type="button" id"btnUnir" class="btn btn-primary">Unir a Partida</button>';
 		
 		cadena=cadena+'</div>';//cierra mUAP

 		$('#unirAPartida').append(cadena);

 		 var StoreValue = []; //Declare array
	    $(".list-group a").click(function(){
	        StoreValue = []; //clear array
	        StoreValue.push($(this).attr("value")); // add text to array
	    });


 		 $('#btnUnir').on('click',function(){
		  	var nick=$('#nick').val();
		  	var codigo=StoreValue[0];
		  	$("#mUAP").remove();
		  	ws.unirrPartida(nick,num);
		  });
	}
}