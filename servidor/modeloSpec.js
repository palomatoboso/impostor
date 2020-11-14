var modelo=require("./modelo.js");

describe("El juego del impostor", function() {
  var juego;
  //var usr;
  var nick;

  beforeEach(function() {
    juego = new modelo.Juego();
      //usr = new modelo.Usuario("pepe",juego);
      nick="pepe";
    });

  it("Comprobar los valores iniciales", function() {
    expect(Object.keys(juego.partidas).length).toEqual(0);
    expect(nick).toEqual("pepe");
    expect(juego).not.toBe(undefined);
  });

  it("Comprobar los valores de la partida", function() {
    codigo=juego.crearPartida(3, nick);
    expect(codigo).toEqual("Error");
    codigo=juego.crearPartida(11, nick);
    expect(codigo).toEqual("Error");
  });

  describe("cuando el usuario pepe crea una partida de 4 jugadores", function(){
    beforeEach(function() {
      nick = "pepe";
      codigo=juego.crearPartida(4, nick);
      fase = new modelo.Inicial();
      partida = juego.partidas[codigo];
    });

    it("el usuario Pepe crea una partida de 4 jugadores", function(){
      expect(codigo).not.toBe(undefined);
      expect(partida.nickOwner==nick).toBe(true);
      expect(partida.fase.nombre=="inicial").toBe(true);
      expect(partida.maximo==4).toBe(true);
      expect(Object.keys(partida.usuarios).length==1).toBe(true);
    });

    it("3 usuario se unen mediante unirAPartida de partida", function(){
      juego.unirAPartida(codigo, "pepe");
      expect(Object.keys(partida.usuarios).length==2).toBe(true);
      juego.unirAPartida(codigo, "pepe");
      expect(Object.keys(partida.usuarios).length==3).toBe(true);
      juego.unirAPartida(codigo, "pepe");
      expect(Object.keys(partida.usuarios).length==4).toBe(true);
      expect(partida.usuarios["pepe"]).not.toBe(undefined);
      expect(partida.usuarios["pepe1"]).not.toBe(undefined);
      expect(partida.usuarios["pepe2"]).not.toBe(undefined);
      expect(partida.usuarios["pepe3"]).not.toBe(undefined);
      expect(partida.usuarios["pepe4"]).toBe(undefined);
    });


    it("El creador inicia la partida", function() {
      juego.unirAPartida(codigo, "pepe");
      expect(Object.keys(partida.usuarios).length==2).toBe(true);
      juego.unirAPartida(codigo, "pepe");
      expect(Object.keys(partida.usuarios).length==3).toBe(true);
      juego.unirAPartida(codigo, "pepe");
      expect(Object.keys(partida.usuarios).length==4).toBe(true);
      juego.iniciarPartida(codigo, nick);
      expect(partida.fase.nombre=="jugando").toBe(true);
    });

    describe("Creacion de 3 usuarios, uniones y abandonos", function(){
      beforeEach(function() {
        codigo=juego.crearPartida(4,nick);
        fase = new modelo.Inicial();
        partida = juego.partidas[codigo];
        usrpaloma = new modelo.Usuario("paloma",juego);
        usrluisita = new modelo.Usuario("luisita",juego);
        usramelia = new modelo.Usuario("amelia",juego);
      });

      it("Se crean 3 usuarios y se unen con usr.unirAPartida(codigo)", function() {
        juego.unirAPartida(codigo, "paloma");
        expect(Object.keys(partida.usuarios).length==2).toBe(true);
        juego.unirAPartida(codigo, "luisita");
        expect(Object.keys(partida.usuarios).length==3).toBe(true);
        juego.unirAPartida(codigo, "amelia");
        expect(Object.keys(partida.usuarios).length==4).toBe(true);
        expect(partida.usuarios["paloma"]).not.toBe(undefined);
        expect(partida.usuarios["luisita"]).not.toBe(undefined);
        expect(partida.usuarios["amelia"]).not.toBe(undefined);
        expect(partida.usuarios["paloma"].encargo).toEqual("ninguno");
        expect(partida.usuarios["luisita"].encargo).toEqual("ninguno");
        expect(partida.usuarios["amelia"].encargo).toEqual("ninguno");
      });

      it("3 usuarios de una partida sin iniciar, la abandonan", function() {
        juego.unirAPartida(codigo, "paloma");
        expect(Object.keys(partida.usuarios).length==2).toBe(true);
        juego.unirAPartida(codigo, "luisita");
        expect(Object.keys(partida.usuarios).length==3).toBe(true);
        juego.unirAPartida(codigo, "amelia");
        expect(Object.keys(partida.usuarios).length==4).toBe(true);
        expect(partida.usuarios["paloma"]).not.toBe(undefined);
        expect(partida.usuarios["luisita"]).not.toBe(undefined);
        expect(partida.usuarios["amelia"]).not.toBe(undefined);
        expect(partida.usuarios["pepe"]).not.toBe(undefined);
        partida.usuarios["paloma"].abandonarPartida();
        expect(Object.keys(partida.usuarios).length==3).toBe(true);
        partida.usuarios["luisita"].abandonarPartida();
        expect(Object.keys(partida.usuarios).length==2).toBe(true);
        partida.usuarios["amelia"].abandonarPartida();
        expect(Object.keys(partida.usuarios).length==1).toBe(true);
        partida.usuarios["pepe"].abandonarPartida();
        expect(partida.usuarios["pablo"]).toBe(undefined);
        expect(partida.usuarios["luisita"]).toBe(undefined);
        expect(partida.usuarios["amelia"]).toBe(undefined);
        expect(partida.usuarios["pepe"]).toBe(undefined);
        expect(juego.partidas[codigo]).toBe(undefined);
      });

      it("3 usuarios de una partida ya iniciada, la abandonan", function() {
        juego.unirAPartida(codigo, "paloma");
        expect(Object.keys(partida.usuarios).length==2).toBe(true);
        juego.unirAPartida(codigo, "luisita");
        expect(Object.keys(partida.usuarios).length==3).toBe(true);
        juego.unirAPartida(codigo, "amelia");
        expect(Object.keys(partida.usuarios).length==4).toBe(true);
        expect(partida.usuarios["paloma"]).not.toBe(undefined);
        expect(partida.usuarios["luisita"]).not.toBe(undefined);
        expect(partida.usuarios["amelia"]).not.toBe(undefined);
        expect(partida.fase.nombre=="completado").toBe(true);
        juego.iniciarPartida(codigo,nick);
        expect(partida.fase.nombre=="jugando").toBe(true);
        expect(partida.usuarios["paloma"].encargo).not.toEqual("ninguno");
        expect(partida.usuarios["luisita"].encargo).not.toEqual("ninguno");
        expect(partida.usuarios["amelia"].encargo).not.toEqual("ninguno");
        partida.usuarios["paloma"].abandonarPartida();
        expect(Object.keys(partida.usuarios).length==3).toBe(true);
        partida.usuarios["luisita"].abandonarPartida();
        expect(partida.fase.nombre=="inicial").toBe(true);
        expect(Object.keys(partida.usuarios).length==2).toBe(true);
        partida.usuarios["amelia"].abandonarPartida();
        partida.usuarios["pepe"].abandonarPartida();
        expect(partida.numJugadores()).toEqual(0);
        juego.eliminarPartida(codigo);
        expect(juego.partidas[codigo]).toBe(undefined);
      });
      
      describe("Durante la partida", function() {
        beforeEach(function() {
          juego.unirAPartida(codigo, "paloma");
          juego.unirAPartida(codigo, "luisita");
          juego.unirAPartida(codigo, "amelia");
          juego.iniciarPartida(codigo,nick);
          usuarios = partida.codigo.usuarios;
        numImpostores = partida.numImpostoresVivos(); //asi sabemos quien es el impostor
        //he creado este metodo porque se podia atacar a si mismo y nadie moriria por la
        //condicion que le he puesto de que no ataque a si mismo
        ciudadanos = partida.devolverCiudadanosVivos();
        impostor = partida.identificarImpostor();
      });
      });

      describe("las votaciones",function(){
        beforeEach(function(){
          juego.unirAPartida(codigo, "ana");
          juego.unirAPartida(codigo, "isa");
          juego.unirAPartida(codigo, "tomas");
          juego.iniciarPartida(codigo, nick);

        });

        it("todos skipean",function(){
          var partida=juego.partidas[codigo];
          juego.lanzarVotacion(codigo, nick);
          expect(partida.fase.nombre).toEqual("votacion");
          juego.saltarVoto(codigo, nick);
          expect(partida.fase.nombre).toEqual("votacion");
          juego.saltarVoto(codigo, "ana");
          expect(partida.fase.nombre).toEqual("votacion");
          juego.saltarVoto(codigo, "isa");
          expect(partida.fase.nombre).toEqual("votacion");
          juego.saltarVoto(codigo, "tomas");
          expect(partida.fase.nombre).toEqual("jugando");
        });

        it("Se vota y mata a un inocente",function(){
          var partida=juego.partidas[codigo];
          juego.lanzarVotacion(codigo, nick);

          partida.usuarios[nick].impostor=true;
          partida.usuarios["ana"].impostor=false;
          partida.usuarios["isa"].impostor=false;
          partida.usuarios["tomas"].impostor=false;

          expect(partida.fase.nombre).toEqual("votacion");
          juego.votar(codigo, nick, "tomas");
          expect(partida.fase.nombre).toEqual("votacion");
          juego.votar(codigo, "ana", "tomas");
          expect(partida.fase.nombre).toEqual("votacion");
          juego.votar(codigo, "isa", "tomas");
          expect(partida.fase.nombre).toEqual("votacion");
          juego.votar(codigo, "tomas", "tomas");
          expect(partida.usuarios["tomas"].estado.nombre).toEqual("muerto");
          expect(partida.fase.nombre).toEqual("jugando");
        });


        it("se vota y mata al impostor, la partida termina",function(){
          var partida=juego.partidas[codigo];
          juego.lanzarVotacion(nick,codigo);

          partida.usuarios[nick].impostor=true;
          partida.usuarios["ana"].impostor=false;
          partida.usuarios["isa"].impostor=false;
          partida.usuarios["tomas"].impostor=false;

          expect(partida.fase.nombre).toEqual("votacion");
          juego.votar(nick,codigo,"tomas");
          expect(partida.fase.nombre).toEqual("votacion");
          juego.votar("ana",codigo,nick);
          expect(partida.fase.nombre).toEqual("votacion");
          juego.votar("isa",codigo,nick);
          expect(partida.fase.nombre).toEqual("votacion");
          juego.votar("tomas",codigo,nick);
          expect(partida.usuarios[nick].estado.nombre).toEqual("muerto");
          expect(partida.fase.nombre).toEqual("final");
        });

        it("impostor ataca a todos y gana",function(){
          var partida=juego.partidas[codigo];

          partida.usuarios[nick].impostor=true;
          partida.usuarios["ana"].impostor=false;
          partida.usuarios["isa"].impostor=false;
          partida.usuarios["tomas"].impostor=false;

          juego.atacar(nick,codigo,"ana");
          expect(partida.usuarios["ana"].estado.nombre).toEqual("muerto");
          expect(partida.fase.nombre).toEqual("jugando");
          juego.atacar(nick,codigo,"isa");
          expect(partida.usuarios["isa"].estado.nombre).toEqual("muerto");
          expect(partida.fase.nombre).toEqual("final");
          expect(partida.fase.ganadores).toEqual("impostores");
        });
      })


    });
})
