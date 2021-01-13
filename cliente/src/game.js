  /**
   * Author: Michael Hadley, mikewesthad.com
   * Asset Credits:
   *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
   */

  function lanzarJuego(){
   game = new Phaser.Game(config);
  }




  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  //const game = new Phaser.Game(config);
  let game;
  let cursors;
  let player;
  //let player2;
  var jugadores=[];//la coleccion de jugadores remotos
  let map;
  var worldLayer;
  var crear;
  let camera;
  var spawnPoint;
  var capaTareas;
  var tareasOn=true;
  //en el caso de tener una hoja con muchos:
  var recursos=[{frame:0, sprite:"ana"}, {frame:3, sprite:"tom"}, {frame:9, sprite:"loi"}];
  let showDebug = false;
  var remotos;  
  var muertos;
  var followText;
  var followTextRemoto=[];
  var followTextRemotoMuerto;
  var ataquesOn=true;
  var final=false;

  function preload(){
    this.load.image("tiles", "cliente/assets/tilesets/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "cliente/assets/tilemaps/tuxemon-town.json");

    this.load.spritesheet("varios","cliente/assets/images/plantillaPersonajes.png",{frameWidth:24,frameHei‌ght:43});‌ 
    this.load.spritesheet("muertos1","cliente/assets/images/muertos1.png",{frameWidth:24,frameHei‌ght:26});‌ 
    this.load.spritesheet("muertos2","cliente/assets/images/muertos2.png",{frameWidth:24,frameHei‌ght:26});‌ 
  }

  function create(){
      crear=this;
      map = crear.make.tilemap({key:"map"});

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const decoracion = map.createStaticLayer("decoracion", tileset, 0, 0);
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    capaTareas = map.createStaticLayer("capaTareas", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });
    capaTareas.setCollisionByProperty({ collides: true });

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10);
    decoracion.setDepth(11);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
    //player = this.physics.add
      //.sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
      //.setSize(30, 40)
      //.setOffset(0, 24);
      //ws.movimiento(player.body.x,player.body.y);
    // Watch the player and worldLayer for collisions, for the duration of the scene:
    //player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y,"vieja");
    // Watch the player and worldLayer for collisions, for the duration of the scene:
    //this.physics.add.collider(player, worldLayer);

          //animacion del personaje
          //CREAR UNA ANIMACION POR CADA PERSONAJE


          //----------------------------PERSONAJE 1 LUCAS-------------------------------------
          const anims1 = crear.anims;
                anims1.create({
                  key: "lucas-left-walk",
                  frames: anims1.generateFrameNames("lucas", {
                    //prefix: "misa-left-walk.",
                    start: 3,
                    end: 5,
                    //zeroPad: 3
                  }),
                  //frameRate: 10,
                  repeat: -1
                });
                anims1.create({
                  key: "lucas-right-walk",
                  frames: anims1.generateFrameNames("lucas", {
                    //prefix: "misa-left-walk.",
                    start: 6,
                    end: 8,
                    //zeroPad: 3
                  }),
                  //frameRate: 10,
                  repeat: -1
                });
                anims1.create({
                  key: "lucas-front-walk",
                  frames: anims1.generateFrameNames("lucas", {
                    //prefix: "misa-left-walk.",
                    start: 0,
                    end: 2,
                    //zeroPad: 3
                  }),
                  //frameRate: 10,
                  repeat: -1
                });
                anims1.create({
                  key: "lucas-back-walk",
                  frames: anims1.generateFrameNames("lucas", {
                    //prefix: "misa-left-walk.",
                    start: 9,
                    end: 11,
                    //zeroPad: 3
                  }),
                  //frameRate: 10,
                  repeat: -1
                });



           //----------------------------PERSONAJE 2 ANA-------------------------------------

              const anims2 = this.anims;
                    anims2.create({
                      key: "ana-left-walk",
                      frames: anims2.generateFrameNames("ana", {
                        //prefix: "misa-left-walk.",
                        start: 3,
                        end: 5,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims2.create({
                      key: "ana-right-walk",
                      frames: anims2.generateFrameNames("ana", {
                        //prefix: "misa-left-walk.",
                        start: 6,
                        end: 8,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims2.create({
                      key: "ana-front-walk",
                      frames: anims2.generateFrameNames("ana", {
                        //prefix: "misa-left-walk.",
                        start: 0,
                        end: 2,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims2.create({
                      key: "ana-back-walk",
                      frames: anims2.generateFrameNames("ana", {
                        //prefix: "misa-left-walk.",
                        start: 9,
                        end: 11,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    //----------------------------PERSONAJE 3 GEORGE-------------------------------------
                    const anims3 = this.anims;
                    anims3.create({
                      key: "george-left-walk",
                      frames: anims3.generateFrameNames("george", {
                        //prefix: "misa-left-walk.",
                        start: 3,
                        end: 5,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims3.create({
                      key: "george-right-walk",
                      frames: anims3.generateFrameNames("george", {
                        //prefix: "misa-left-walk.",
                        start: 6,
                        end: 8,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims3.create({
                      key: "george-front-walk",
                      frames: anims3.generateFrameNames("george", {
                        //prefix: "misa-left-walk.",
                        start: 0,
                        end: 2,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims3.create({
                      key: "george-back-walk",
                      frames: anims3.generateFrameNames("george", {
                        //prefix: "misa-left-walk.",
                        start: 9,
                        end: 11,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });


                    //----------------------------PERSONAJE 4 MATILDA-------------------------------------
                     const anims4 = this.anims;
                    anims4.create({
                      key: "matilda-left-walk",
                      frames: anims4.generateFrameNames("matilda", {
                        //prefix: "misa-left-walk.",
                        start: 3,
                        end: 5,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims4.create({
                      key: "matilda-right-walk",
                      frames: anims4.generateFrameNames("matilda", {
                        //prefix: "misa-left-walk.",
                        start: 6,
                        end: 8,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims4.create({
                      key: "matilda-front-walk",
                      frames: anims4.generateFrameNames("matilda", {
                        //prefix: "misa-left-walk.",
                        start: 0,
                        end: 2,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims4.create({
                      key: "matilda-back-walk",
                      frames: anims4.generateFrameNames("matilda", {
                        //prefix: "misa-left-walk.",
                        start: 9,
                        end: 11,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });


                     //----------------------------PERSONAJE 5 RIGOBERTO-------------------------------------
                     const anims5 = this.anims;
                    anims5.create({
                      key: "rigoberto-left-walk",
                      frames: anims5.generateFrameNames("rigoberto", {
                        //prefix: "misa-left-walk.",
                        start: 3,
                        end: 5,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims5.create({
                      key: "rigoberto-right-walk",
                      frames: anims5.generateFrameNames("rigoberto", {
                        //prefix: "misa-left-walk.",
                        start: 6,
                        end: 8,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims5.create({
                      key: "rigoberto-front-walk",
                      frames: anims5.generateFrameNames("rigoberto", {
                        //prefix: "misa-left-walk.",
                        start: 0,
                        end: 2,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims5.create({
                      key: "rigoberto-back-walk",
                      frames: anims5.generateFrameNames("rigoberto", {
                        //prefix: "misa-left-walk.",
                        start: 9,
                        end: 11,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });


                     //----------------------------PERSONAJE 6 ELISA-------------------------------------
                     const anims6 = this.anims;
                    anims6.create({
                      key: "elisa-left-walk",
                      frames: anims6.generateFrameNames("elisa", {
                        //prefix: "misa-left-walk.",
                        start: 3,
                        end: 5,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims6.create({
                      key: "elisa-right-walk",
                      frames: anims6.generateFrameNames("elisa", {
                        //prefix: "misa-left-walk.",
                        start: 6,
                        end: 8,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims6.create({
                      key: "elisa-front-walk",
                      frames: anims6.generateFrameNames("elisa", {
                        //prefix: "misa-left-walk.",
                        start: 0,
                        end: 2,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims6.create({
                      key: "elisa-back-walk",
                      frames: anims6.generateFrameNames("elisa", {
                        //prefix: "misa-left-walk.",
                        start: 9,
                        end: 11,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });


                     //----------------------------PERSONAJE 7 PITOLLO-------------------------------------
                     const anims7 = this.anims;
                    anims7.create({
                      key: "pitollo-left-walk",
                      frames: anims7.generateFrameNames("pitollo", {
                        //prefix: "misa-left-walk.",
                        start: 3,
                        end: 5,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims7.create({
                      key: "pitollo-right-walk",
                      frames: anims7.generateFrameNames("pitollo", {
                        //prefix: "misa-left-walk.",
                        start: 6,
                        end: 8,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims7.create({
                      key: "pitollo-front-walk",
                      frames: anims7.generateFrameNames("pitollo", {
                        //prefix: "misa-left-walk.",
                        start: 0,
                        end: 2,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims7.create({
                      key: "pitollo-back-walk",
                      frames: anims7.generateFrameNames("pitollo", {
                        //prefix: "misa-left-walk.",
                        start: 9,
                        end: 11,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });


                    //----------------------------PERSONAJE 8 PILAR-------------------------------------
                     const anims8 = this.anims;
                    anims8.create({
                      key: "pilar-left-walk",
                      frames: anims8.generateFrameNames("pilar", {
                        //prefix: "misa-left-walk.",
                        start: 3,
                        end: 5,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims8.create({
                      key: "pilar-right-walk",
                      frames: anims8.generateFrameNames("pilar", {
                        //prefix: "misa-left-walk.",
                        start: 6,
                        end: 8,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims8.create({
                      key: "pilar-front-walk",
                      frames: anims8.generateFrameNames("pilar", {
                        //prefix: "misa-left-walk.",
                        start: 0,
                        end: 2,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });
                    anims8.create({
                      key: "pilar-back-walk",
                      frames: anims8.generateFrameNames("pilar", {
                        //prefix: "misa-left-walk.",
                        start: 9,
                        end: 11,
                        //zeroPad: 3
                      }),
                      //frameRate: 10,
                      repeat: -1
                    });


        

         // const camera = this.cameras.main;
          //camera.startFollow(player);
          //camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

            cursors = crear.input.keyboard.createCursorKeys();
            remotos=crear.add.group();
            muertos = crear.add.group();
            teclaA=crear.input.keyboard.addKey('a');
            teclaV=crear.input.keyboard.addKey('v');
            teclaT=crear.input.keyboard.addKey('t');
            lanzarJugador(ws.nick,ws.numJugador,ws.numJugador);
            ws.estoyDentro();

  }



  function tareas(sprite,objeto){
    if(ws.encargo==objeto.properties.tarea && teclaT.isDown){
     tareasOn=false;
      console.log("realizar tarea"+ws.encargo);
     // ws.realizarTarea();//o hacer la llamada dentro del control web
      cw.mostrarModalTarea(ws.encargo);
    }
  }

  function lanzarJugador(nick,numJugador){
    var x=spawnPoint.x+numJugador*24+2;
      player = crear.physics.add.sprite(spawnPoint.x, spawnPoint.y,"varios",recursos[numJugador].frame);    
      // Watch the player and worldLayer for collisions, for the duration of the scene:
      crear.physics.add.collider(player, worldLayer);
       crear.physics.add.collider(player,capaTareas, tareas,()=>{return tareasOn});
      //crear.physics.add.collider(player2, worldLayer);
      jugadores[nick] = player;
      jugadores[nick].nick = nick;
      jugadores[nick].numJugador = numJugador;
      camera = crear.cameras.main;
      camera.startFollow(player);
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      camera.setZoom(2);
      //camera.setSize(200);
      this.followText = crear.add.text(0, 0, jugadores[nick].nick);

    }


  function lanzarJugadorRemoto(nick, numJugador){
    var x=spawnPoint.x+numJugador*24+2;
    var frame=recursos[numJugador].frame;
   jugadores[nick]=crear.physics.add.sprite(x, spawnPoint.y,"varios",frame);   
    crear.physics.add.collider(jugadores[nick], worldLayer);
    jugadores[nick].nick = nick;
    jugadores[nick].numJugador = numJugador;
    remotos.add(jugadores[nick]);
    this.followTextRemoto[numJugador] = crear.add.text(0, 0, jugadores[nick].nick);
    
  }
    
     function crearColision(){
        if(crear && ws.impostor){
          crear.physics.add.overlap(player,remotos,kill,()=>{return ataquesOn});
        }
     }

    function kill(sprite, inocente){
      //dibujar el inocente muerto
      //avisar al servidor
      var nick=inocente.nick;
      //console.log("atacando a"+nick);
      
       if(teclaA.isDown){
        //console.log('muere inocente');
        ataquesOn=false;
        ws.atacar(nick);
        }
    }

    function dibujarInocenteMuerto(inocente){
      var x=jugadores[inocente].x;
      var y =jugadores[inocente].y;
      var numJugador=jugadores[inocente].numJugador;

      var muerto=crear.physics.add.sprite(x,y,"muertos", recursos[numJugador].frame);
      muertos.add(muerto);
      crear.physics.add.overlap(player,muertos,votacion);
    }

    function votaciones(sprite, muerto){
      if(teclaV.isDown){
        ws.echarVotacion();
      }
    }

 




  function mover(datos){

    var direccion=datos.direccion;
    var nick=datos.nick;
    var numJugador=datos.numJugador;
    var x= datos.x;
    var y= datos.y;
    var remoto=jugadores[nick];
    const speed = 175;

     // const prevVelocity = player.body.velocity.clone();
      const nombre=recursos[numJugador].sprite;
     if (remoto && !final){
    
        remoto.body.setVelocity(0);
        remoto.setX(x);
        remoto.setY(y);
        remoto.body.velocity.normalize().scale(speed);
      if (direccion=="left") {
        remoto.anims.play(nombre+"-left-walk", true);
      } else if (direccion=="right") {
        remoto.anims.play(nombre+"-right-walk", true);
      } else if (direccion=="up") {
        remoto.anims.play(nombre+"-back-walk", true);
      } else if (direccion=="down") {
        remoto.anims.play(nombre+"-front-walk", true);
      } else {
        remoto.anims.stop();
      }
    }
 }


/*  function moverRemoto(direccion,nick,numJugador){
     var remoto = jugadores[nick];
    const speed = 175;
    //const prevVelocity = player.body.velocity.clone();

    const nombre=recursos[numJugador].sprite;

    // Stop any previous movement from the last frame
    remoto.body.setVelocity(0);
    //player2.body.setVelocity(0);

    // Horizontal movement
    if (direccion == "left") {
      remoto.body.setVelocityX(-speed);
    } else if (direccion == "right") {
      remoto.body.setVelocityX(speed);
    }

    // Vertical movement
    if (direccion == "up") {
      remoto.body.setVelocityY(-speed);
    } else if (direccion == "down") {
      remoto.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (direccion == "left") {
      remoto.anims.play(nombre+"-left-walk", true);
    } else if (direccion == "right") {
      remoto.anims.play(nombre+"-right-walk", true);
    } else if (direccion == "up") {
      remoto.anims.play(nombre+"-back-walk", true);
    } else if (direccion == "down") {
      remoto.anims.play(nombre+"-front-walk", true);
    } else {
      remoto.anims.stop();  
    }
  }
*/

  function finPartida(data){
    final=true;
    //remoto=undefined;
    cw.mostrarModalSimple("Fin de la Partida"+data);
  }
function update(time, delta) {

     const speed = 175;
  //const prevVelocity = player.body.velocity.clone();
    var direccion= "stop";
  const nombre=recursos[ws.numJugador].sprite;
  if(!final){
  // Stop any previous movement from the last frame
  player.body.setVelocity(0);
  //player2.body.setVelocity(0);

  

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
    direccion="left";
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
   direccion="right";
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
    direccion="up";
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
    direccion="down";
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);
  ws.movimiento(direccion,player.body.x,player.body.y);
  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play(nombre+"-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play(nombre+"-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play(nombre+"-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play(nombre+"-front-walk", true);
  } else {
    player.anims.stop();

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);
  }
}


}