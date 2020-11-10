class GamePlay extends Phaser.Scene {
  constructor() {
    super("gamePlay");
  }

  createAnim(animName, objectName, frameR, repeat, hide) {
    this.anims.create({
      key: animName,
      frames: this.anims.generateFrameNumbers(objectName),
      frameRate: frameR,
      repeat: repeat,
      hideOnComplete: hide,
    });
  }

  setRandomVelAndBounce(objectName) {
    var randVel = Phaser.Math.Between(100, 300);
    var randBounce = Phaser.Math.Between(1, 1);
    objectName.setVelocity(randVel, randVel);
    objectName.setBounce(1);
  }


  create() {
    // Fondo
    this.background = this.add.tileSprite(
      0,
      0,
      configuration.width,
      configuration.height,
      "gameBackground",
    );
    this.background.setOrigin(0, 0);


    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(configuration.width, 0);
    graphics.lineTo(configuration.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.lifes = 5;
    this.textScore =  this.add.text(5, 0, "Puntaje: " + this.score, { font: "16px Arial", fill: "white" });
    this.textTitle =  this.add.text(365, 0, "BulletDrizzle", { font: "20px Arial", fill: "white" });
    this.textlife = this.add.text(160, 0, "Vidas: " + this.lifes, { font: "16px Arial", fill: "white" });
    this.textTime = this.add.text(250, 0, "Tiempo: " + this.elapsed, { font: "16px Arial", fill: "white" });

    // Enemigos
    this.enemy1 = this.add.sprite(
      configuration.width / 2 - 150,
      configuration.height / 50,
      "bandit_1",
    );
    this.enemy1.speed = 3;

    this.createAnim("enemy1_anim", "bandit_1", 10, -1, false);

    this.enemy1.play("enemy1_anim");

    this.enemy2 = this.add.sprite(
      configuration.width / 2 - 50,
      configuration.height / 45,
      "bandit_2",
    );
    this.enemy2.speed = 4;

    this.createAnim("enemy2_anim", "bandit_2", 10, -1, false);

    this.enemy2.play("enemy2_anim");

    this.enemy3 = this.add.sprite(
      configuration.width / 2 + 50,
      configuration.height / 45,
      "bandit_3",
    );
    this.enemy3.speed = 5;

    this.createAnim("enemy3_anim", "bandit_3", 10, -1, false);

    this.enemy3.play("enemy3_anim");


    this.enemy4 = this.add.sprite(
      configuration.width / 2 + 150,
      configuration.height / 50,
      "bandit_4",
    );
    this.enemy4.speed = 6;

    this.createAnim("enemy4_anim", "bandit_4", 10, -1, false);

    this.enemy4.play("enemy4_anim");

    this.enemies = this.physics.add.group();
    this.enemies.add(this.enemy1);
    this.enemies.add(this.enemy2);
    this.enemies.add(this.enemy3);
    this.enemies.add(this.enemy4);


    this.enemies.getChildren().forEach((enemy) => {
      enemy.setScale(0.4);
    });


    // VFX
    this.createAnim("explode", "explosion", 20, 0, true);
    this.createAnim("power_up", "power_up", 20, -1, false);

    
    // Player 
    this.player = this.physics.add.sprite(
      configuration.width / 2 - 8,
      configuration.height - 64,
      "player",
      );

    this.createAnim("anim_player", "player", 10, -1, false);

    this.player.play("anim_player");

    this.player.setScale(0.6);
    this.player.setCollideWorldBounds(true);
    this.explosionSound = this.sound.add("explosion_sfx");

    // Proyectil
    this.createAnim("anim_bullet", "bullet", 20, -1, false);
    this.projectiles = this.add.group();
    this.projectilSound = this.sound.add("shoot_sfx");

    // Musica
    this.gameMusic = this.sound.add("game_music");

    var musicConfig = {
      mute: false,
      volume: 0.8,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    
    this.gameMusic.play(musicConfig);

    // Timer
    this.time_timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
      paused: true
    });


        
    // Input
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );

    // this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp){
    //   projectile.destroy();
    // });

    // Colisiones
    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

  }

  destroyEnemy(pointer, gameObject) {
    gameObject.setScale(5);
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  moveEnemy(enemy, speed) {
    var rand = Phaser.Math.Between(0, 5);
    enemy.y += speed + enemy.speed;

    if (enemy.y > configuration.height) {
      this.resetEnemyPosition(enemy);
      this.setScore(-500);
    }
  }

  margin = 30;
  resetEnemyPosition(enemy) {
    enemy.speed = Phaser.Math.Between(1, 10);
    enemy.y = 0;
    enemy.y = Phaser.Math.Between(-20, 0);
    var randX = Phaser.Math.Between(
      this.margin,
      configuration.width - this.margin,
    );
    enemy.x = randX;
  }

  backgroundSpeed = 10;
  scrollBackground() {
    this.background.tilePositionY += this.backgroundSpeed;
  }

  shootBullet(){
    var bullet1 = new Bullet(this, 10);
    var bullet2 = new Bullet(this, -10);
  }

  pickPowerUp(player, powerUp){
    powerUp.disableBody(true, true);
    this.player.alpha = 0.8;
    this.powerUpSound.play();
    this.time.addEvent({
      delay: 3000,
      callback: this.resetAlpha,
      callbackScope: this,
      loop: false
    });
  }

  resetAlpha(){
    if(this.player.active){
      this.player.alpha = 1;

    }
  }

  hurtPlayer(player, enemy){
    if(this.player.alpha < 1){
      return;
    }

    // EVENTO vidas
    this.lifes -= 1;
    this.textlife.text = "Vidas: " + this.lifes;
    if(this.lifes == 0){
      this.scene.stop();
      this.scene.start("gamePlay");
    }
    else{
      this.explosionSound.play();
      var explosion = new Explosion(this, player.x, player.y);
      explosion.setScale(6, 6);
      this.resetEnemyPosition(enemy);
      player.disableBody(true, true);
      this.setScore(-1500)
      this.time.addEvent({
        delay: 1500,
        callback: this.resetPlayer,
        callbackScope: this,
        loop: false
      });
    }
  }

  resetPlayer(){
    var x = configuration.width / 2 - 8;
    var y = configuration.height - 64;
    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = 0.5;

    var tween = this.tweens.add({
      targets: this.player,
      y:configuration.height - 64,
      ease: 'Power1',
      duration: 2000,
      repeat: 0,
      onComplete: function(){
        this.player.alpha = 1;
      },
      callbackScope: this
    });

  }

  hitEnemy(projectile, enemy){
    var explosion = new Explosion(this, enemy.x, enemy.y);
    explosion.setScale(4, 4);
    projectile.destroy();
    this.resetEnemyPosition(enemy);
    this.setScore(100);
    this.explosionSound.play();
  }

  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityY(0);
    }
  }


  // EVENTOS
  myWorker = new Worker("sw.js");
  sendMsg(eventName){
    this.myWorker.postMessage({"game": 'Bullet Drizzle', "event": eventName, "data": ''});
  }

  // EVENTO puntaje
  setScore(value){
    this.score += value;
    this.textScore.text = "Puntaje: " + this.score;
    //this.myWorker.postMessage({"game": 'Bullet Drizzle', "event": 'setScore', "data": ''});
    //this.myWorker.postMessage({"game": 'Bullet Drizzle', "event": 'setScore', "data": ''});
    this.myWorker.postMessage("setScore", "");
  }

  elapsed = 0;
  // EVENTO tiempo de juego
  updateTimer(){
    this.elapsed++;
    this.textTime.text = "Tiempo: " + this.elapsed;
  }

  // Loop principal
  can_loop = false;

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.can_loop = !this.can_loop;
      this.time_timer.paused = !this.time_timer.paused;
    }
 
    if (this.can_loop){
      this.time_timer.paused = false;
      this.enemies.getChildren().forEach((enemy) => {
        this.moveEnemy(enemy, 2);
      });

      this.scrollBackground();
      this.movePlayerManager();

      
      if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
        if (this.player.active){
          this.shootBullet();
          this.projectilSound.play();
          // EVENTO disparar
        }
      }
      for (let index = 0; index < this.projectiles.getChildren().length; index++) {
        var bullet = this.projectiles.getChildren()[index];
        bullet.update();
        
      }

    }

  }
}
