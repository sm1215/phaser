/* globals __DEV__ */
import Phaser from 'phaser';

export default class extends Phaser.State {
  init () {
    this.platforms = {};
    this.ground = {};
    this.player = {};
    this.cursors = {};
    this.spikes = {};
    this.spikeLimit = 5;
    this.spikeRespawnTime = 0;
    this.spikeRespawnLimits = { min: 3000, max: 5000 }; //ms
    this.spikeDied = 0;
    this.spikeSpawned = 0;
    this.score = 0;
    this.scoreText = {};
  }

  preload () {}

  create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.platforms = game.add.group();
    this.platforms.enableBody = true;

    this.ground = this.platforms.create(0, game.world.height - 20, 'ground');
    this.ground.scale.setTo(game.world.width * 2, 1);
    this.ground.body.immovable = true;

    this.player = game.add.sprite(32, game.world.height - 200, 'player');
    game.physics.arcade.enable(this.player);
    this.player.width = 40;
    this.player.height = 70;
    this.player.body.gravity.y = 500;
    this.player.body.collideWorldBounds = true;

    this.cursors = game.input.keyboard.addKeys({ 'up': Phaser.KeyCode['SPACEBAR'] })

    this.spikes = game.add.group();
    this.spikes.enableBody = true;

    for(var i = 0; i < this.spikeLimit; i++) {
      var spike = this.spikes.create(i * 300, game.world.height - 100, 'spike');
      spike.body.gravity.y = 300;
    }

    this.scoreText = game.add.text(16, 16, `Score: ${this.score}`, { fontSize: '18px', fill: '#222' });
  }

  update (){
    //Collide player and platforms
    game.physics.arcade.collide([this.player, this.spikes], this.platforms);
    // leaving out the death condition for now
    // game.physics.arcade.overlap(this.player, this.spikes, this.playerDies, null, this);

    //Scroll everything
    this.platforms.forEach((platform) => {
      platform.body.velocity.x = -100;
    });
    //There's some weirdness with this check where the player's velocity gets brought back up to 100 with a slight delay causing them to slide backwards slightly.
    if(this.player.body.touching.down){
      this.player.body.velocity.x = 100;
    }
    if(this.player.body.wasTouching.down && !this.player.body.touching.down){
      this.player.body.velocity.x = 3;
    }
    //End weirdness hacky fix - probably a better way to do this

    if(this.cursors.up.isDown && this.player.body.touching.down){
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = -250;
    }

    //Check if spike has scrolled off to the left
    this.spikes.forEach((spike) => {
      if(spike.position.x < (0 - spike.width)){
        spike.kill();
        spike.position.x = game.world.width + spike.width;
        this.spikeDied = window.performance.now();
        this.spikeRespawnTime = this.spikeRespawnLimits.min + this.spikeRespawnLimits.max * Math.random();
      }
    });

    //Check if we need to spawn a new spike
    if((this.spikes.countLiving() < this.spikeLimit)){
      let spike = this.spikes.getFirstDead();
      let now = window.performance.now();
      if(now - this.spikeDied > this.spikeRespawnTime && now - this.spikeSpawned > this.spikeRespawnTime){
        spike.alive = true;
        spike.exists = true;
        spike.visible = true;
        this.spikeSpawned = now;
      }
    }

    this.score += 1;
    this.scoreText.text = `Score: ${this.score}`;
  }

  playerDies () {
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
