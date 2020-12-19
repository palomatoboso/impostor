function ControlWeb($){

	this.mostrarCrearPartida=function(){
		var cadena='<div id ="mostrarCP">';
		  cadena=cadena+'<div class="form-group">';
		  cadena=cadena+'<h3>Crear Partida</h3>';
		  cadena =cadena +'<label for="nick">Nick:</label>';
		  cadena=cadena+'<input value ="player" type="text" class="form-control" id="nick" value="">';
		  cadena=cadena+'</div>';
		  cadena=cadena+'<div class="form-group">';
		  cadena=cadena+'<label for="num">Numero:</label>';
		  cadena=cadena+'<input value="4" type="number" class="form-control" id="num" min="4" max="10">';
		  cadena=cadena+'</div>';
		  cadena=cadena+'<button type="button" id"btnCrear" class="btn btn-primary">Crear Partida</button>';
		  cadena=cadena+'</div>';


		  $('#crearPartida').append(cadena);

		 $('#btnCrear').on('click',function(){
			var nick=$('#nick').val();
			var num=$("#num").val();
			$("#mostrarCP").hide();
			if(nick != ""){
				ws.crearPartida(nick,num);
			}else{
				$("#mostrarCP").show();
			}
		});
		

	}
	this.limpiar=function(){
		$('#encabezado').remove();
		$('#mUAP').remove();
		$("#mostrarCP").remove();
	}

	this.mostrarEsperandoRival=function(){
		$('#mER').remove();
		var cadena='<div id="mER"><h3>Esperando rival</h3>';
		cadena=cadena+"<img src='cliente/img/loading.gif' class='img-responsive center-block'>";
		cadena=cadena+"</div>";
		this.limpiar();
		$('#esperando').append(cadena);
		ws.listarParticipantes();
	}


	this.mostrarUnirAPartida=function(lista){
		$('#mUAP').remove();
		var cadena='<div id="mUAP">';
		cadena=cadena+'<h3>Unirse a una Partida</h3>';
		cadena=cadena+ '<div class="list-group">';
		for(var i=0;i<lista.length;i++){
			var maximo=lista[i].maximo
			var numJugadores=maximo-(lista[i].huecos)
 			cadena=cadena+'<a href="#" value=" ' +lista[i].codigo+ ' " class="list-group-item">'+lista[i].codigo+'Host: '+lista[i].owner+' <span class="badge">'+numJugadores+'/'+maximo+'</span></a>';
 		}
 		cadena=cadena+'</div>';//cierra listGruop
 		cadena=cadena+ '<button type="button" id="btnUnir" class="btn btn-primary">Unir a Partida</button>';
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
		  	if(codigo!=undefined && nick!=""){
				ws.unirAPartida(codigo,nick);
			}
			else{
				ws.listaPartidasDisponibles();
			}

		  });


	}

	
	this.mostrarIniciarPartida=function(){
		$('#mIP').remove();
		var cadena='<div id="mostrarlaIP">';
		cadena=cadena+'</div>';
		cadena=cadena+'<button type="button" id="btnComenzar" class="btn btn-primary">Iniciar la Partida</button>';
		cadena=cadena+'</div>';

		$('#esperando').append(cadena);

		$('#btnComenzar').on('click',function(){
			ws.iniciarPartida();
		});
	}


	this.mostrarListaPartidas=function(lista){

	    $('#mostrarListaPartidas').remove();
	    var cadena='<div id="mostrarListaPartidas"><h3>Elegir partida</h3>';
	    cadena=cadena+'<div class="list-group" id="lista">';
	    for(var i=0;i<lista.length;i++){
	        var maximo=lista[i].maximo;
	        var numJugadores=maximo-lista[i].huecos;
	        cadena=cadena+'<a href="#" value="'+lista[i].codigo+'" class="list-group-item">'+lista[i].codigo+'<span class="badge">'+numJugadores+'/'+maximo+'</span></a>';
	    } 
	    cadena=cadena+'</div>';
	    //cadena=cadena+'</div>';
	    cadena=cadena+'<input type="button" class="btn btn-primary btn-md" id="unirme" value="Unirme">';'</div>';

	    $('#listaPartidas').append(cadena);
	    StoreValue = []; //Declare array
	    $(".list-group a").click(function(){
	        StoreValue = []; //clear array
	        StoreValue.push($(this).attr("value")); // add text to array
	    });

	    $('#unirme').click(function(){
	          var codigo="";
	          codigo=StoreValue[0];//$("#lista").val();
	          console.log(codigo);
	          var nick=$('#nick').val();
	          if (codigo && nick){
	            $('#mostrarListaPartidas').remove();
	            $('#crearPartida').remove();
	            ws.unirAPartida(nick,codigo);
	          }
	    });
	  }






	/*this.mostrarListaJugadores=function(lista){
	  	$('#mostrarListaEsperando').remove();
	  	var cadena='<div id="mostrarListaEsperando"><h3>Lista Jugadores</h3>';
	  	cadena =cadena+'<ul class="list-group">';
	  	 for(var i=0;i<lista.length;i++){
	  		cadena=cadena+'<li class="list-group-item">'+lista[i].nick+'</li>';
	  	}
		cadena=cadena+'</ul></div>';
		$('#listaEsperando').append(cadena);
	}*/

	this.mostrarParticipantes=function(lista){
		$('#mP').remove();
		var cadena='<div id="mP">';
		cadena=cadena+'<h3>Lista de los Participantes</h3>';
		cadena=cadena+'<div class="list-group">';
		for(var i=0;i<lista.length;i++){
	  		cadena=cadena+'<li value="'+lista[i].nick+'" class="list-group-item">'+lista[i].nick+'</li>';
	  	}
		cadena=cadena+'</div>';
		cadena=cadena+'</div>';

		$('#uniendo').append(cadena);
	}

	this.actualizarJugadores=function(){
		ws.listarParticipantes();
	}

	this.actualizarPartidas=function(){
    ws.listaPartidasDisponibles();
 	 }


	this.limpiarLog=function(){
			$('#esperando').remove();
			$('#uniendo').remove();
		}


	this.mostrarModalSimple=function(msg){
		$('#avisarImpostor').remove();
		var cadena="<p id='avisarImpostor'>"+msg+'</p>';
		$("#contenidoModal").append(cadena);
		$('#modalGeneral').modal("show");
	}	

	this.mostrarModalTarea=function(tarea){
		$('#avisarImpostor').remove();
		//poner gif animado 
		$('#tarea').remove();
		var cadena="<p id='tarea'>"+tarea+'</p>';
		$("#contenidoModal").append(cadena);
		$('#modalGeneral').modal("show");

	}
}



