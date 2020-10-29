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
          partida.usuarios["tomas"].abandonarPartida();
          expect(partida.fase.nombre=="inicial").toBe(true);
          expect(Object.keys(partida.usuarios).length==2).toBe(true);
          partida.usuarios["joselito"].abandonarPartida();
          partida.usuarios["pepepitollo"].abandonarPartida();
          expect(partida.numJugadores()).toEqual(0);
          juego.eliminarPartida(codigo);
          expect(juego.partidas[codigo]).toBe(undefined);
        });
    });
  }); 
});