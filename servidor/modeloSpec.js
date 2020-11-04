var modelo=require("./modelo.js");

describe("El juego del impostor", function() {
  var juego;
  var usr;

  beforeEach(function() {
    juego = new Juego();
    usr = new Usuario("pepe",juego);
  });

  it("Comprobar valores iniciales", function() {
    expect(Object.keys(juego.partidas).length).toEqual(0);
    expect(usr.nick).toEqual("pepe");
    expect(usr.juego).not.toBe(undefined);
  });
  
  it("Comprobar valores de la partida", function() {
		codigo=usr.crearPartida(3);
		expect(codigo).toEqual("Error");
		codigo=usr.crearPartida(11);
		expect(codigo).toEqual("Error");
	});



  describe("cuando el usuario pepe crea una partida", function() {
    beforeEach(function() {
        codigo=usr.crearPartida(4);
    fase = new Inicial();
    partida = juego.partidas[codigo];
    });

    it("el usr Pepe crea una partida de 4 jugadores", function() {
        expect(codigo).not.toBe(undefined);
        expect(partida.nickOwner==usr.nick).toBe(true);
        expect(partida.fase.nombre=="inicial").toBe(true);
        expect(partida.maximo==4).toBe(true);
        expect(Object.keys(partida.usuarios).length==1).toBe(true);
      });

     it("3 usuario se unen mediante unirAPartida de partida", function() {
        juego.unirAPartida(codigo, "pepe");
        expect(Object.keys(partida.usuarios).length==2).toBe(true);
        juego.unirAPartida(codigo, "pepe");
        expect(Object.keys(partida.usuarios).length==3).toBe(true);
        juego.unirAPartida(codigo, "pepe");
        expect(Object.keys(partida.usuarios).length==4).toBe(true);
        expect(partida.usuarios["pepe"]).not.toBe(undefined);
        expect(partida.usuarios["pepito"]).not.toBe(undefined);
        expect(partida.usuarios["pepito2"]).not.toBe(undefined);
        expect(partida.usuarios["pepito3"]).not.toBe(undefined);
        expect(partida.usuarios["pepito4"]).toBe(undefined);
      });


     it("El creador inicia la partida", function() {
        juego.unirAPartida(codigo, "pepe");
        expect(Object.keys(partida.usuarios).length==2).toBe(true);
        juego.unirAPartida(codigo, "pepe");
        expect(Object.keys(partida.usuarios).length==3).toBe(true);
        juego.unirAPartida(codigo, "pepe");
        expect(Object.keys(partida.usuarios).length==4).toBe(true);
        usr.iniciarPartida(codigo);
        expect(partida.fase.nombre=="jugando").toBe(true);
      });

     describe("Creacion de 3 usuarios, uniones y abandonos", function() {
      beforeEach(function() {
        codigo=usr.crearPartida(4);
    fase = new Inicial();
    partida = juego.partidas[codigo];
    usrpaloma = new Usuario("paloma",juego);
    usrluisita = new Usuario("luisita",juego);
    usramelia = new Usuario("amelia",juego);
      });

       it("Se crean 3 usuarios y se unen con usr.unirAPartida(codigo)", function() {
          usrpaloma.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==2).toBe(true);
          usrluisita.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==3).toBe(true);
          usramelia.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==4).toBe(true);
          expect(partida.usuarios["paloma"]).not.toBe(undefined);
          expect(partida.usuarios["luisita"]).not.toBe(undefined);
          expect(partida.usuarios["amelia"]).not.toBe(undefined);
        });

       it("3 usuarios de una partida sin iniciar, la abandonan", function() {
          usrpaloma.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==2).toBe(true);
          usrluisita.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==3).toBe(true);
          usramelia.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==4).toBe(true);
          expect(partida.usuarios["paloma"]).not.toBe(undefined);
          expect(partida.usuarios["luisita"]).not.toBe(undefined);
          expect(partida.usuarios["amelia"]).not.toBe(undefined);
          usrpaloma.abandonarPartida();
          usrluisita.abandonarPartida();
          usramelia.abandonarPartida();
          expect(partida.usuarios["paloma"]).toBe(undefined);
          expect(partida.usuarios["luisita"]).toBe(undefined);
          expect(partida.usuarios["amelia"]).toBe(undefined);
        });

       it("3 usuarios de una partida ya iniciada, la abandonan", function() {
          usrpaloma.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==2).toBe(true);
          usrluisita.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==3).toBe(true);
          usramelia.unirAPartida(codigo);
          expect(Object.keys(partida.usuarios).length==4).toBe(true);
          expect(partida.usuarios["paloma"]).not.toBe(undefined);
          expect(partida.usuarios["luisita"]).not.toBe(undefined);
          expect(partida.usuarios["amelia"]).not.toBe(undefined);
          expect(partida.fase.nombre=="completado").toBe(true);
          usr.iniciarPartida();
          expect(partida.fase.nombre=="jugando").toBe(true);
          partida.usuarios["paloma"].abandonarPartida();
          expect(Object.keys(partida.usuarios).length==3).toBe(true);
          partida.usuarios["luisita"].abandonarPartida();
          expect(partida.fase.nombre=="inicial").toBe(true);
          expect(Object.keys(partida.usuarios).length==2).toBe(true);
          partida.usuarios["amelia"].abandonarPartida();
          partida.usuarios["pepepitollo"].abandonarPartida();
          expect(partida.numJugadores()).toEqual(0);
          juego.eliminarPartida(codigo);
          expect(juego.partidas[codigo]).toBe(undefined);
        });


       
    
          it("Comprobar de que tenemos un impostor", function() {​​​​​
          expect(numImpostores).not.toEqual(0);
          }​​​​​);

           it("Partida que ganan por los impostores", function() {​​​​​
          expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
          expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
          expect(partida.usuarios["luisita"].estado.nombre).toEqual("vivo");
          expect(partida.usuarios["amelia"].estado.nombre).toEqual("vivo");
          impostor = partida.asignarImpostor();
          impostor.atacar("pepe");
          impostor.atacar("paloma");
          impostor.atacar("luisita");
          impostor.atacar("amelia");
          expect(partida.fase.nombre).toEqual("final");
          expect(partida.fase.ganadores).toEqual("impostores");
          }​​​​​);
           it("La partida la ganan los impostores", function() {​​​​​
          expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
          expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
          expect(partida.usuarios["luisita"].estado.nombre).toEqual("vivo");
          expect(partida.usuarios["amelia"].estado.nombre).toEqual("vivo");
          impostor = partida.identificarImpostor();
          impostor.atacar("pepe");
          impostor.atacar("paloma");
          impostor.atacar("luisita");
          impostor.atacar("amelia");
          expect(partida.fase.nombre).toEqual("final");
          expect(partida.fase.ganadores).toEqual("impostores");
          }​​​​​);
           it("Mueren  ciudadanos", function() {​​​​​
          expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
          impostor.atacar(ciudadanos[0].nick);
          expect(partida.usuarios[ciudadanos[0].nick].estado.nombre).toEqual("muerto");
          }​​​​​);
          ​
              
          it("Mientras estamos jugando la partida", function(){​​​​​
          beforeEach(function() {​​​​​
          juego.unirAPartida(codigo, "paloma");
          juego.unirAPartida(codigo, "luisita");
          juego.unirAPartida(codigo, "amelia");
          usr.iniciarPartida();
          usuarios = partida.codigo.usuarios;
          numImpostores = partida.numImpostoresVivos();
          impostor = partida.asignarImpostor();
          ciudadanos = partida.cuantosCiudadanosVivos();
          }​​​​​);
            it ( "votaciones: no votan por lo que no mueren y siguen jugando" ,  function ( )  {
          esperar ( partida . fase . nombre ) . toEqual ( "jugando" ) ;
          esperar ( partida . usuarios [ "pepe" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "paloma" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "luisita" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "amelia" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          partida . comenzarVotacion ( ) ;
          esperar ( partida . fase . nombre ) . toEqual ( "votacion" ) ;
          partida . usuarios [ "pepe" ] . skipear ( ) ;
          esperar ( partida . usuarios [ "pepe" ] . saltar ) . toBe ( verdadero ) ;
          partida . usuarios [ "paloma" ] . skipear ( ) ;
          esperar ( partida . usuarios [ "paloma" ] . saltar ) . toBe ( verdadero ) ;
          partida . usuarios [ "luisita" ] . skipear ( ) ;
          esperar ( partida . usuarios [ "luisita" ] . saltar ) . toBe ( verdadero ) ;
          partida . usuarios [ "amelia" ] . skipear ( ) ;
          esperar ( partida . usuarios [ "amelia" ] . saltar ) . toBe ( verdadero ) ;
          esperar ( partida . numImpostoresVivos ( ) ) . toEqual ( 1 ) ;
          esperar ( partida . numCiudadanosVivos ( ) ) . toEqual ( 3 ) ;
          esperar ( partida . gananCiudadanos ( ) ) . toBe ( falso ) ;
          esperar ( partida . gananImpostores ( ) ) . toBe ( falso ) ;
          partida . eliminarMasVotado ( ) ;
          esperar ( partida . numImpostoresVivos ( ) ) . toEqual ( 1 ) ;
          esperar ( partida . numCiudadanosVivos ( ) ) . toEqual ( 3 ) ;
          esperar ( partida . gananCiudadanos ( ) ) . toBe ( falso ) ;
          esperar ( partida . gananImpostores ( ) ) . toBe ( falso ) ;
          esperar ( partida . fase . nombre ) . toEqual ( "jugando" ) ;
          esperar ( partida . usuarios [ "pepe" ] . saltar ) . toBe ( falso ) ;
          esperar ( partida . usuarios [ "paloma" ] . saltar ) . toBe ( falso ) ;
          esperar ( partida . usuarios [ "luisita" ] . saltar ) . toBe ( falso ) ;
          esperar ( partida . usuarios [ "amelia" ] . saltar ) . toBe ( falso ) ;
          esperar ( partida . usuarios [ "pepe" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "paloma" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "luisita" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "amelia" ] . estado . nombre ) . toEqual ( "vivo" ) ;
        } ) ;
        it ( "votaciones: descubren a el impostor, termina la  partida y ganan los usuarios/ciudadanos" ,  function ( )  {
          esperar ( partida . fase . nombre ) . toEqual ( "jugando" ) ;
          esperar ( partida . usuarios [ "pepe" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "paloma" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "luisita" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          esperar ( partida . usuarios [ "amelia" ] . estado . nombre ) . toEqual ( "vivo" ) ;
          partida . comenzarVotacion ( ) ;
          esperar ( partida . fase . nombre ) . toEqual ( "votacion" ) ;
          ciudadanos [ 0 ] . votar ( impostor . nick ) ;
          esperar ( ciudadanos [ 0 ] . saltar ) . toBe ( falso ) ;
          esperar ( ciudadanos [ 0 ] . haVotado ) . toBe ( verdadero ) ;
          esperar ( impostor . votos ) . toEqual ( 1 ) ;
          ciudadanos [ 1 ] . votar ( impostor . nick ) ;
          esperar ( ciudadanos [ 1 ] . haVotado ) . toBe ( verdadero ) ;
          esperar ( ciudadanos [ 1 ] . saltar ) . toBe ( falso ) ;
          esperar ( impostor . votos ) . toEqual ( 2 ) ;
          ciudadanos [ 2 ] . votar ( impostor . nick ) ;
          esperar ( ciudadanos [ 2 ] . saltar ) . toBe ( falso ) ;
          esperar ( ciudadanos [ 2 ] . haVotado ) . toBe ( verdadero ) ;
          esperar ( impostor . votos ) . toEqual ( 3 ) ;
          esperar ( partida . numImpostoresVivos ( ) ) . toEqual ( 1 ) ;
          esperar ( partida . numCiudadanosVivos ( ) ) . toEqual ( 3 ) ;
          esperar ( partida . gananCiudadanos ( ) ) . toBe ( falso ) ;
          esperar ( partida . gananImpostores ( ) ) . toBe ( falso ) ;
          partida . eliminarMasVotado ( ) ;
          esperar ( partida . numImpostoresVivos ( ) ) . toEqual ( 0 ) ;
          esperar ( partida . numCiudadanosVivos ( ) ) . toEqual ( 3 ) ;
          esperar ( partida . gananCiudadanos ( ) ) . toBe ( verdadero ) ;
          esperar ( partida . gananImpostores ( ) ) . toBe ( falso ) ;
          esperar ( partida . fase . nombre ) . toEqual ( "final" ) ;
          esperar ( partida . fase . ganadores ) . toEqual ( "ciudadanos" ) ;
          esperar ( impostor . estado . nombre ) . toEqual ( "muerto" ) ;
        } ) ;

    });
  }); 
});