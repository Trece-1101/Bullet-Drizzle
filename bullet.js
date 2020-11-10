class Bullet extends Phaser.GameObjects.Sprite{
    constructor(scene, xDisplacement){
        var x = scene.player.x + xDisplacement;
        var y = scene.player.y - 32;

        super(scene, x, y, "bullet");
        this.setScale(0.6);
        scene.add.existing(this);
        this.play("anim_bullet");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -1000;


        scene.projectiles.add(this);
    }

    update(){
        if(this.y < 50){
            this.destroy();
        }
    }


}