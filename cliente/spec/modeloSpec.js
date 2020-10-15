describe("El juego del impostor", function() {
  var juego;
  var usr;

  beforeEach(function() {
   juego=new Juego();
   usr=new Usuario ("Pepe",juego);
  });
it("inicialmente...", function() {
	expect(Object.keys(this.usuarios).length).toEqual(0);
  	expect(usr.nick).toEqual("Pepe");
  	expect(usr.juego).not.toBe(undefined);
  });

it ("el usr Pepe crear una partida de 4 jugadores",function(){
var codigo = usr.crearPartida(4);
  	expect(codigo).not.toBe(undefined);
  	expect(juego.partidas[codigo].nickOwner).toBe(true);
  });


	})


