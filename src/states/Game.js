/* globals __DEV__ */
import Phaser from 'phaser';

export default class extends Phaser.State {
  init () {
    this.platforms = {};
    this.ground = {};
    this.player = {};
    this.cursors = {};
    this.spikes = {};
    this.score = 0;
    this.scoreText = {};
  }

  preload () {}

  create () {
    var platforms = this.platforms;
    var ground = this.ground;
    var player = this.player;
    var cursors = this.cursors;
    var spikes = this.spikes;
    var score = this.score;
    var scoreText = this.scoreText;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();
    platforms.enableBody = true;

    ground = platforms.create(0, game.world.height - 20, 'ground');
    ground.scale.setTo(game.world.width, 1);
    ground.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 200, 'player');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();

    spikes = game.add.group();
    spikes.enableBody = true;

    for(var i = 0; i < 5; i++) {
      //Should align the height based on the position of the ground
      var spike = spikes.create(i * 150, game.world.height - 100, 'spike');
      spike.body.gravity.y = 300;
    }

    scoreText = game.add.text(16, 16, `Score: ${score}`, { fontSize: '18px', fill: '#222' });

    this.platforms = platforms;
    this.ground = ground;
    this.player = player;
    this.cursors = cursors;
    this.spikes = spikes;
    this.score = score;
    this.scoreText = scoreText;
  }

  update (){

    var platforms = this.platforms;
    var ground = this.ground;
    var player = this.player;
    var cursors = this.cursors;
    var spikes = this.spikes;
    var score = this.score;
    var scoreText = this.scoreText;

    //Collide player and platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(spikes, platforms);
    game.physics.arcade.overlap(player, spikes, this.playerDies, null, this);

    //Player movement
    player.body.velocity.x = 0;
    // spikes.body.velocity.x = 0;

    if(cursors.up.isDown && player.body.touching.down){
      player.body.velocity.y = -250;
    }
    if(cursors.left.isDown) {
      player.body.velocity.x = -150;
    }
    if(cursors.right.isDown) {
      player.body.velocity.x = 150;
    }

    score += 1;
    scoreText.text = `Score: ${score}`;

    this.platforms = platforms;
    this.ground = ground;
    this.player = player;
    this.cursors = cursors;
    this.spikes = spikes;
    this.score = score;
    this.scoreText = scoreText;
  }

  playerDies () {
    game.score = this.score;
    game.scoreText = this.scoreText;
    this.state.start('End');
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32);
    }
  }
}
