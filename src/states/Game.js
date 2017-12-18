/* globals __DEV__ */
import Phaser from 'phaser';

export default class extends Phaser.State {
  init () {
    this.platforms = {};
    this.ground = {};
    this.player = {};
    this.playerRunSpeed = 175;
    this.playerJumpSpeed = 250;
    this.cursors = {};
    this.buttons = {};
    this.buttonLimit = 3;
    this.buttonRespawnTime = 0;
    this.buttonRespawnLimits = { min: 0.2, max: 0.5 }; //ms
    this.buttonDied = 0;
    this.buttonSpawned = 0;
    this.score = 0;
    this.scoreText = {};
  }

  preload () {
    game.load.spritesheet('button', 'assets/sprites/button-sprite-sheet.png', 30, 30);
  }

  create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.platforms = game.add.group();
    this.platforms.enableBody = true;

    this.ground = this.platforms.create(0, game.world.height - 20, 'ground');
    this.ground.scale.setTo(game.world.width * 2, 1);
    this.ground.body.immovable = true;

    this.player = game.add.sprite(32, game.world.height - 200, 'player');
    game.physics.arcade.enable(this.player);
    this.player.runSpeed = this.playerRunSpeed;
    this.player.jumpSpeed = this.playerJumpSpeed;
    this.player.width = 40;
    this.player.height = 70;
    this.player.body.gravity.y = 500;
    this.player.body.collideWorldBounds = true;

    this.cursors = game.input.keyboard.addKeys({
      'up': Phaser.KeyCode['SPACEBAR'],
      'right': Phaser.KeyCode['D'],
      'left': Phaser.KeyCode['A']
    });

    this.buttons = game.add.group();
    this.buttons.enableBody = true;

    for(var i = 0; i < this.buttonLimit; i++) {
      var button = this.buttons.create(i * 300, game.world.height - 100, 'button');
      button.animations.add('press', true)
      button.body.gravity.y = 300;
      button.width = 30;
      button.height = 30;
      this.buttons.add(button);
    }

    this.scoreText = game.add.text(16, 16, `Score: ${this.score}`, { fontSize: '18px', fill: '#222' });
  }

  update (){
    //Collide player and platforms
    game.physics.arcade.collide([this.player, this.buttons], this.platforms);
    // leaving out the death condition for now
    game.physics.arcade.overlap(this.player, this.buttons, this.playerDies, null, this);

    //Scroll everything
    this.platforms.forEach((platform) => {
      platform.body.velocity.x = -100;
    });
    //There's some weirdness with this check where the player's velocity gets brought back up to 100 with a slight delay causing them to slide backwards slightly.
    // if(this.player.body.touching.down){
    //   this.player.body.velocity.x = 100;
    // }
    // if(this.player.body.wasTouching.down && !this.player.body.touching.down){
    //   this.player.body.velocity.x = 3;
    // }
    //End weirdness hacky fix - probably a better way to do this

    this.player.body.velocity.x = 0;

    //should set a control value for player velocity with something like "speed" and modify that value based on player's current action.
    if(this.cursors.right.isDown){
      this.player.body.velocity.x = this.player.runSpeed;
    }
    if(this.cursors.left.isDown){
      this.player.body.velocity.x = -Math.abs(this.player.runSpeed / 2);//-85;
    }
    if(!this.player.body.touching.down){
      this.player.body.velocity.x = this.player.runSpeed / 2;
    }

    if(this.cursors.up.isDown && this.player.body.touching.down){
      // this.player.body.velocity.x = 0;
      this.player.body.velocity.y = -Math.abs(this.player.jumpSpeed);
    }

    //Check if button has scrolled off to the left
    this.buttons.forEach((button) => {
      if(button.position.x < (0 - button.width)){
        button.kill();
        button.position.x = game.world.width + button.width;
        this.buttonRespawnTime = (Math.random() * (this.buttonRespawnLimits.max - this.buttonRespawnLimits.min) + this.buttonRespawnLimits.min) * 10000;
      }
    });

    //Check if we need to spawn a new button
    if((this.buttons.countLiving() < this.buttonLimit)){
      let button = this.buttons.getFirstDead();
      let now = window.performance.now();

      if(now - this.buttonSpawned > this.buttonRespawnTime){
        button.alive = true;
        button.exists = true;
        button.visible = true;
        this.buttonSpawned = now;
      }
    }

    this.score += 1;
    this.scoreText.text = `Score: ${this.score}`;
  }

  playerDies (player, button) {

    console.log('end score', this.score);


    // game.score = this.score;
    // this.state.start('End');
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32);
    }
  }
}
