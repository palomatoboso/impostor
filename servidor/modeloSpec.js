var modelo=require("./modelo.js");

describe("El juego del impostor", function() {
  var juego;
  var usr;

  beforeEach(function() {
    juego = new modelo.Juego();
    usr = new modelo.Usuario("pepe",juego);
  });

  it("Comprobar los valores iniciales", function() {
    expect(Object.keys(juego.partidas).length).toEqual(0);
    expect(usr.nick).toEqual("pepe");
    expect(usr.juego).not.toBe(undefined);
  });

  it("Comprobar los valores de la partida", function() {
    codigo=usr.crearPartida(3);
    expect(codigo).toEqual("Error");
    codigo=usr.crearPartida(11);
    expect(codigo).toEqual("Error");
  });

  describe("cuando el usuario pepe crea una partida de 4 jugadores", function() {
    beforeEach(function() {
      codigo=usr.crearPartida(4);
      fase = new modelo.Inicial();
      partida = juego.partidas[codigo];
    });

    it("el usuario Pepe crea una partida de 4 jugadores", function() {
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
      usr.iniciarPartida(codigo);
      expect(partida.fase.nombre=="jugando").toBe(true);
    });

    describe("Creacion de 3 usuarios, uniones y abandonos", function() {
      beforeEach(function() {
        codigo=usr.crearPartida(4);
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
        partida.usuarios["paloma"].abandonarPartida();
        partida.usuarios["luisita"].abandonarPartida();
        partida.usuarios["amelia"].abandonarPartida();
        expect(partida.usuarios["paloma"]).toBe(undefined);
        expect(partida.usuarios["luisita"]).toBe(undefined);
        expect(partida.usuarios["amelia"]).toBe(undefined);
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
        usr.iniciarPartida();
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
    });

    describe("Durante la partida", function() {
      beforeEach(function() {
        juego.unirAPartida(codigo, "paloma");
        juego.unirAPartida(codigo, "luisita");
        juego.unirAPartida(codigo, "amelia");
        usr.iniciarPartida();
        usuarios = partida.codigo.usuarios;
        numImpostores = partida.numImpostoresVivos(); //asi sabemos quien es el impostor
        //he creado este metodo porque se podia atacar a si mismo y nadie moriria por la
        //condicion que le he puesto de que no ataque a si mismo
        ciudadanos = partida.devolverCiudadanosVivos();
        impostor = partida.identificarImpostor();
      });

      it("Comprobar que hay un impostor", function() {
        expect(numImpostores).not.toEqual(0);
      });

      it("El impostor ataca, muere un ciudadano", function() {
        expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
        //Lo he tenido que hacer de esta manera porque como la asignacion de impostor es al azar
        //puede atacarse a si mismo en algun momento y fallaria el test
        impostor.atacar(ciudadanos[0].nick); 
        expect(partida.usuarios[ciudadanos[0].nick].estado.nombre).toEqual("muerto");
      });

      it("ganan impostores", function() {
        expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["luisita"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["amelia"].estado.nombre).toEqual("vivo");
        impostor = partida.identificarImpostor();
        //Da igual que ataque a todos, puesto que no sabemos ahora mismo quien es el impostor, 
        //le he puesto una condicion para que no se ataque a si mismo en el metodo Atacar
        impostor.atacar("pepe");
        impostor.atacar("paloma");
        impostor.atacar("luisita");
        impostor.atacar("amelia");
        expect(partida.fase.nombre).toEqual("final");
        expect(partida.fase.ganadores).toEqual("impostores");
      });
      it("votaciones: todos saltan el voto, nadie muere, la partida sigue", function() {
        expect(partida.fase.nombre).toEqual("jugando");
        expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["luisita"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["amelia"].estado.nombre).toEqual("vivo");
        partida.comenzarVotacion();
        expect(partida.fase.nombre).toEqual("votacion");
        partida.usuarios["pepe"].skipear();
        expect(partida.usuarios["pepe"].skip).toBe(true);
        partida.usuarios["paloma"].skipear();
        expect(partida.usuarios["paloma"].skip).toBe(true);
        partida.usuarios["luisita"].skipear();
        expect(partida.usuarios["luisita"].skip).toBe(true);
        partida.usuarios["amelia"].skipear();
        expect(partida.usuarios["amelia"].skip).toBe(true);
        expect(partida.numImpostoresVivos()).toEqual(1);
        expect(partida.numCiudadanosVivos()).toEqual(3);
        expect(partida.gananCiudadanos()).toBe(false);
        expect(partida.gananImpostores()).toBe(false);
        partida.eliminarMasVotado();
        expect(partida.numImpostoresVivos()).toEqual(1);
        expect(partida.numCiudadanosVivos()).toEqual(3);
        expect(partida.gananCiudadanos()).toBe(false);
        expect(partida.gananImpostores()).toBe(false);
        expect(partida.fase.nombre).toEqual("jugando");
        expect(partida.usuarios["pepe"].skip).toBe(false);
        expect(partida.usuarios["paloma"].skip).toBe(false);
        expect(partida.usuarios["luisita"].skip).toBe(false);
        expect(partida.usuarios["amelia"].skip).toBe(false);
        expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["luisita"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["amelia"].estado.nombre).toEqual("vivo");
      });
      it("votaciones: impostor pillado, la partida termina, gana el pueblo", function() {
        expect(partida.fase.nombre).toEqual("jugando");
        expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["luisita"].estado.nombre).toEqual("vivo");
        expect(partida.usuarios["amelia"].estado.nombre).toEqual("vivo");
        partida.comenzarVotacion();
        expect(partida.fase.nombre).toEqual("votacion");
        ciudadanos[0].votar(impostor.nick);
        expect(ciudadanos[0].skip).toBe(false);
        expect(ciudadanos[0].haVotado).toBe(true);
        expect(impostor.votos).toEqual(1);
        ciudadanos[1].votar(impostor.nick);
        expect(ciudadanos[1].haVotado).toBe(true);
        expect(ciudadanos[1].skip).toBe(false);
        expect(impostor.votos).toEqual(2);
        ciudadanos[2].votar(impostor.nick);
        expect(ciudadanos[2].skip).toBe(false);
        expect(ciudadanos[2].haVotado).toBe(true);
        expect(impostor.votos).toEqual(3);
        expect(partida.numImpostoresVivos()).toEqual(1);
        expect(partida.numCiudadanosVivos()).toEqual(3);
        expect(partida.gananCiudadanos()).toBe(false);
        expect(partida.gananImpostores()).toBe(false);
        partida.eliminarMasVotado();
        expect(partida.numImpostoresVivos()).toEqual(0);
        expect(partida.numCiudadanosVivos()).toEqual(3);
        expect(partida.gananCiudadanos()).toBe(true);
        expect(partida.gananImpostores()).toBe(false);
        expect(partida.fase.nombre).toEqual("final");
        expect(partida.fase.ganadores).toEqual("ciudadanos");
        expect(impostor.estado.nombre).toEqual("muerto");
      });
    }); 
  }); 
});