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
    var randBounce = Phaser.Math.Between(1, 1.01);
    objectName.setVelocity(randVel, randVel);
    objectName.setBounce(randBounce);
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
    this.textScore =  this.add.text(5, 0, "Puntaje: " + this.score, { font: "20px Arial", fill: "white" });
    this.textTitle =  this.add.text(365, 0, "BulletDrizzle", { font: "20px Arial", fill: "white" });

    // Enemigos
    this.enemy1 = this.add.sprite(
      configuration.width / 2 - 150,
      configuration.height / 2,
      "bandit_1",
    );

    this.createAnim("enemy1_anim", "bandit_1", 10, -1, false);

    this.enemy1.play("enemy1_anim");

    this.enemy2 = this.add.sprite(
      configuration.width / 2 - 50,
      configuration.height / 2,
      "bandit_2",
    );

    this.createAnim("enemy2_anim", "bandit_2", 10, -1, false);

    this.enemy2.play("enemy2_anim");

    this.enemy3 = this.add.sprite(
      configuration.width / 2 + 50,
      configuration.height / 2,
      "bandit_3",
    );

    this.createAnim("enemy3_anim", "bandit_3", 10, -1, false);

    this.enemy3.play("enemy3_anim");


    this.enemy4 = this.add.sprite(
      configuration.width / 2 + 150,
      configuration.height / 2,
      "bandit_4",
    );

    this.createAnim("enemy4_anim", "bandit_4", 10, -1, false);

    this.enemy4.play("enemy4_anim");

    this.enemies = this.physics.add.group();
    // this.enemies = [this.enemy1, this.enemy2, this.enemy3, this.enemy4];
    this.enemies.add(this.enemy1);
    this.enemies.add(this.enemy2);
    this.enemies.add(this.enemy3);
    this.enemies.add(this.enemy4);

    console.log(this.enemies.getChildren())

    this.enemies.getChildren().forEach((enemy) => {
      enemy.setScale(0.4);
    });

    this.enemies.getChildren().forEach((enemy) => {
      enemy.setInteractive();
    });

    this.input.on("gameobjectdown", this.destroyEnemy, this);



    // VFX
    this.createAnim("explode", "explosion", 20, 0, true);
    this.createAnim("power_up", "power_up", 20, -1, false);

    // Powerups
    this.powerUps = this.physics.add.group();
    var maxPowerUps = 5;
    for (let index = 0; index < maxPowerUps; index++) {
      var powerUp = this.physics.add.sprite(16, 16, "power_up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(
        0,
        0,
        configuration.width,
        configuration.height,
      );
      powerUp.setScale(1.5);
      //powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      //powerUp.setBounce(1);
      this.setRandomVelAndBounce(powerUp);
    }

    
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

    // Proyectil
    this.createAnim("anim_bullet", "bullet", 20, -1, false);
    this.projectiles = this.add.group();


        
    // Input
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp){
      projectile.destroy();
    });

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
    enemy.y += speed;
    //enemy.x += speed.x;

    if (enemy.y > configuration.height) {
      this.resetEnemyPosition(enemy);
    }
  }

  margin = 30;
  resetEnemyPosition(enemy) {
    enemy.y = 0;
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
    var bullet = new Bullet(this);
  }

  pickPowerUp(player, powerUp){
    powerUp.disableBody(true, true);
  }

  hurtPlayer(player, enemy){
    this.resetEnemyPosition(enemy);
    player.x = configuration.width / 2 - 8;
    player.y = configuration.height - 64;
    this.score -= 500;
    this.textScore.text = "Puntaje: " + this.score;
  }

  hitEnemy(projectile, enemy){
    projectile.destroy();
    this.resetEnemyPosition(enemy);
    this.score += 100;
    this.textScore.text = "Puntaje: " + this.score;
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

  update() {
    this.enemies.getChildren().forEach((enemy) => {
      this.moveEnemy(enemy, 2);
    });

    this.scrollBackground();

    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shootBullet();
      console.log("Fire");
    }
    for (let index = 0; index < this.projectiles.getChildren().length; index++) {
      var bullet = this.projectiles.getChildren()[index];
      bullet.update();
      
    }

  }
}
