import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    this.score = game.score;
  }

  preload () {
  }

  create () {
    var score = this.score;
    var scoreText;
    game.add.text(16, 20, `Game Over`, { fontSize:'14px', fill:'#222'});
    game.add.text(16, 50, `End Score: ${score}`, { fontSize: '18px', fill: '#222' });
  }

  update(){
  }
}
